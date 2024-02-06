import React, {useEffect, useState} from "react"
import {Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap"
import ListSelect from '@components/list-select'
import * as ApiCounsellor from "@api/counsellor"
import * as Api from "@api/haa"
import CourseModal from '@components/course-modal'
import SideModel from '@components/list-select/list-select-side-model'
import {HelpCircle} from "react-feather"
import ConfirmBox from "@components/confirm-box"
import ModuleModal from "@components/module-modal"
import {titleCase, getCookieUserData} from '@utils'
import config from '@storage'
import {getLoggedUserData} from '@commonFunc'
import themeConfig from '@configs/themeConfig'

const CourseSetup = (props) => {

    const [schools, setSchools] = useState([])
    const [courses, setCourses] = useState([])
    const [levels, setLevels] = useState([])
    const [modules, setModules] = useState([])
    const [selectedValues, setSelectedValues] = useState({
        schoolId: undefined,
        courseId: undefined,
        levelId: undefined,
        moduleId: undefined
    })
    const [courseOpen, setCourseOpen] = useState(false)
    const [manageType, setManageType] = useState('add')
    const [modelOpen, setModelOpen] = useState({
        course: false,
        level: false,
        module: false
    })
    const [modelLists, setModelLists] = useState({
        course: [],
        level: [],
        module: []
    })
    const [cb2, setCb2] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [moduleOpen, setModuleOpen] = useState(false)
    const [moduleModalOpen, setModuleModalOpen] = useState(false)
    const [manageModuleType, setManageModuleType] = useState('')
    const [isRemoveConfirm, setIsRemoveConfirm] = useState(false)
    const [removeData, setRemoveData] = useState(null)

    useEffect(async () => {
        await getAllCourses()
    }, [])

    const getAllCourses = async (schoolId) => {
        const userId = getLoggedUserData().userId
        const url = `courses?userId=${userId}`
        let res = await ApiCounsellor.getAllCourses(url)
        res = res.map(item => {
            return {...item, name: item.courseName, id: item.courseId, code: item.courseCode}
        })
        setCourses(res)
    }

    const onSelect = async (name, id) => {
        let res
        switch (name) {
            case 'courseId':
                await setSelectedValues({schoolId: selectedValues.schoolId, courseId: id})
                res = await Api.getAllLevelsByCourse(id)
                res = res.map(item => {
                    return {...item, name: item.levelName, id: item.levelId}
                })
                await setLevels(res)
                break
        }
    }

    const onRemove = async (name, id) => {
        let res
        switch (name) {
            case 'moduleId':
                res = await Api.deleteModulesByLevel(selectedValues.courseId, selectedValues.levelId.id, id)
                if (res) {
                    const data = []
                    modules.map(item => item.moduleId !== id && data.push(item))
                    await setModules([...data])
                }
                break
        }
        setCb2(false)
    }

    const handleModals = (type) => {
        switch (type) {
            case 'add':
                setManageType('add')
                setModuleOpen(true)
                break
            case 'edit':
                setManageType('edit')
                setModuleOpen(true)
                break
            case 'close':
                setCourseOpen(false)
                break

        }
    }

    const toggleModal = (name) => {
        setModelOpen({
            ...modelOpen,
            [name]: !modelOpen[name]
        })
    }

    const onSave = async (type, list) => {
        const data = {
            type,
            data: list.map(item => {
                return {
                    id: item.moduleId
                }
            }),
            levelId: selectedValues.levelId.levelId,
            courseId: selectedValues.courseId
        }

        switch (type) {
            case 'MODULE':
                await Api.saveCourseSetupLevel(data)
                await onSelect('levelId', selectedValues.levelId)
                await toggleModal('module')
                break

        }
    }

    const onDeleteLevelConfirm = (data) => {
        setSelectedLevel(data)
        setCb2(true)
    }

    const onAdd = async (name) => {
        let res = []
        switch (name) {
            case 'course':
                break
            case 'module':
                let count = 0
                res = await Api.getUnassignedCourseSetupModules(2878, 46)
                res = res.map(item => {
                    const a = {
                        ...item,
                        name: `${item.moduleName} (${item.moduleCode})`,
                        id: item.moduleId,
                        code: item.moduleCode,
                        gpaCalculate: item.gpaCalculate,
                        count
                    }
                    count > 5 ? count = 0 : count += 1
                    return a
                })

                break
        }
        const data = {...modelLists}
        data[name] = res
        setModelLists(data)
        toggleModal(name)
    }

    const handleModuleModals = (type) => {
        switch (type) {
            case 'add':
                // setManageType('add')
                // setModuleOpen(true)
                break
            case 'edit':
                // setManageType('edit')
                // setModuleOpen(true)
                break
            case 'close':
                setModuleModalOpen(false)
                break

        }
    }

    const onModuleSave = async () => {
        setModuleModalOpen(false)
        await onAdd('module')
    }

    const aaRole = getCookieUserData().role === config.aaRole
    return (<>
            <div>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Course Setup</CardTitle>
                    </CardHeader>

                    <CardBody className="mt-2">
                        <Row>
                            <Col md={4}>
                                <ListSelect
                                    title='Course'
                                    inputPlaceholder='Course Name / Code'
                                    avatar={true}
                                    data={courses}
                                    options={schools}
                                    selectedValue={selectedValues.courseId}
                                    onSelect={data => onSelect('courseId', data)}
                                />
                            </Col>

                            {
                                selectedValues.courseId &&
                                <Col md={4}>
                                    <ListSelect
                                        title='Module'
                                        onAdd={aaRole ? undefined : () => onAdd('module')}
                                        inputPlaceholder='Module Name / Code'
                                        avatarWithRemove={true}
                                        data={modules}
                                        selectedValue={selectedValues.moduleId}
                                        onSelect={data => onSelect('moduleId', data)}
                                        onRemove={data => {
                                            setIsRemoveConfirm(true)
                                            setRemoveData(data)
                                        }}
                                    />

                                    {
                                        modelOpen.module && <SideModel
                                            toggleOpen={() => toggleModal('module')}
                                            open={modelOpen.module}
                                            courseSetup={true}
                                            title='Add Module'
                                            subTitle='Modules'
                                            onAdd={() => setModuleModalOpen(true)}
                                            inputPlaceholder='Module Name / Code'
                                            list={modelLists.module}
                                            onSave={data => onSave('MODULE', data)}
                                        />
                                    }
                                </Col>
                            }
                        </Row>
                    </CardBody>
                </Card>
            </div>

            {moduleModalOpen && <ModuleModal
                visible={moduleModalOpen}
                modalFunction={() => setModuleModalOpen(false)}
                manageType={manageModuleType}
                onSave={onModuleSave}
                moduleId={''}
            />}

            <ConfirmBox
                isOpen={isRemoveConfirm}
                toggleModal={() => setIsRemoveConfirm(false)}
                yesBtnClick={() => {
                    setIsRemoveConfirm(false)
                    onRemove('moduleId', removeData)
                }}
                noBtnClick={() => setIsRemoveConfirm(false)}
                title={'Confirmation'}
                message={'Are you sure do you want to remove?'}
                yesBtn="Yes"
                noBtn="No"
                icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
            />
        </>
    )
}

export default CourseSetup
