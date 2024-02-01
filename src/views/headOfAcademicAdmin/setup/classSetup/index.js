import React, {useEffect, useState, useRef} from "react"
import {Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap"
import ListSelect from '@components/list-select'
import AddClassStudentModel from '@components/add-class-student'
import SideModel from '@components/list-select/list-select-side-model'
import * as ApiCounsellor from "@api/counsellor"
import * as Api from "@api/haa"
import moment from "moment"
import {DATE_FORMAT, CLASS_SETUP_EXPORT_TEMPLATE_CSV_HEADER} from '@const'
import * as ApiIt from "@api/itAdmin"
import Select from "react-select"
import classnames from "classnames"
import {selectThemeColors} from '@utils'
import ExportMenu from '@components/export-menu'
import {basicInfo} from '@configs/basicInfomationConfig'

const App = () => {

    const [schools, setSchools] = useState([])
    const [courses, setCourses] = useState([])
    const [batches, setBatches] = useState([])
    const [exports, setExports] = useState([])
    const [modules, setModules] = useState([])
    const [classes, setClasses] = useState([])
    const [classesChange, setClassesChange] = useState([])
    const [students, setStudents] = useState([])
    const [selectedClass, setSelectedClass] = useState(undefined)
    const [selectedValues, setSelectedValues] = useState({
        schoolId: undefined,
        moduleId: undefined,
        course: undefined,
        class: undefined,
        student: undefined
    })
    const [modelOpen, setModelOpen] = useState({
        class: false,
        student: false,
        changeClass: false
    })
    const csvLinkEl = useRef(null)

    useEffect(async () => {
        await getAllSchools()
        await getAllCourses()
        await getAllModules()
    }, [])

    const getAllSchools = async () => {
        const res = await ApiIt.getAllSchools()
        setSchools(res.map(item => {
            return {...item, name: item.label, id: item.value}
        }))
    }

    const getAllCourses = async (schoolId) => {
        const res = await ApiCounsellor.getAllCourses(schoolId ? `courses?schoolId=${schoolId.value}` : undefined)
        setCourses(res.map(item => {
            return {label: item.courseName, value: item.courseId}
        }))
    }

    const getAllModules = async (school, course) => {
        // let res = await Api.getAllModulesForClassSetup(school, course)
        let res = await Api.getModulesBySemester(school, course)
        let count = 0
        res = res.map(item => {
            const d = {...item, name: item.moduleName, id: item.moduleId, code: item.moduleCode, count}
            count > 6 ? count = 0 : count += 1
            return d
        })
        setModules(res)
    }

    const toggleModal = (name) => {
        setModelOpen({
            ...modelOpen,
            [name]: !modelOpen[name]
        })
    }

    const onSelect = async (name, id) => {
        let res
        switch (name) {
            case 'schoolId':
                await setSelectedValues({
                    schoolId: id,
                    courseId: undefined,
                    moduleId: undefined,
                    class: undefined,
                    student: undefined
                })
                await getAllCourses(id)
                await getAllModules(id)
                break

            case 'course':
                setSelectedValues({
                    ...selectedValues,
                    course: id,
                    moduleId: undefined,
                    class: undefined,
                    student: undefined
                })
                await getAllModules(selectedValues.schoolId, id)
                break
            case 'moduleId':
                setSelectedValues({...selectedValues, moduleId: id, class: undefined, student: undefined})
                res = await Api.getAllModuleClasses(id)
                res = res.map(item => {
                    return {...item, name: item.className, id: item.classId, code: item.classCode}
                })
                setClasses(res)
                break
            case 'class':
                setSelectedValues({...selectedValues, class: id, student: undefined})
                res = await Api.getAllClassStudents(id.id, null, null)
                let count = 0
                res = res.content.map(item => {
                    const d = {...item, name: item.studentName, id: item.studentId, code: item.cbNumber, count}
                    count > 6 ? count = 0 : count += 1
                    return d
                })
                setStudents(res)
                break
            case 'student':
                setSelectedValues({...selectedValues, student: id})
                res = await Api.getAllClassesForChangeClass(selectedValues.class.id, id.id)
                res = res.map(item => {
                    return {...item, label: item.className, value: item.classId}
                })
                setClassesChange(res)
                toggleModal('changeClass')
                break
        }
    }

    const onAdd = async (name) => {
        let res = []
        switch (name) {
            case 'class':
                res = await Api.getAllBatches(`batches?moduleId=${selectedValues.moduleId}`)
                if (res) {
                    setSelectedClass(undefined)
                    setBatches(res.map(item => {
                        return {label: item.batchCode, value: item.batchId, ...item}
                    }))
                }
                break
        }
        // const data = {...modelLists}
        // data[name] =  res
        // setModelLists(data)
        toggleModal(name)
    }

    const onSave = async (name, data) => {
        let res = undefined
        switch (name) {
            case 'class':
                const batches = (data.batchId && data.batchId.length > 0) ? data.batchId.map(item => {
                    return item.value
                }) : []

                res = await Api.saveClass(selectedValues.moduleId,
                    {
                        ...data,
                        batches,
                        from: moment(data.startDate).format(DATE_FORMAT),
                        to: moment(data.endDate).format(DATE_FORMAT)
                    })
                if (res) {
                    toggleModal(name)
                    await onSelect('moduleId', selectedValues.moduleId)
                }
                break
            case 'changeClass':
                res = await Api.changeClass({
                    studentId: selectedValues.student.id,
                    newClassId: data.value,
                    currentClassId: selectedValues.class.id
                })
                if (res) {
                    toggleModal(name)
                    await onSelect('class', selectedValues.class)
                }
                break
        }
    }

    const exportData = async () => {
        const res = await Api.getAllModuleStudents(selectedValues.moduleId)
        if (res.length > 0) {
            setExports(res)
            return {content: res}
            //csvLinkEl.current.link.click()
        }
    }

    const onEdit = async (name, data) => {
        setSelectedClass(data)
        const res = await Api.getAllBatches(`batches?moduleId=${selectedValues.moduleId}`)
        if (res) {
            setBatches(res.map(item => {
                return {label: item.batchCode, value: item.batchId, ...item}
            }))
        }
        toggleModal('class')
    }

    return (
        <div>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Class Setup</CardTitle>

                    {
                        selectedValues.moduleId && <>
                            {/*<CSVLink*/}
                            {/*    headers={CLASS_SETUP_EXPORT_TEMPLATE_CSV_HEADER}*/}
                            {/*    data={exports}*/}
                            {/*    ref={csvLinkEl}*/}
                            {/*    filename={"class_setup.csv"}*/}
                            {/*/>*/}
                            {/*<Button onClick={exportData} className={'top-custom-btn'} color='primary' outline>*/}
                            {/*    <Upload size={15}/>*/}
                            {/*    <span className='align-middle ml-50'> Export </span>*/}
                            {/*</Button>*/}
                            <ExportMenu
                                headers={CLASS_SETUP_EXPORT_TEMPLATE_CSV_HEADER}
                                filename={'class_setup'}
                                data={exports}
                                onClick={exportData}
                                btnText={'Export'}
                                outline
                                csvOnly
                            />
                        </>
                    }
                </CardHeader>

                <CardBody className="mt-2">
                    <Row>
                        <Col md={4}>
                            <ListSelect
                                title='Modules'
                                onAdd={undefined}
                                inputPlaceholder='Module Name / Code'
                                avatar={true}
                                data={modules}
                                options={courses}
                                selectedValue={selectedValues.moduleId}
                                selectedOption={selectedValues.course}
                                onSelect={data => onSelect('moduleId', data)}
                                onSelectOption={data => onSelect('course', data)}
                            />
                        </Col>
                        {
                            selectedValues.moduleId &&
                            <Col md={3}>
                                <ListSelect
                                    title='Classes'
                                    onAdd={() => onAdd('class')}
                                    inputPlaceholder='Class Name / Code'
                                    avatar={false}
                                    withCodeAndDates={true}
                                    onEdit={item => onEdit('class', item)}
                                    data={classes}
                                    selectedValue={selectedValues.class}
                                    onSelect={data => onSelect('class', data)}
                                />
                                {
                                    modelOpen.class && <SideModel
                                        toggleOpen={() => toggleModal('class')}
                                        open={modelOpen.class}
                                        title={selectedClass ? 'Edit Class' : 'Add New Class'}
                                        classSetup={true}
                                        batches={batches}
                                        selectedClass={selectedClass}
                                        onSave={data => onSave('class', data)}
                                    />
                                }
                            </Col>
                        }
                        {
                            selectedValues.class &&
                            <Col md={5}>
                                <ListSelect
                                    title='Students'
                                    onAdd={() => toggleModal('student')}
                                    inputPlaceholder={`Student Name / ${basicInfo.regText}`}
                                    studentTable={true}
                                    data={students}
                                    onSelect={data => onSelect('student', data)}
                                />
                                {
                                    modelOpen.student &&
                                    <AddClassStudentModel
                                        visible={modelOpen.student}
                                        toggleModal={() => toggleModal('student')}
                                        title='Add New Students'
                                        courses={courses}
                                        loadClassStudents={async () => await onSelect('class', selectedValues.class)}
                                        classId={selectedValues.class.id}
                                        moduleId={selectedValues.moduleId}
                                    />
                                }
                                {
                                    modelOpen.changeClass && <SideModel
                                        toggleOpen={() => toggleModal('changeClass')}
                                        open={modelOpen.changeClass}
                                        title='Change Class'
                                        subTitle={selectedValues.student.name}
                                        changeClass={true}
                                        list2={classesChange}
                                        selectedValue={selectedValues.class}
                                        onSave={data => onSave('changeClass', data)}
                                    />
                                }
                            </Col>
                        }
                    </Row>
                </CardBody>
            </Card>
        </div>
    )
}

export default App
