import React, {useEffect, useState, useRef} from 'react'
import './scss/_modules.scss'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Button, Label, Input} from 'reactstrap'
import DataTable from "react-data-table-component"
import {MODULE_TABLE_COLUMN} from "./tableData"
import CustomPagination from "@components/customPagination"
import {Plus, Edit, Upload, X} from 'react-feather'
import Avatar from '@components/avatar/avatar'
import * as apiHaa from "@api/haa_"
import ModuleModal from '@components/module-modal'
import { CSVLink} from "react-csv"
import {MODULE_CSV_HEADER, MODULE_TYPE} from '@const'
import classnames from "classnames"
import Select from "react-select"
import {selectThemeColors} from '@utils'
import {capitalize} from '@commonFunc'
import ExportMenu from '@components/export-menu'


const ModulesDetail = (props) => {

    const csvLinkEl = useRef(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [offset, setOffset] = useState(0)
    const [numberOfElements, setNumberOfElements] = useState(0)
    const [moduleOpen, setModuleOpen] = useState(false)
    const [manageType, setManageType] = useState('')
    const [moduleList, setModuleList] = useState([])
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [moduleType, setModuleType] = useState(null)
    const [editModuleId, setEditModuleId] = useState('')
    const [exportList, setExportList] = useState([])
    const [courselist, setCourseList] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)


    useEffect(() => {
        loadModuleData(currentPage,name,moduleType,selectedCourse)
        loadCourseData()
    }, [])

    const loadModuleData = async (page,name,type,course) => {
        const modules =  await apiHaa.getAllModules(page,10,true,name.trim(),type !== null ? type.value : '',course !== null ? course.value : '')
        setModuleList(modules.content)
        setTotalPages(modules.totalPages)
        setTotalElements(modules.totalElements)
        setOffset(modules.pageable.offset)
        setNumberOfElements(modules.numberOfElements)
    }

    const loadCourseData = async () => {
        const result = await apiHaa.getAllCourses()
        if (result.length !== 0) {
            const temp = []
            result.map(item => {
                temp.push({value:item.courseId,label:item.courseName})
            })
            setCourseList(temp)
        }
    }

    const handlePagination = (val) => {
        setCurrentPage(val.selected)
        loadModuleData(val.selected,name,moduleType,selectedCourse)
    }

    const loadData = () => {
        const tableData = []
        if (moduleList.length !== 0) {
            let count = 0
            moduleList.map(module => {
                tableData.push(
                    {
                        code:module.moduleCode,
                        name: <Avatar count={count} name={module.moduleName} code={module.moduleCode}/>,
                        grading:module.gradingSchemeCode === null ? `N/A` : module.gradingSchemeCode,
                        assessment:module.assessmentSchemeCode === null ? `N/A` : module.assessmentSchemeCode,
                        type:capitalize(module.moduleType.replaceAll('_', ' ').toLowerCase()),
                        action: <Edit size={16} className='edit-icon cursor-pointer' onClick={() => handleModals({type:'edit',id:module.moduleId})}/>
                    }
                )
                count > 6 ? count = 0 : count += 1
            })
        }
        return tableData
    }

    const handleModals = (data) => {
        switch (data.type) {
            case 'add':
                setManageType('add')
                setModuleOpen(true)
                break
            case 'edit':
                setManageType('edit')
                setEditModuleId(data.id)
                setModuleOpen(true)
                break
            case 'close':
                setModuleOpen(false)
                setEditModuleId('')
                break

        }
    }

    const moduleSaved = () => {
        loadModuleData(0,'',null,null)
        setModuleOpen(false)
        setEditModuleId('')
        setCurrentPage(0)
    }

    const onChangeText = (e) => {
        if (e.key === 'Enter') {
            loadModuleData(0,name,moduleType,selectedCourse)
            setCurrentPage(0)
        }
    }

    const onDropDownHandler = (e,type) => {
        switch (type) {
            case 'moduleType':
                loadModuleData(0,name,e,selectedCourse)
                setModuleType(e)
                break
            case 'course':
                loadModuleData(0,name,moduleType,e)
                setSelectedCourse(e)
                break

        }

        setCurrentPage(0)
    }


    const handleFilter = (type) => {
        switch (type) {
            case 'search':
                loadModuleData(0,name,moduleType,selectedCourse)
                setCurrentPage(0)
                break
            case 'clear':
                loadModuleData(0,'',null,null)
                setCurrentPage(0)
                setName('')
                setModuleType(null)
                setSelectedCourse(null)
                break
        }
    }

    const exportAction = async (type, size, page, isGetPages) => {
        const res =  await apiHaa.getAllModules(page !== undefined ? page : currentPage,size ? size : 10,!isGetPages,name,moduleType !== null ? moduleType.value : '',selectedCourse !== null ? selectedCourse.value : '')
        if (res?.content && res?.content.length > 0) {
            await setExportList(res.content)
            // this.csvLinkEl.current.link.click()
        }
        return res
        // await setExportList(exportList)
        // //await csvLinkEl.current.link?.click()
        // return await exportList
    }


    return (
        <Card className={'haa-modules'} style={{height:'100%'}}>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                <CardTitle tag='h4'>Modules</CardTitle>
                <div className='d-flex mt-md-0 mt-1'>
                    <ExportMenu
                        headers={MODULE_CSV_HEADER}
                        filename={'module'}
                        data={exportList}
                        onClick={exportAction}
                        btnText={'Export'}
                        outline
                        size = {'sm'}
                    />

                    {/*<Button className={'top-custom-btn'} color='primary' outline size={'sm'} onClick={() => exportAction()}>*/}
                    {/*    <Upload size={15}/>*/}
                    {/*    <span className='align-middle ml-50'> Export </span>*/}
                    {/*</Button>*/}
                    {/*<CSVLink data={exportList} filename={"module.csv"} headers={MODULE_CSV_HEADER} ref={csvLinkEl}>*/}
                    {/*</CSVLink>*/}
                    <Button className='ms-2' color='primary' size={'sm'} onClick={() => handleModals({type:'add'})}>
                        <Plus size={15} />
                        <span className='align-middle ms-50'>Add Modules</span>
                    </Button>
                </div>
            </CardHeader>
            <Row className='justify-content-start mx-0'>
                <Col className='mt-1' md='3' sm='12'>
                    <Label >Module Name/ Code</Label>
                    <Input type='text' placeholder={'Search by Name or Code'} name={'name'} value={name}
                           onChange={(e) => setName(e.target.value)} onKeyDown={onChangeText}/>
                </Col>
                <Col className='mt-1' md='3' sm='12'>
                    <Label >Module Type</Label>
                    <Select
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        classNamePrefix='select'
                        // defaultValue={programOptions[0]}
                        value={moduleType}
                        options={MODULE_TYPE}
                        isClearable={false}
                        onChange={(e) => onDropDownHandler(e,'moduleType')}
                        placeholder={'Select module type'}
                    />
                </Col>
                <Col className='mt-1' md='3' sm='12'>
                    <Label >Course</Label>
                    <Select
                        theme={selectThemeColors}
                        className={classnames('react-select')}
                        classNamePrefix='select'
                        // defaultValue={programOptions[0]}
                        value={selectedCourse}
                        options={courselist}
                        isClearable={false}
                        onChange={(e) => onDropDownHandler(e,'course')}
                        placeholder={'Select course'}
                    />
                </Col>
                <Col md='3' sm='12'>
                    <Button className='module-custom-btn-clear me-1' size='sm' onClick={() => handleFilter('clear')}>
                        <span className='align-middle ml-50'> Clear</span>
                    </Button>

                    <Button className='module-custom-btn mt-2' color='primary' size='sm' onClick={() => handleFilter('search')}>
                        <span className='align-middle ml-50'> Filter</span>
                    </Button>
                </Col>
            </Row>
            <div className='react-dataTable'>
                <DataTable
                    noHeader
                    pagination
                    columns={MODULE_TABLE_COLUMN}
                    paginationPerPage={10}
                    className='react-dataTable'
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={() => CustomPagination({
                        currentPage,
                        numberOfElements,
                        totalElements,
                        totalPages,
                        offset,
                        handlePagination: page => handlePagination(page)
                    })}
                    data={loadData()}
                />
            </div>
            {
                moduleOpen && <ModuleModal visible={moduleOpen} modalFunction={handleModals} manageType={manageType}
                                           onSave={moduleSaved} moduleId={editModuleId}/>
            }
        </Card>
    )

}

export default ModulesDetail
