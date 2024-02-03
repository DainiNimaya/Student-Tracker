import React, {Component, Fragment} from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    Row,
    Col,
    CardBody,
    UncontrolledTooltip
} from "reactstrap"
import {ChevronDown, Eye} from "react-feather"
import DataTable from 'react-data-table-component'
import {registrations} from '@strings'
import {getFirstTwoLetter, findObject, getCookieUserData} from '@utils'
import {
    COLOR_STATUS,
    REGISTRATION_CSV_HEADER,
    INQUIRY_TYPES,
    // MARKETING_CODES,
    FILTER_TYPES,
    FILTERS,
    STUDENT_PROFILE_VIEW_TYPES
} from '@const'
import Avatar from '@components/avatar'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {REGISTRATION_TABLE_COLUMN} from './tableData'
import * as Api from "@api/counselor_"
import CustomPagination from "@components/customPagination"
import './scss/_registrations.scss'
import moment from "moment"
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import rs from '@routes'
import Filter from "@components/filter"
import {getLoggedUserData} from '@commonFunc'
import ExportMenu from '@components/export-menu'
import DuplicateDetailsExpand from "@components/duplicate-details-expand"
import {basicInfo} from '@configs/basicInfomationConfig'

const initialState = {
    name: '',
    cbNumber: '',
    dateRange: null,
    counselor: null,
    course: null,
    intake: null,
    inquiryType: null,
    marketingCode: null
}

class Registration extends Component {
    csvLinkEl = React.createRef()

    state = {
        filter: initialState,
        counselors: [],
        courses: [],
        data: [],
        intakes: [],
        exportData: [],
        inquiryTypes: [],
        marketingCodes: [],
        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0,
        intake: null,
        userId: getLoggedUserData().userId
    }

    async componentWillMount() {
        await this.loadAllIntakes()
        await this.loadAllCounselors()
        await this.loadAllRegistrations()
        this.loadAllCourses()
        this.loadAllInquiryType()
        this.loadAllMarketingCodes()
    }

    loadAllMarketingCodes = () => {
        const data = [{value: null, label: 'All'}]
        // MARKETING_CODES.map(item => {
        //     data.push(item)
        // })
        this.setState({marketingCodes: data})
    }

    loadAllInquiryType = () => {
        const data = [{value: null, label: 'All'}]
        INQUIRY_TYPES.map(item => {
            data.push(item)
        })
        this.setState({inquiryTypes: data})
    }

    loadAllIntakes = async () => {
        const res = await Api.getAllIntakes()
        const data = [{value: null, label: 'All'}]
        let ongoing = null
        res.map(item => {
            data.push({value: item.intakeId, label: item.intakeCode})
            item.ongoing ? ongoing = {label: item.intakeName, value: item.intakeId} : null
        })
        await this.setState({intakes: data, intake: ongoing})
    }

    bodyData = (exp) => {
        const filter = this.props.filter
        const body = {
            studentName: filter.name ? filter.name.trim() : null,
            startDate: filter.dateRange ? moment(filter.dateRange[0]).format('YYYY-MM-DD') : null,
            endDate: filter.dateRange ? moment(filter.dateRange[1]).format('YYYY-MM-DD') : null,
            counselorId: filter.counselor ? filter.counselor.value : null,
            courseId: filter.course ? filter.course.value : null,
            intakeId: filter.intake ? filter.intake.value : null,
            inquiryType: filter.inquiryType ? filter.inquiryType.value : null,
            cbNumber: filter.cbNumber ? filter.cbNumber.trim() : null,
            marketingCode: filter.marketingCode ? filter.marketingCode.value : null,
            action: 'REGISTRATION',
            restrictUserId: getCookieUserData().userId
        }
        if (!exp) {
            body['pagination'] = {
                index: this.state.currentPage,
                size: 10
            }
        }

        return body
    }

    loadAllRegistrations = async () => {
        const data = await this.bodyData()
        const res = await Api.getAllInquiries(data)
        res.content && this.setState({
            ...this.state,
            data: res.content,
            numberOfElements: res.numberOfElements,
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            offset: res.pageable.offset,
            pageSize: res.pageable.pageSize
        })
    }

    loadAllCounselors = async () => {
        const res = await Api.getAllCounselors(this.state.userId)
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push(item)
        })
        if (this.props.filter.route === undefined) {
            this.props.dispatch(handleFilter({
                ...FILTERS,
                counselor: await findObject(data, await getCookieUserData().userId),
                intake: this.state.intake,
                route: rs.registrations
            }))
        } else if (this.props.filter.route !== rs.registrations) {
            this.props.dispatch(handleFilter({
                ...FILTERS,
                counselor: await findObject(data, await getCookieUserData().userId),
                intake: this.state.intake,
                route: rs.registrations
            }))
        }
        await this.setState({counselors: data})
    }

    loadAllCourses = async () => {
        const url = `courses/restriction?userId=${this.state.userId}`
        const res = await Api.getAllCourses(url)
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.courseId, label: item.courseName})
        })
        this.setState({courses: data})
    }

    onDropDownHandler = async (name, e) => {
        await this.setState({...this.state, currentPage: 0, filter: {...this.state.filter, [name]: e}})
        await this.loadAllRegistrations()
    }

    onFilterHandler = async (data) => {
        await this.setState({currentPage: 0})
        await this.props.dispatch(handleFilter({...data, route: rs.registrations}))
        await this.loadAllRegistrations()
    }

    onInputHandler = (e) => {
        this.setState({...this.state, filter: {...this.state.filter, [e.target.name]: e.target.value}})
    }

    dateRangeHandler = async (date) => {
        if (date.length === 2) {
            await this.setState({...this.state, currentPage: 0, filter: {...this.state.filter, dateRange: date}})
            await this.loadAllRegistrations()
        }
    }

    clearFilter = async () => {
        await this.setState({...this.state, currentPage: 0, filter: initialState})
        await this.loadAllRegistrations()
    }

    exportData = async (type, size, page, isGetPages) => {
        const res = await Api.getAllRegisteredExport({
            ...this.bodyData(true),
            pagination: {
                index: page !== undefined ? page : this.state.currentPage,
                size: size ? size : 10
            },
            dataNeeded: !isGetPages

        })
        if (res?.content && res?.content.length > 0) {
            await this.setState({exportData: res.content})
        }
        return res
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.loadAllRegistrations()
    }

    viewAction = (data) => {
        const details = {
            studentId: data.studentId,
            cb: data.cbNumber,
            inquiryId: data.inquiryId,
            viewType: STUDENT_PROFILE_VIEW_TYPES.stepperView
        }
        sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(data))
        this.props.history.push({pathname: rs.studentProfileView, state: details})
    }

    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state
        const {counselor, course, intake, inquiryType, marketingCode} = this.state.filter

        const allData = []
        let count = 0
        this.state.data.map((item, i) => {
            const isDuplicated = item.duplicateDetailsList && item.duplicateDetailsList.length > 0

            let nameCount = 0
            let contactCount = 0
            let emailCount = 0

            if (item.duplicateDetailsList && item.duplicateDetailsList.length > 0) {
                item.duplicateDetailsList.map(dup => {
                    if (item.studentName === dup.studentName) nameCount = nameCount + 1
                    if (item.studentContact === dup.contactNo) contactCount = contactCount + 1
                    if (item.studentEmail === dup.email) emailCount = emailCount + 1
                })
            }

            allData.push({
                ...item,
                cbNo: <span className={'item-id'}>{item.cbNumber ? item.cbNumber : '-'}</span>,
                name: <div className={'item-name-id'}>

                    <Avatar color={`light-${COLOR_STATUS[count]}`}
                            content={item.studentName ? getFirstTwoLetter(item.studentName) : 'N/A'} initials/>
                    {item?.studentName && <>
                                <span
                                    className={'item-name'}
                                    id={`registered-students-${i}`}>{item.studentName ? item.studentName : 'N/A'}</span>
                        {
                            isDuplicated && <sup
                                className={'contact-duplicate'}>{nameCount > 0 && nameCount}</sup>
                        }
                        <UncontrolledTooltip placement='top'
                                             target={`registered-students-${i}`}>{item.studentName}</UncontrolledTooltip>
                    </>}


                    {
                        isDuplicated && <UncontrolledTooltip placement='right' target={`registered-students-${i}`}>
                            Duplicated
                        </UncontrolledTooltip>
                    }
                </div>,
                contact: <div key={i}>
                    {
                        item.studentContact ? <>
                            <div id={`positionRight${i}`} className={'item-contact'}>{item.studentContact}
                                {
                                    isDuplicated && <sup
                                        className={'contact-duplicate'}>{contactCount > 0 && contactCount}</sup>
                                }
                            </div>
                            {
                                isDuplicated && <UncontrolledTooltip placement='right' target={`positionRight${i}`}>
                                    Duplicated
                                </UncontrolledTooltip>
                            }
                        </> : '-'
                    }
                    {
                        item.studentEmail ? <div style={{display: 'flex'}}>
                            <div id={`email${i}`} className={'item-email'}>{item.studentEmail}</div>
                            {
                                isDuplicated &&
                                <sup className={'duplicate'}>{emailCount > 0 && emailCount}</sup>
                            }
                            {isDuplicated && <UncontrolledTooltip placement='right' target={`email${i}`}>
                                Duplicated
                            </UncontrolledTooltip>}
                        </div> : null
                    }
                </div>,
                registeredDate: item.createdAt ? moment(item.createdAt).format('D/M/YYYY') : '-',
                counselor: item.counselor ? `${item.counselor.firstName} ${item.counselor.lastName}` : 'N/A',
                course: item.course ? item.course.courseName : 'N/A',
                intake: item.intake ? item.intake.intakeCode : 'N/A',
                paymentPlan: item.paymentPlan ? item.paymentPlan : 'N/A',
                contactNumber: item.studentContact,
                paymentCollectedBy: (item.paymentCollectedBy && item.paymentCollectedBy.length > 0) ? item.paymentCollectedBy.map((col, i) => {
                    return i !== 0 ? `, ${col}` : col
                }) : 'N/A',
                duplicateDetails: item.duplicateDetailsList,
                actions: <Button className={'top-custom-btn'} color='primary' outline
                                 onClick={() => this.viewAction(item)}>
                    <Eye size={15}/>
                    <span className='m-md-1 align-middle ml-50'>View</span>
                </Button>
            })
            count > 6 ? count = 0 : count += 1
        })


        return (<Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>{registrations.registeredStudents}</CardTitle>
                    <Row className='mt-md-0 mt-1'>
                        <Col md={12}>
                            <ExportMenu
                                headers={REGISTRATION_CSV_HEADER}
                                filename={'registrations_export'}
                                data={this.state.exportData}
                                onClick={this.exportData}
                                btnText={'Export'}
                                outline
                                totalElements={this.state.totalElements}
                            />
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    {
                        this.state.counselors.length !== 0 &&
                        <Filter
                            list={[
                                {
                                    type: FILTER_TYPES.input,
                                    name: 'name',
                                    label: 'Name',
                                    placeholder: registrations.searchByName,
                                    value: this.props.filter.name
                                }, {
                                    type: FILTER_TYPES.input,
                                    name: 'cbNumber',
                                    label: basicInfo.regText,
                                    placeholder: `Search by ${basicInfo.regText}`,
                                    value: this.props.filter.cbNumber
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'counselor',
                                    label: registrations.counselor,
                                    placeholder: 'All',
                                    options: this.state.counselors,
                                    value: this.props.filter && this.props.filter.counselor ? this.props.filter.counselor : findObject(this.state.counselors, getCookieUserData().userId)
                                    // default: this.props.filter.counselor
                                }, {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'course',
                                    label: registrations.course,
                                    placeholder: 'All',
                                    options: this.state.courses,
                                    value: this.props.filter.course
                                },
                                {
                                    type: FILTER_TYPES.rangePicker,
                                    name: 'dateRange',
                                    label: registrations.dateRange,
                                    placeholder: 'From - To',
                                    value: this.props.filter.dateRange
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'intake',
                                    label: registrations.intake,
                                    placeholder: 'All',
                                    options: this.state.intakes,
                                    value: this.props.filter && this.props.filter.intake ? this.props.filter.intake : this.state.intake
                                    // default: this.props.filter.intake
                                }, {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'inquiryType',
                                    label: registrations.inquiryType,
                                    placeholder: 'All',
                                    options: this.state.inquiryTypes,
                                    value: this.props.filter.inquiryType
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'marketingCode',
                                    label: registrations.marketingCode,
                                    placeholder: 'All',
                                    options: this.state.marketingCodes,
                                    value: this.props.filter.marketingCode
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
                        data={allData}
                        expandableRows
                        columns={REGISTRATION_TABLE_COLUMN}
                        expandOnRowClicked
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10}/>}
                        expandableRowsComponent={DuplicateDetailsExpand}
                        expandableRowsComponentProps={{
                            showCounselor: true,
                            showCourse: true,
                            showIntake: true,
                            showPaymentPlan: true,
                            showPaymentCollectedBy: true
                        }}
                        paginationDefaultPage={this.state.currentPage + 1}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
            </Card>
        </Fragment>)
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(Registration)
