import React from 'react'
import {Row, Col, Card, CardBody, CardTitle, CardHeader, Button, Label, Badge} from 'reactstrap'
import DataTable from "react-data-table-component"
import './scss/viewStyle.scss'
import {STUDENT_MARKINGS_TABLE_COLUMN} from "./tableData"
import CustomPagination from "@components/customPagination"
import {Eye, X} from 'react-feather'
import Avatar from '@components/avatar/avatar'
import * as apiHaa from "@api/haa"
import {
    STUDENTS_MARKINGS_CSV_HEADER,
    FILTER_TYPES,
    EXAM_STATUS,
    EXAM_STATUS_DROPDOWN,
    GRADES,
    COLOR_STATUS,
    FILTERS,
    STUDENT_PROFILE_VIEW_TYPES
} from '@const'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import Filter from "@components/filter"
import rs from '@routes'
import {capitalize} from '@commonFunc'
import ExportMenu from '@components/export-menu'
import {basicInfo} from '@configs/basicInfomationConfig'

class ViewMarkings extends React.Component {

    csvLinkEl = React.createRef()
    state = {
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        offset: 0,
        numberOfElements: 0,
        studentList: [],
        data: null,
        showFilter: false,
        exportList: []
    }

    async componentDidMount() {
        if (this.props.location.state !== undefined) {
            if (this.props.filter.route === undefined) {
                await this.props.dispatch(handleFilter({...FILTERS, route: rs.studentsMarking}))
            } else if (this.props.filter.route !== rs.studentsMarking) {
                await this.props.dispatch(handleFilter({...FILTERS, route: rs.studentsMarking}))
            }
            await this.setState({
                data: this.props.location.state,
                showFilter: true
            })
            await this.getTableData(0)
        }

    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.studentsMarking}))
        await this.setState({currentPage: 0})
        this.getTableData(0)
    }

    getTableData = async (page) => {
        const batch = this.state.data.batchId
        const module = this.state.data.moduleId
        const studentList = await apiHaa.getMarkingStudentList(this.props.filter, batch, module, page, 10, true)
        if (studentList !== null) {
            this.setState({
                studentList: studentList.content,
                currentPage: page,
                totalPages: studentList.totalPages,
                totalElements: studentList.totalElements,
                offset: studentList.pageable.offset,
                numberOfElements: studentList.numberOfElements
            })
        }
    }

    handlePagination = async (val) => {
        this.getTableData(val.selected)
    }

    exportAction = async (type, size, page, isGetPages) => {
        const batch = this.state.data.batchId
        const module = this.state.data.moduleId
        const res = await apiHaa.getMarkingStudentList(this.props.filter, batch, module, page !== undefined ? page : this.state.currentPage, size ? size : 10, !isGetPages)
        if (res?.content && res?.content.length > 0) {
            await this.setState({exportList: res.content})
            // this.csvLinkEl.current.link.click()
        }
        return res
    }

    navigateToSMP = (data) => {
        const details = {
            studentId: data.studentId,
            cb: data.cbNo,
            isMarking: true,
            viewType: STUDENT_PROFILE_VIEW_TYPES.stepperView
        }
        const requiredData = {
            studentId: data.studentId,
            cbNumber: data.cbNo,
            courseName: this.state.data.courseName,
            studentName: data.studentName,
            mobile: '',
            email: '',
            inquiryId: 0
        }
        sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(requiredData))
        this.props.history.push({pathname: rs.studentProfileView, state: details})
    }

    render() {
        const defaultAll = [{label: 'All', value: null}]
        const {
            data, studentList, exportList, currentPage,
            totalElements, totalPages, numberOfElements, offset
        } = this.state
        let tableColumn = [...STUDENT_MARKINGS_TABLE_COLUMN]

        studentList.length > 0 && studentList[0].assessments.map(ass => {
            tableColumn.push({
                name: `${ass.assessmentName} (%)`,
                selector: row => <div id={'col-dynamic'}>
                    <p>{ass.type ? ass.type.substr(0, 1) : '-'}</p>
                    <p id={'mark'}>{ass.assessment}</p>
                    <Badge
                        color={`light-${ass?.grade?.startsWith(GRADES.a) ? COLOR_STATUS[0] : ass?.grade?.startsWith(GRADES.b)
                            ? COLOR_STATUS[2] : ass?.grade?.startsWith(GRADES.f) ? COLOR_STATUS[1] : COLOR_STATUS[6]}`}
                        pill>{ass.grade ? ass.grade : '-'}</Badge>
                </div>,
                width: '200px'
            })
        })

        tableColumn = [
            ...tableColumn, {
                name: 'AVERAGE',
                selector: row => row.average,
                width: '120px'
            }, {
                name: 'EXAM STATUS',
                selector: row => row.status,
                width: '140px'
            }, {
                name: 'ACTION',
                selector: row => row.action,
                width: '185px'
            }
        ]

        const tableBody = []
        let count = 0

        if (studentList.length !== 0) {
            studentList.map(item => {
                let tempStatus = '-'
                if (item.examStatus) tempStatus = capitalize(item.examStatus.replaceAll('_', ' ').toLowerCase())
                tableBody.push({
                    name: <Avatar count={count} name={item.studentName} code={item.cbNo}/>,
                    batch: data.batchName,
                    // diagnostic: <div>
                    //     <p>{item.diagnosticType}</p>
                    //     <p id={'mark'}>{item.diagnosticAssessment}</p>
                    //     <Badge
                    //         color={`light-${item.diagnosticGrade === GRADES.a ? COLOR_STATUS[0] : item.diagnosticGrade === GRADES.b
                    //             ? COLOR_STATUS[2] : item.diagnosticGrade === GRADES.f ? COLOR_STATUS[1] : COLOR_STATUS[6]}`}
                    //         pill>{item.diagnosticGrade}</Badge>
                    // </div>,
                    // formative: <div>
                    //     <p>{item.formativeType}</p>
                    //     <p id={'mark'}>{item.formativeAssessment}</p>
                    //     <Badge
                    //         color={`light-${item.formativeGrade === GRADES.a ? COLOR_STATUS[0] : item.formativeGrade === GRADES.b
                    //             ? COLOR_STATUS[2] : item.formativeGrade === GRADES.f ? COLOR_STATUS[1] : COLOR_STATUS[6]}`}
                    //         pill>{item.formativeGrade}</Badge>
                    // </div>,
                    // summary: <div>
                    //     <p>{item.summativeType}</p>
                    //     <p id={'mark'}>{item.summativeAssessment}</p>
                    //     <Badge
                    //         color={`light-${item.summativeGrade === GRADES.a ? COLOR_STATUS[0] : item.summativeGrade === GRADES.b
                    //             ? COLOR_STATUS[2] : item.summativeGrade === GRADES.f ? COLOR_STATUS[1] : COLOR_STATUS[6]}`}
                    //         pill>{item.summativeGrade}</Badge>
                    // </div>,
                    average: <div>
                        <p>{`${Number(item.average).toFixed(0)}%`}</p>
                        <Badge
                            color={`light-${item.averageGrade === GRADES.a ? COLOR_STATUS[0] : item.averageGrade === GRADES.b
                                ? COLOR_STATUS[2] : item.averageGrade === GRADES.f ? COLOR_STATUS[1] : COLOR_STATUS[6]}`}
                            pill>{item.averageGrade}</Badge>
                    </div>,
                    status: <p className={item.examStatus === EXAM_STATUS.pass ? 'lbl-primary-marking' :
                        item.examStatus === EXAM_STATUS.fail ? 'lbl-danger-marking' : 'lbl-warning-marking'}>{tempStatus}</p>,
                    action: <Button color='primary' outline size='sm' onClick={() => this.navigateToSMP(item)}><Eye
                        size={13}/> Master Profile</Button>
                })
                count > 5 ? count = 0 : count += 1
            })
        }

        return (
            <Card className={'haa-view-students-marking'} style={{height: '100%'}}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>{data && data.moduleName}</CardTitle>
                    <div className='d-flex '>

                        <ExportMenu
                            headers={STUDENTS_MARKINGS_CSV_HEADER}
                            filename={'student_marking'}
                            data={exportList}
                            onClick={this.exportAction}
                            btnText={'Export'}
                            outline
                        />

                        {/*<Button className={'top-custom-btn'} color='secondary' outline size={'sm'}*/}
                        {/*        onClick={() => this.exportAction()}>*/}
                        {/*    <Upload size={15}/>*/}
                        {/*    <span className='align-middle ml-50'> Export </span>*/}
                        {/*</Button>*/}
                        {/*<CSVLink data={exportList} filename={"student marking.csv"}*/}
                        {/*         headers={STUDENTS_MARKINGS_CSV_HEADER} ref={this.csvLinkEl}>*/}
                        {/*</CSVLink>*/}
                        <div className='ml-50'>
                            <X id={'close-icon'} onClick={() => this.props.history.goBack()}/>
                        </div>
                    </div>
                </CardHeader>
                <CardBody>
                    <h5>General Information</h5>
                    <Row>
                        <Col xs={3}>
                            <Label>Course</Label>
                            <p>{data && data.courseName}</p>
                        </Col>
                        <Col xs={3}>
                            <Label>Module</Label>
                            <p>{data && data.moduleName}</p>
                        </Col>
                        <Col xs={3}>
                            <Label>Batch</Label>
                            <p>{data && data.batchName}</p>
                        </Col>
                    </Row>
                    <hr/>
                    {
                        this.state.showFilter &&
                        <Filter
                            list={[
                                {
                                    type: FILTER_TYPES.input,
                                    name: 'name',
                                    label: 'Student Name',
                                    placeholder: 'Search by Name',
                                    value: this.props.filter.name
                                },
                                {
                                    type: FILTER_TYPES.input,
                                    name: 'cb',
                                    label: `${basicInfo.regText}`,
                                    placeholder: `Search by ${basicInfo.regCode}`,
                                    value: this.props.filter.cb
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'status',
                                    label: 'Exam Status',
                                    placeholder: 'All',
                                    options: defaultAll.concat(EXAM_STATUS_DROPDOWN),
                                    value: this.props.filter.status
                                }
                            ]}
                            onFilter={this.onFilterHandler}
                        />
                    }
                </CardBody>
                <div className='react-dataTable'>
                    <DataTable
                        noHeader
                        pagination
                        columns={tableColumn}
                        paginationPerPage={40}
                        className='react-dataTable'
                        paginationDefaultPage={currentPage + 1}
                        paginationComponent={() => CustomPagination({
                            currentPage,
                            numberOfElements,
                            totalElements,
                            totalPages,
                            offset,
                            handlePagination: page => this.handlePagination(page)
                        })}
                        data={tableBody}
                    />
                </div>
            </Card>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(ViewMarkings)
