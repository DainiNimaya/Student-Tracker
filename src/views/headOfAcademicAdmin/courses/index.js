import React, {useEffect, useRef, useState} from 'react'
import './scss/_style.scss'
import classnames from 'classnames'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Button, Label, Input} from 'reactstrap'
import DataTable from "react-data-table-component"
import {COURSE_TABLE_COLUMN} from "./tableData"
import CustomPagination from "@components/customPagination"
import {Plus, Edit, Upload, X} from 'react-feather'
import Avatar from '@components/avatar'
import CourseModal from '@components/course-modal'
import * as apiHaa from "@api/haa_"
import {CSVLink} from "react-csv"
import {COURSE_CSV_HEADER} from '@const'
import moment from 'moment'
import {getFirstTwoLetter} from '@utils'
import ExportMenu from '@components/export-menu'


const CourseDetail = (props) => {

    const csvLinkEl = useRef(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [offset, setOffset] = useState(0)
    const [numberOfElements, setNumberOfElements] = useState(0)
    const [courseOpen, setCourseOpen] = useState(false)
    const [manageType, setManageType] = useState('')
    const [courseList, setCourseList] = useState([])
    const [editCourseId, setEditCourseId] = useState(undefined)
    const [name, setName] = useState('')
    const [exportList, setExportList] = useState([])

    useEffect(() => {
        loadCourseData()
    }, [])

    const loadCourseData = async () => {
        const courses =  await apiHaa.getAllCourseExport(name,currentPage, 10, true)

        if (courses !== undefined && courses.length !== 0) {
            setCourseList(courses.content)
            setTotalElements(courses.totalElements)
            setTotalPages(courses.totalPages)
            setNumberOfElements(courses.numberOfElements)
            setOffset(courses.pageable.offset)
        }
    }

    const handlePagination = async (val) => {
        const courses =  await apiHaa.getAllCourseExport(name, val.selected, 10, true)
        setCourseList(courses.content)
        setTotalElements(courses.totalElements)
        setTotalPages(courses.totalPages)
        setNumberOfElements(courses.numberOfElements)
        setOffset(courses.pageable.offset)
        setCurrentPage(val.selected)
    }

    const loadData = () => {
        const tableData = []
        if (courseList.length !== 0) {
            courseList.map(course => {

                let tempCoursename = ''

                if (course.courseName && course.courseName.length > 30) {
                    tempCoursename = `${course.courseName.substring(0,30)}..`
                } else {
                    tempCoursename = course.courseName
                }

                tableData.push(
                    {
                        code:course.courseCode,
                        name:<div className='d-flex align-items-center'>
                            <Avatar color={`light-primary`} content={getFirstTwoLetter(course.courseName ? course.courseName : 'N')} initials/>
                            <div className='user-info text-truncate ms-1' id={'name-div'}>
                                <span className='d-block fw-bold text-truncate'>{tempCoursename}</span>
                            </div>
                        </div>,
                        programme:"IT Programme",
                        date:course.addedDate !== null ? moment(course.addedDate).format('YYYY-MM-DD') : `N/A`,
                        action: <Edit size={16} className={'edit-icon'} onClick={() => handleModals({type:'edit',id:course.courseId})}/>
                    }
                )
            })
        }
        return tableData
    }

    const handleModals = (data) => {
        switch (data.type) {
            case 'add':
                setManageType('add')
                setCourseOpen(true)
                break
            case 'edit':
                setManageType('edit')
                setEditCourseId(data.id)
                setCourseOpen(true)
                break
            case 'close':
                setEditCourseId(undefined)
                setCourseOpen(false)
                break

        }
    }

    const courseSaved = () => {
        setEditCourseId(undefined)
        setCourseOpen(false)
        loadCourseData()
    }

    const loadCourses = async (name_,page) => {
        const courses =  await apiHaa.getAllCourseExport(name_, page, 10, true)
        setCourseList(courses.content)
        setTotalElements(courses.totalElements)
        setTotalPages(courses.totalPages)
        setNumberOfElements(courses.numberOfElements)
        setOffset(courses.pageable.offset)
        setCurrentPage(0)
    }

    const onChangeText = async (e) => {
        if (e.key === 'Enter') {
            if (e.target.value !== '') {
                loadCourses(name,0)
            } else {
                loadCourseData()
            }

        }
    }

    const handleFilter = (type) => {
        switch (type) {
            case 'search':
                loadCourses(name,0)
                break
            case 'clear':
                loadCourses('',0)
                setName('')
                break
        }
    }

    const exportAction = async (type, size, page, isGetPages) => {
        const tempExport = []
        const res =  await apiHaa.getAllCourseExport(name, page !== undefined ? page : currentPage, size ? size : 10, !isGetPages)
        if (res.content && res.content.length !== 0) {
            res.content.map(item => {

                tempExport.push({
                    name:item.courseName,
                    code:item.courseCode,
                    description:item.courseDescription,
                    qualification:item.qualificationAchieve,
                    specialization:item.specialization,
                    type:item.courseType,
                    school:item.schoolOrDepartment !== null ? item.schoolOrDepartment.schoolName : '',
                    program:item.programCode,
                    credits:item.totalCredits
                })
            })

            res.content = tempExport
        }
        await setExportList(res.content)
        return res
        //await csvLinkEl.current.link?.click()
    }


    return (
        <Card className={'haa-courses'} style={{height:'100%'}}>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                <CardTitle tag='h4'>Courses</CardTitle>
                <div className='d-flex mt-md-0 mt-1'>

                    <ExportMenu
                        headers={COURSE_CSV_HEADER}
                        filename={'course'}
                        data={exportList}
                        onClick={exportAction}
                        btnText={'Export'}
                        outline
                        size={'sm'}
                    />
                    {/*<Button className={'top-custom-btn'} color='primary' outline size={'sm'} onClick={() => exportAction()}>*/}
                    {/*    <Upload size={15}/>*/}
                    {/*    <span className='align-middle ml-50'> Export </span>*/}
                    {/*</Button>*/}
                    {/*<CSVLink data={exportList} filename={"course.csv"} headers={COURSE_CSV_HEADER} ref={csvLinkEl}>*/}
                    {/*</CSVLink>*/}
                    <Button className='ms-2' color='primary' size={'sm'} onClick={() => handleModals({type:'add'})}>
                        <Plus size={15} />
                        <span className='align-middle ms-50'>Add Course</span>
                    </Button>
                </div>
            </CardHeader>
            <Row className='justify-content-start mx-0'>
                <Col className='mt-1' md='3' sm='12' style={{paddingLeft:'1.5rem'}}>
                    <Label>Course Name/ Code</Label>
                    <Input
                        className='mb-0'
                        type='text'
                        id='search-input'
                        placeholder={'Search by Name or Code'}
                        name={'name'} value={name}
                        onChange={(e) => setName(e.target.value)} onKeyDown={onChangeText}
                    />
                </Col>
                <Col xs={9} className='pl-0'>
                    <Button className='course-custom-btn-clear me-1' size='sm' onClick={() => handleFilter('clear')}>
                        <span className='align-middle ml-50'> Clear</span>
                    </Button>

                    <Button className='course-custom-btn mt-2' color='primary' size='sm' onClick={() => handleFilter('search')}>
                        <span className='align-middle ml-50'> Filter</span>
                    </Button>
                </Col>
            </Row>
            <div className='react-dataTable'>
                <DataTable
                    noHeader
                    pagination
                    columns={COURSE_TABLE_COLUMN}
                    paginationPerPage={40}
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
                courseOpen && <CourseModal visible={courseOpen} modalFunction={handleModals} manageType={manageType}
                                           courseId={editCourseId} callback={courseSaved}/>
            }
        </Card>
    )

}

export default CourseDetail
