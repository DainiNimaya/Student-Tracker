import React, {useEffect, useState} from "react"
import {Card, CardBody, CardHeader, CardTitle, Col, Input, Row} from "reactstrap"
import {User, FileText, HelpCircle} from "react-feather"
import './_markings.scss'
import ListSelect from '@components/list-select'
import SideModel from '@components/list-select/list-select-side-model'
import * as ApiCounsellor from "@api/counselor_"
import * as Api from "@api/haa_"
import * as ApiLecturer from "@api/lecturer_"
import {selectThemeColors, createAssessmentSaveDataObject, getCookieUserData, findObject} from '@utils'
import Cookies from "js-cookie"
import config from '@storage'
import rs from '@routes'
import AddClassStudentModel from '@components/add-class-student/assessmentStudents'
import ViewAssessmentStudents from '@components/add-class-student/viewAssessmentStudents'
import {MARKING_VIEW_TYPES, LIST_SECTION} from '@const'
import {capitalize} from "@commonFunc"
import ConfirmBox from "../confirm-box"
import themeConfig from "../../../configs/themeConfig"

const Index = (props) => {
    const hos = JSON.parse(Cookies.get(config.user)).role === config.hosRole
    const loggedRole = getCookieUserData()

    const [schools, setSchools] = useState([])
    const [courses, setCourses] = useState([])
    const [modules, setModules] = useState([])
    const [lecturers, setLecturers] = useState([])
    const [moderators, setModerators] = useState([])
    const [selectedValues, setSelectedValues] = useState({
        school: undefined,
        moduleId: undefined,
        course: undefined,
        assessmentId: undefined,
        lecturerId: undefined
    })
    const [modelOpen, setModelOpen] = useState({
        assessment: false,
        studentList: false,
        student: false
    })
    const [assessmentDate, setAssessmentDate] = useState(undefined)
    const [assessmentDateNew, setAssessmentDateNew] = useState(undefined)
    const [assessmentList, setAssessmentList] = useState([])
    const [assessments, setAssessments] = useState([])
    const [assessmentType, setAssessmentType] = useState('')
    const [moduleName, setModuleName] = useState('')
    const [isFirstTime, setIsFirstTime] = useState(true)
    const [selectedData, setSelectedData] = useState(null)
    const [removeConfirmation, setRemoveConfirmation] = useState(false)

    useEffect(async () => {
        await getAllCourses()
        await getAllModules()
        await loadUsers()

        if (props.history.action !== 'POP') {
            sessionStorage.removeItem(rs.markings)
        } else {
            const sv = await JSON.parse(sessionStorage.getItem(rs.markings))
            if (sv) {
                await onSelect('course', sv.course, sv.school)
                await onSelect('moduleId', sv.moduleId, sv)
                await onSelect('assessmentId', sv, sv)
            }
        }
    }, [])

    const toggleModal = (name) => {
        setModelOpen({
            ...modelOpen,
            [name]: !modelOpen[name]
        })
    }

    const getAllCourses = async (schoolId) => {
        const res = await ApiCounsellor.getAllCourses(`courses${schoolId ? `?schoolId=${schoolId.value}` : ''}`)
        setCourses(res.map(item => {
            return {label: item.courseName, value: item.courseId}
        }))
    }

    const getAllModules = async (school, course, lecturerId) => {
        let res = await Api.getModulesBySemester(school, course, lecturerId)
        let count = 0
        res = res.map(item => {
            const d = {...item, name: item.moduleName, id: item.moduleId, code: item.moduleCode, count}
            count > 6 ? count = 0 : count += 1
            return d
        })
        setModules(res)
        setIsFirstTime(false)
    }

    const getAllAssessments = async (moduleId, itm, isRepeat) => {
        let res = null
        res = await ApiLecturer.getAllAssessmentsByModuleId(moduleId, isRepeat)
        res = res.map(item => {
            return {
                ...item,
                name: item.assessmentType.type ? capitalize(item.assessmentType.type.replaceAll('_', ' ').toLowerCase()) : '',
                id: item.assessmentId,
                value: item.assessmentType.percentage,
                nameSub: item.assessmentName ? item.assessmentName : 'N/A'
            }
        })
        setModuleName(itm.moduleName)
        setAssessmentList(res)
    }

    const onSelect = async (name, id, item) => {
        const isRepeat = window.location.pathname.startsWith(rs.repeatRecommendation)
        let res

        switch (name) {
            case 'lecturerId':
                setSelectedValues({
                    ...selectedValues,
                    // course: id,
                    moduleId: undefined,
                    assessmentId: undefined,
                    lecturerId: id
                })
                await getAllModules(null, null, id?.value)
                break
            case 'school':
                setSelectedValues({school: id, course: undefined, moduleId: undefined, assessmentId: undefined})
                await getAllCourses(id)
                await getAllModules(id)
                break
            case 'course':
                setSelectedValues({...selectedValues, course: id, moduleId: undefined, assessmentId: undefined})
                await getAllModules(selectedValues.school ? selectedValues.school : item, id)
                break
            case 'moduleId':
                // setSelectedValues(item ?? {...selectedValues, moduleId: id, assessmentId: undefined})
                setSelectedValues({...selectedValues, moduleId: id, assessmentId: undefined})
                await getAllAssessments(id, item, isRepeat)
                break
            case 'assessmentId':
                setSelectedValues(item ?? {...selectedValues, assessmentId: id.assessmentId})
                const moduleId = selectedValues.moduleId ? selectedValues.moduleId : JSON.parse(sessionStorage.getItem(rs.markings)).moduleId
                res = await ApiLecturer.getAssessmentDatesByAssessmentId(id.assessmentId, moduleId, isRepeat)
                res = res.map(item => {
                    return {
                        ...item,
                        name: item.code,
                        submissionDate: item.submissionDate,
                        returnDate: item.returnDate,
                        status: item.status,
                        issueDate: item.issueDate
                    }
                })
                setAssessmentType(id.assessmentType)
                setAssessments(res)
                break
            case 'viewAssessment':
                const state = {
                    gradingSchemeId: id.gradingSchemeId,
                    assessmentId: selectedValues.assessmentId,
                    assessmentDateId: id.assessmentDateId,
                    deadline: id.submissionDate,
                    assessmentType,
                    moduleName,
                    gradingTable: id.gradingTable,
                    type: (item === 'ENTER') ? MARKING_VIEW_TYPES.lecturerEnter : (item === 'HAA_ENTER') ? MARKING_VIEW_TYPES.haaEnter : MARKING_VIEW_TYPES.lecturerView,
                    repeatRecommendation: (props.location.pathname === rs.repeatRecommendation)
                }
                if (item === 'VIEW') state['passingPercentage'] = id.passedPercentage
                if (item === 'HAA_ENTER') state['returnDate'] = id.returnDate
                if (props.location.pathname === rs.repeatRecommendation) state['submissionDate'] = id.submissionDate

                sessionStorage.setItem(rs.markings, JSON.stringify({...selectedValues, moduleName, assessmentType}))

                props.history.push({
                    pathname: rs.assessmentsMarkingSheet,
                    state
                })
                break
            case 'viewStudents':
                setAssessmentDate({...id})
                toggleModal('studentList')
                break
            case 'onAdd':
                setModelOpen({
                    assessment: false,
                    studentList: false,
                    student: true
                })
                break
            case 'onEdit':
                await loadUsers()
                setAssessmentDate({...id})
                toggleModal('assessment')
                break
        }
    }

    const onAdd = async () => {
        await loadUsers()
        setAssessmentDate(undefined)
        toggleModal('assessment')
    }

    const loadUsers = async () => {
        const res = await Api.getLecturers()
        setLecturers(res)
        // res = await Api.getModerators()
        setModerators(res)
    }

    const onSave = async (data) => {
        // const res = await Api.saveAssessmentDate(selectedValues.assessmentId, createAssessmentSaveDataObject(data, selectedValues.moduleId))
        // if (res) {
        //     toggleModal('assessment')
        //     if (assessmentDate) {
        //         await onSelect('assessmentId', selectedValues)
        //     } else {
        //         setAssessmentDate({...assessmentDate, assessmentDateId: res})
        //         setModelOpen({
        //             assessment: false,
        //             studentList: false,
        //             student: true
        //         })
        //     }
        // }
    }

    const onPublish = (e) => {
    }

    const onRemove = (row) => {
        setSelectedData(row)
        setRemoveConfirmation(true)
    }

    const onRemoveHandler = async () => {
    }

    const user = JSON.parse(Cookies.get(config.user)).role
    const isAssessment = window.location.pathname.startsWith(rs.assessments)
    const isRepeat = window.location.pathname.startsWith(rs.repeatRecommendation)
    return <>
        <Card>
            <CardHeader className='border-bottom'>
                <CardTitle
                    tag='h4'>{isRepeat ? 'Repeat Recommendation' : isAssessment ? 'Assignment' : 'Marking'}</CardTitle>
            </CardHeader>
            <CardBody>
                <div>
                    <Row className="align-items-center">
                        {getCookieUserData().role === config.hosRole ? <Col md={3}>
                                <ListSelect
                                    title='Modules'
                                    inputPlaceholder='Search by Module Name / Code'
                                    // selectPlaceholder='Select Lecturer'
                                    avatar={true}
                                    data={modules}
                                    options={hos ? lecturers : undefined}
                                    selectedValue={selectedValues.moduleId}
                                    // selectedOption={selectedValues.lecturerId}
                                    onSelect={(data, item) => onSelect('moduleId', data, item)}
                                    // onSelectOption={data => onSelect('lecturerId', data)}
                                />
                            </Col>
                            :
                            <Col md={3}>
                                <ListSelect
                                    title='Modules'
                                    onAdd={undefined}
                                    inputPlaceholder='Search by Module Name / Code'
                                    avatar={true}
                                    data={modules}
                                    options={courses}
                                    selectedValue={selectedValues.moduleId}
                                    selectedOption={selectedValues.course}
                                    onSelect={(data, item) => onSelect('moduleId', data, item)}
                                    onSelectOption={data => onSelect('course', data)}
                                />
                            </Col>}

                        {selectedValues.moduleId &&
                            <Col md={3}>
                                <ListSelect
                                    title='Assignment List'
                                    onAdd={undefined}
                                    inputPlaceholder='Search by Assignment Type'
                                    iconWithValue={true}
                                    data={assessmentList}
                                    selectedValue={selectedValues.assessmentId}
                                    onSelect={data => onSelect('assessmentId', data)}
                                    icon={<FileText size={16}/>}
                                />
                            </Col>
                        }

                        {selectedValues.assessmentId && <Col md={6}>
                            <ListSelect
                                title='Assignment'
                                onAdd={isAssessment ? () => onAdd() : undefined}
                                assessmentTable={true}
                                data={assessments}
                                inputPlaceholder="Search by Assignment Code"
                                isAssessment={isAssessment}
                                onSelect={(data, type) => onSelect('viewAssessment', data, type)}
                                viewStudents={data => onSelect('viewStudents', data)}
                                onEdit={data => onSelect('onEdit', data)}
                                onPublish={onPublish}
                                isRemove={true}
                                onRemove={onRemove}
                            />
                        </Col>
                        }
                        {
                            modelOpen.assessment && <SideModel
                                toggleOpen={() => toggleModal('assessment')}
                                open={modelOpen.assessment}
                                title='Assignment Dates'
                                module={modules[modules.findIndex(e => e.id === selectedValues.moduleId)].name}
                                subTitle={assessmentList[assessmentList.findIndex(e => e.id === selectedValues.assessmentId)].name}
                                assessment={true}
                                lecturers={lecturers}
                                moderators={moderators}
                                selectedAssessmentDate={assessmentDate}
                                onSave={async (data) => {
                                    await onSave(data)
                                    await onSelect('assessmentId', selectedValues)
                                }}
                            />
                        }
                        {
                            modelOpen.student &&
                            <AddClassStudentModel
                                visible={modelOpen.student}
                                toggleModal={() => toggleModal('student')}
                                title='Assign Students'
                                courses={courses}
                                onSave={async () => {
                                    toggleModal('student')
                                    await onSelect('assessmentId', selectedValues)
                                }}
                                assessment={true}
                                moduleId={selectedValues.moduleId}
                                assessmentDateId={assessmentDate.assessmentDateId}
                                assessmentId={selectedValues.assessmentId}
                            />
                        }
                        {
                            modelOpen.studentList &&
                            <ViewAssessmentStudents
                                visible={modelOpen.studentList}
                                toggleModal={() => toggleModal('studentList')}
                                title='Assign Students'
                                courses={courses}
                                onAdd={async () => {
                                    toggleModal('studentList')
                                    await onSelect('onAdd', selectedValues)
                                }}
                                onSave={async () => {
                                    toggleModal('studentList')
                                    await onSelect('assessmentId', selectedValues)
                                }}
                                assessment={true}
                                assessmentDateId={assessmentDate.assessmentDateId}
                                assessmentId={selectedValues.assessmentId}
                            />
                        }
                    </Row>
                </div>
            </CardBody>
        </Card>

        {removeConfirmation && <ConfirmBox
            isOpen={true}
            toggleModal={() => {
                setSelectedData(null)
                setRemoveConfirmation(false)
            }}
            yesBtnClick={onRemoveHandler}
            noBtnClick={() => {
                setSelectedData(null)
                setRemoveConfirmation(false)
            }}
            title={'Confirmation'}
            message={'Are you sure to delete the assignment?'}
            yesBtn="Yes"
            noBtn='No'
            icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
        />}
    </>
}

export default Index
