import React, {useEffect, useState} from "react"
import {Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap"
import ListSelect from '@components/list-select'
import SideModel from '@components/list-select/list-select-side-model'
import * as ApiCounsellor from "@api/counselor_"
import * as Api from "@api/haa"
import CourseModal from '@components/course-modal'
import BatchModal from '@components/batch-modal'
import ModuleModal from '@components/module-modal'
import SemesterAssign from '@components/list-select/semesterAssign'
import * as ApiIt from "@api/itAdmin"
import {findObject, getCookieUserData} from '@utils'
import config from '@storage'
import {HelpCircle} from "react-feather"
import ConfirmBox from "@components/confirm-box"
import {getLoggedUserData} from '@commonFunc'
import {batchPlan} from '@configs/authConfig'
import LevelWiseOrientation from "@components/level-wise-orientation"
import themeConfig from '@configs/themeConfig'

const App = (props) => {

    const [cb, setCb] = useState(false)
    const [schools, setSchools] = useState([])
    const [courses, setCourses] = useState([])
    const [batches, setBatches] = useState([])
    const [levels, setLevels] = useState([])
    const [semesters, setSemesters] = useState([])
    const [levelData, setLevelData] = useState(null)
    const [modules, setModules] = useState([])
    const [deleteData, setDeleteData] = useState({
        name: undefined,
        id: undefined
    })
    const [selectedValues, setSelectedValues] = useState({
        schoolId: undefined,
        courseId: undefined,
        batchId: undefined,
        levelId: undefined,
        semesterId: undefined,
        moduleId: undefined
    })
    const [modelOpen, setModelOpen] = useState({
        course: false,
        batch: false,
        level: false,
        semester: false,
        module: false
    })
    const [modelLists, setModelLists] = useState({
        course: [],
        batch: [],
        level: [],
        semester: [],
        module: []
    })
    const [modelCreate, setModelCreate] = useState({
        batch: false,
        module: false,
        levelWise: false
    })
    const [minCreditLimit, setMinCreditLimit] = useState(0)
    const [maxCreditLimit, setMaxCreditLimit] = useState(0)
    const [totalGpa, setTotalGpa] = useState(0)
    const [totalElectiveGpa, setTotalElectiveGpa] = useState(0)
    const [totalNonGpa, setTotalNonGpa] = useState(0)
    const [totalElectiveNonGpa, setElectiveTotalNonGpa] = useState(0)
    const [selectedBatchLevel, setSelectedBatchLevel] = useState(null)

    useEffect(async () => {
        await getAllSchools()
        await getAllCourses()
    }, [])


    const getAllSchools = async () => {
        const res = await ApiIt.getAllSchools()
        setSchools(res.map(item => {
            return {...item, name: item.label, id: item.value}
        }))
    }

    const getAllCourses = async (schoolId) => {
        const userId = getLoggedUserData().userId
        const url = `courses?userId=${userId}`
        let res = await ApiCounsellor.getAllCourses(schoolId ? `${url}&schoolId=${schoolId.value}` : url)
        let count = 0
        res = res.map(item => {
            const d = {...item, name: item.courseName, id: item.courseId, code: item.courseCode, count}
            count > 6 ? count = 0 : count += 1
            return d
        })
        setCourses(res)
    }

    const onSelect = async (name, id) => {
        let res
        switch (name) {
            case 'courseId':
                setSelectedValues({
                    ...selectedValues,
                    courseId: id,
                    batchId: undefined,
                    levelId: undefined,
                    semesterId: undefined
                })
                res = await Api.getSelectedCourseBatches(id)
                res = res.map(item => {
                    return {...item, name: item.batchCode, id: item.batchId, value: item.batchId}
                })
                setBatches(res)
                break
        }
    }

    const onRemove = async (name, id, isLoading, isToast) => {
        let res
        switch (name) {
            case 'batchId':
                res = await Api.deleteSelectedCourseBatch(selectedValues.courseId, id, isLoading, isToast)
                if (res) {
                    const data = []
                    batches.map(item => item.batchId !== id && data.push(item))
                    setBatches([...data])
                    setLevels([])
                    setSemesters([])
                    setModules([])
                    setSelectedValues({
                        ...selectedValues,
                        batchId: undefined,
                        levelId: undefined,
                        semesterId: undefined,
                        moduleId: undefined
                    })
                }
                break
            case 'moduleId':
                res = await Api.deleteSelectedCourseBatchLevelSemesterModule(selectedValues.courseId, selectedValues.batchId,
                    selectedValues.levelId, selectedValues.semesterId, id)
                if (res) {
                    const data = []
                    modules.map(item => item.moduleId !== id && data.push(item))
                    setModules([...data])
                    setSelectedValues({...selectedValues, moduleId: undefined})
                }

                await onSelect('levelId', {id: selectedValues.levelId})
                await onSelect('semesterId', selectedValues.semesterId)
                break
        }
        setCb(false)
    }

    const toggleModal = (name) => {
        setModelOpen({
            ...modelOpen,
            [name]: !modelOpen[name]
        })
    }

    const onAdd = async (name) => {
        let res = []
        switch (name) {
            case 'course':
                break
            case 'batch':
                res = await Api.getUnassignedBatches(courses[courses.findIndex(item => item.courseId === selectedValues.courseId)].courseId)
                res = res.map(item => {
                    return {...item, name: item.batchCode, id: item.batchId}
                })
                break
            case 'module':
                let count = 0
                res = await Api.getUnassignedModules(77, 161, 46, 203)
                res = res.map(item => {
                    const a = {...item, name: item.moduleName, id: item.moduleId, code: item.moduleCode, count}
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

    const onSave = async (type, list) => {
        const data = {
            type,
            data: list,
            ...selectedValues
        }
        const res = await Api.saveBatchPlanItem(data)
        if (res) {
            toggleModal(type.toLowerCase())
            switch (type.toLowerCase()) {
                case 'batch':
                    await onSelect('courseId', selectedValues.courseId)
                    break
                case 'level':
                    await onSelect('batchId', selectedValues.batchId)
                    break
                case 'semester':
                    await onSelect('levelId', {id: selectedValues.levelId})
                    break
                case 'module':
                    await onSelect('semesterId', selectedValues.semesterId)
                    break
            }
        }
    }

    const toggleCreateModals = async (name, onSave) => {
        switch (name) {
            case 'batch':
                if (onSave) await onAdd(name)
                toggleModal(name)
                setModelCreate({
                    ...modelCreate,
                    [name]: !modelCreate[name]
                })
                break
            case 'module':
                if (onSave) await onAdd(name)
                toggleModal(name)
                setModelCreate({
                    ...modelCreate,
                    [name]: !modelCreate[name]
                })
                break

            case 'levelWise':
                //toggleModal('batch')
                setModelCreate({
                    ...modelCreate,
                    [name]: !modelCreate[name]
                })
                break
        }
    }

    const [selectedBatch, setSelectedBatch] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)

    const onLevelWiseBatchSelect = (item) => {
        setSelectedBatch(item)
        const batchId = item.batchId
        const courseId = selectedValues.courseId

        setSelectedValues({
            ...selectedValues,
            batchId
        })

        toggleModal('batch')
        setModelCreate({
            ...modelCreate,
            levelWise: !modelCreate.levelWise
        })
    }

    const aaRole = getCookieUserData().role === config.aaRole

    return (
        <div>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Batch Plan</CardTitle>
                </CardHeader>

                <CardBody className="mt-2">
                    <Row>
                        <Col md={4}>
                            <ListSelect
                                title='Course'
                                onAdd={aaRole ? undefined : () => toggleModal('course')}
                                inputPlaceholder='Course Name / Code'
                                avatar={true}
                                data={courses}
                                selectedValue={selectedValues.courseId}
                                onSelect={(data, item) => {
                                    onSelect('courseId', data)
                                    if (batchPlan.levelWiseOrientation) {
                                        setSelectedCourse(item)
                                    }
                                }}
                            />
                        </Col>

                        {
                            selectedValues.courseId &&
                            <Col md={4}>
                                <ListSelect
                                    title='Batch'
                                    onAdd={aaRole ? undefined : () => onAdd('batch')}
                                    inputPlaceholder='Batch Code'
                                    withRemoveAndEdit={!aaRole}
                                    textOnly={aaRole}
                                    data={batches}
                                    selectedValue={selectedValues.batchId}
                                    onSelect={data => onSelect('semesterId', data.batchId ? data.batchId : data)}
                                    onRemove={data => {
                                        setDeleteData({
                                            name: 'batchId',
                                            id: data
                                        })
                                        setCb(true)
                                    }}
                                    onEdit={(item) => {
                                        setSelectedBatchLevel(item)
                                        setModelCreate({
                                            ...modelCreate,
                                            levelWise: true
                                        })
                                    }}
                                />

                                {
                                    modelOpen.batch && <SideModel
                                        toggleOpen={() => toggleModal('batch')}
                                        open={modelOpen.batch}
                                        title='Add Batch'
                                        subTitle='Batches'
                                        onAdd={() => toggleCreateModals('batch')}
                                        inputPlaceholder='Batch Code'
                                        list={modelLists.batch}
                                        onSave={data => onSave('BATCH', data)}
                                        isLevelWiseOrientation={batchPlan.levelWiseOrientation}
                                        onListSelect={onLevelWiseBatchSelect}
                                    />
                                }

                                {
                                    modelCreate.batch && <BatchModal
                                        visible={modelCreate.batch}
                                        toggleModal={() => toggleCreateModals('batch')}
                                        title='Create Batch'
                                        onSave={() => toggleCreateModals('batch', true)}
                                    />
                                }

                                {
                                    modelCreate.levelWise &&
                                    <LevelWiseOrientation isOpen={modelCreate.levelWise}
                                                          toggleModal={async (isRefresh, isCanceled) => {
                                                              if (isRefresh) {
                                                                  if (isCanceled) {
                                                                      await onRemove('batchId', selectedBatch.batchId, false, false)
                                                                  }
                                                                  await onAdd('batch')
                                                                  await onSelect('courseId', selectedValues.courseId)
                                                              }
                                                              await toggleCreateModals('levelWise')
                                                              await setSelectedBatchLevel(null)
                                                          }}
                                                          selectedValues={selectedValues}
                                                          selectedBatch={selectedBatch}
                                                          selectedCourse={selectedCourse}
                                                          selectedBatchLevel={selectedBatchLevel}
                                    />
                                }

                            </Col>
                        }

                        {
                            selectedValues.semesterId &&
                            <Col md={4}>
                                <ListSelect
                                    title='Module'
                                    onAdd={aaRole ? undefined : () => onAdd('module')}
                                    inputPlaceholder='Module Name / Code'
                                    avatarWithRemove={!aaRole}
                                    avatar={aaRole}
                                    typeAndCredit={true}
                                    data={modules}
                                    selectedValue={selectedValues.moduleId}
                                    onSelect={data => onSelect('moduleId', data)}
                                    onRemove={data => {
                                        setDeleteData({
                                            name: 'moduleId',
                                            id: data
                                        })
                                        setCb(true)
                                    }}
                                />

                                {
                                    modelOpen.module && <SideModel
                                        toggleOpen={() => toggleModal('module')}
                                        open={modelOpen.module}
                                        title='Add Module'
                                        subTitle='Modules'
                                        onAdd={undefined}
                                        courseSetup={true}
                                        showGpaCalculation={true}
                                        gpaCalculationData={{maxCreditLimit, minCreditLimit}}
                                        totalCredits={{totalGpa, totalNonGpa, totalElectiveGpa, totalElectiveNonGpa}}
                                        inputPlaceholder='Module Name / Code'
                                        list={modelLists.module}
                                        onSave={data => onSave('MODULE', data)}
                                        refreshLevels={async () => {
                                            await onSelect('levelId', {id: selectedValues.levelId})
                                            await onSelect('semesterId', selectedValues.semesterId)
                                        }}
                                    />
                                }

                                {
                                    modelCreate.module && <ModuleModal
                                        visible={modelCreate.module}
                                        modalFunction={() => toggleCreateModals('module')}
                                        manageType='add'
                                        onSave={() => toggleCreateModals('module', true)}
                                    />
                                }
                            </Col>
                        }
                    </Row>
                </CardBody>
            </Card>

            <ConfirmBox
                isOpen={cb}
                toggleModal={() => setCb(!cb)}
                yesBtnClick={() => {
                    onRemove(deleteData.name, deleteData.id)
                }}
                noBtnClick={() => {
                    setCb(!cb)
                }}
                title={"Are you sure to delete?"}
                message={"You may not able to recover this action once you delete this"}
                yesBtn="Yes"
                noBtn="No"
                icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
            />
        </div>
    )
}

export default App
