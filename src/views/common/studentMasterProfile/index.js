import React, {Fragment} from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, Input, UncontrolledTooltip} from 'reactstrap'
import {STUDENT_PROFILE_TABLE_COLUMN} from './tableData'
import './scss/_studentProfile.scss'
import {isNULL, getCookieUserData, getFirstTwoLetter} from '@utils'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar'
import {
    COLOR_STATUS,
    FILTERS,
    FILTER_TYPES,
    STUDENT_CSV_HEADER,
    STUDENT_PROFILE_VIEW_TYPES
} from '@const'
import {Eye, Info} from 'react-feather'
import CustomPagination from "@components/customPagination"
import rs from '@routes'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import Filter from "@components/filter"
import * as apiHaa from "@api/haa_"
import * as apiCounselor from "@api/counselor_"
import config from '@storage'
import {basicInfo} from '@configs/basicInfomationConfig'

const all = {label: 'All', value: 'All'}
const registrationRole = [config.counsellorRole, config.hocRole]

class StudentProfiles extends React.Component {


    csvLinkEl = React.createRef()
    state = {
        // data: [{studentId:1,studentName:'Kamal Sooriyabandara',cbNumber:'CB-123-DE',studentMobile:'0775618631',studentEmail:'tim.jennings@example.com',batchCode:'23ww',courseName:'Integrated Law Course- BA + LL.B',uniId:'56'}],
        data: [],
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        offset: 0,
        numberOfElements: 0,
        courseOption: [],
        batchOption: [],
        counsellorOption: [],
        exportList: [],
        userId: getCookieUserData().userId,
        showFilter: false,
        isAllSelect: false,
        isSelectRow: false,
        generateIdButtonState: true,
        showModal: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.manageStudentProfiles}))
        } else if (this.props.filter.route !== rs.manageStudentProfiles) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.manageStudentProfiles}))
        }
        this.setState({showFilter: true})
        await this.loadDropdownData()
        await this.loadTableData(this.props.filter, 0)

    }

    loadDropdownData = async () => {
        const all = [{label: 'All', value: 'All'}]

        const url = `courses/restriction?userId=${this.state.userId}`
        const courseRsult = await apiCounselor.getAllCourses(url)
        const batchRsult = await apiHaa.getAllBatches_()
        const counselorRsult = await apiCounselor.getAllCounselors(this.state.userId)

        this.setState({
            courseOption: [
                ...all, ...courseRsult.map(item => {
                    return {value: item.courseId, label: item.courseName}
                })
            ],
            batchOption: [...all, ...batchRsult],
            counsellorOption: [...all, ...counselorRsult]
        })

    }

    loadTableData = async (data, page) => {
        const students = await apiHaa.getAllStudent(data, page, '', 10, true)
        if (students !== undefined && students.content !== undefined) {
            this.setState({
                data: students.content,
                totalPages: students.totalPages,
                totalElements: students.totalElements,
                offset: students.pageable.offset,
                numberOfElements: students.numberOfElements
            })
        }
    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.manageStudentProfiles}))
        this.setState({currentPage: 0})
        this.loadTableData(data, 0)
    }

    handlePagination = async (val) => {
        await this.loadTableData(this.props.filter, val.selected)
        this.setState({
            currentPage: (val.selected)
        })
    }

    viewAction = (data) => {
        const details = {
            studentId: data.studentId,
            cb: data.cbNumber,
            inquiryId: data.inquiryId,
            paymentId: data.studentCoursePaymentPlanId,
            viewType: STUDENT_PROFILE_VIEW_TYPES.stepperView,
            batchId: data.batchId
        }
        sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(data))
        this.props.history.push({pathname: rs.studentProfileView, state: details})
    }


    render() {

        const {
            currentPage,
            totalElements,
            totalPages,
            offset,
            numberOfElements,
            data,
            counsellorOption,
            batchOption,
            courseOption
        } = this.state
        const tableData = []
        let count = 0

        if (data.length !== 0) {
            data.map((item, i) => {
                tableData.push({
                    name:
                        <div className="name-container">
                            <Avatar className={'Tbl_avatar'} color={`light-${COLOR_STATUS[count]}`}
                                    content={getFirstTwoLetter(item.studentName)}
                                    initials/>

                            <div className={'item-name'}>
                                <span id={`name${i}`}>{item.studentName}</span>
                                <span style={{fontWeight: 'normal'}}>{item.cbNumber}</span>
                            </div>
                        </div>,
                    contact: item.studentMobile === null && item.studentEmail === null ? 'N/A' : <div>
                        <p className="item-contact">{item.studentMobile}</p>
                        <span>{item.studentEmail}</span>
                    </div>,
                    batch: <div className={'tbl-data'}>{isNULL(item.batchCode) ? item.batchCode : 'N/A'}</div>,
                    course: <div className={'tbl-data'}>{isNULL(item.courseName) ? item.courseName : 'N/A'}</div>,
                    uniId: <div className={'tbl-data'}>{isNULL(item.uniId) ? item.uniId : 'N/A'}</div>,
                    action: <Button outline className={'edit-btn'} size={'sm'} color='primary'
                                    onClick={() => this.viewAction(item)}><Eye size={15}/> View</Button>
                })
                count > 5 ? count = 0 : count += 1
            })
        }

        return (
            <Fragment>
                <Card className={'student-profiles'}>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'
                                   className="heading">{registrationRole.includes(getCookieUserData().role) ? 'Registrations' : 'Student Master Profiles'}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        {
                            this.state.showFilter &&
                            <Filter
                                list={[
                                    {
                                        type: FILTER_TYPES.input,
                                        name: 'name',
                                        label: 'Name',
                                        placeholder: 'Search by Name',
                                        value: this.props.filter.name
                                    },
                                    {
                                        type: FILTER_TYPES.input,
                                        name: 'cb',
                                        label: basicInfo.regText,
                                        placeholder: `Search by ${basicInfo.regText}`,
                                        value: this.props.filter.cb
                                    },
                                    {
                                        type: FILTER_TYPES.input,
                                        name: 'nicPassport',
                                        label: 'NIC/PP',
                                        placeholder: 'Search by NIC/PP',
                                        value: this.props.filter.nicPassport
                                    },
                                    {
                                        type: FILTER_TYPES.number,
                                        name: 'contact',
                                        label: 'Contact No',
                                        placeholder: 'Search by Contact Number',
                                        value: this.props.filter.contact
                                    },
                                    {
                                        type: FILTER_TYPES.dropDown,
                                        name: 'course',
                                        label: 'Course',
                                        placeholder: 'All',
                                        options: courseOption,
                                        value: this.props.filter.course
                                    },
                                    {
                                        type: FILTER_TYPES.dropDown,
                                        name: 'batch',
                                        label: 'Batch',
                                        placeholder: 'All',
                                        options: batchOption,
                                        value: this.props.filter.batch
                                    },
                                    {
                                        type: FILTER_TYPES.dropDown,
                                        name: 'counselor',
                                        label: ' Counselor',
                                        placeholder: 'All',
                                        options: counsellorOption,
                                        value: this.props.filter.counselor
                                    }
                                ]}
                                onFilter={this.onFilterHandler}
                            />
                        }

                        <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                pagination
                                data={tableData}
                                columns={STUDENT_PROFILE_TABLE_COLUMN}
                                paginationPerPage={10}
                                className='react-dataTable'
                                paginationDefaultPage={this.state.currentPage + 1}
                                paginationComponent={() => CustomPagination({
                                    currentPage,
                                    numberOfElements,
                                    totalElements,
                                    totalPages,
                                    offset,
                                    handlePagination: page => this.handlePagination(page)
                                })}

                            />
                        </div>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(StudentProfiles)
