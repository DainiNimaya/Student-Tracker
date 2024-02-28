import React, {Component, Fragment} from 'react'
import {Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap"
import DataTable from "react-data-table-component"
import {ENROLLMENT_REQUESTS_TABLE_COLUMN} from "./tableData"
import {ChevronDown, Eye, FileText} from "react-feather"
import {enrollmentRequest, errorMessage} from '@strings'
import {
    FILTER_TYPES,
    COLOR_STATUS,
    HOA_APPROVALS_STATUS,
    DATE_FORMAT_TABLE,
    // FM_EXCEMPTION_STATUS,
    ENROLLMENT_REQUESTS_CSV_HEADER,
    APPROVE_PAYMENT_VIEW,
    FILTERS,
    DATE_FORMAT,
    STUDENT_PROFILE_VIEW_TYPES
} from '@const'
import Filter from "@components/filter"
import PaymentSlipConfirmation from "@components/payment-slip-confirmation"
import CustomPagination from "@components/customPagination"
import Avatar from '@components/avatar'
import './scss/_enrollmentRequests.scss'
import * as Api from "@api/fe"
import * as apiHaa from "@api/haa"
import * as ApiCounselor from "@api/counsellor"
import moment from "moment"
import {toast} from "react-toastify"
import {CommonToast} from "@toast"
import {slipConfirmationValidation} from '@validations/financeExecutive'
import {slipConfirmationErrors} from '@formError/financeExecutive'
import rs from '@routes'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import {capitalize, getLoggedUserData} from '@commonFunc'
import {getFirstTwoLetter} from '@utils'
import ExportMenu from '@components/export-menu'

const initialSlipState = {
    paymentSlip: '',
    amount: '',
    depositedDate: '',
    remark: '',
    studentName: '',
    apiitRefNo: '',
    id: '',
    enrollmentRequests: [],
    banks: []
}

class EnrollmentRequests extends Component {
    csvLinkEl = React.createRef()

    state = {
        data: [],
        courses: [],
        counselors: [],
        intakes: [],
        exportData: [],
        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0,
        isSlipModal: false,
        selectedSlip: initialSlipState,
        error: slipConfirmationErrors,
        selectedItem: null,
        selectedData: null,
        banks: [],
        showFilter: false
    }

    slipModalHandler = async (state, item, data, totalAmount, firstDate) => {
        if (state) {
            // this is for fix connection interupt issue in receipt
            await sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(data.item))
            const res = await apiHaa.getAllBanks()
            this.setState({
                isSlipModal: state,
                selectedSlip: {
                    ...this.state.selectedSlip,
                    paymentSlip: item.bankSlip,
                    bank: item.bank,
                    studentName: data.item.studentName,
                    apiitRefNo: data.item.apiitRefNo,
                    // id: item.enrollmentRequestId,
                    amount: totalAmount,
                    depositedDate: firstDate,
                    enrollmentRequests: data.item.enrollmentRequests
                },
                selectedItem: item,
                selectedData: data,
                banks: res
            })
        } else {
            this.setState({isSlipModal: state, selectedSlip: initialSlipState, error: slipConfirmationErrors})
        }
    }

    viewMasterProfile = async (data) => {
        const details = {
            studentId: data.item.studentId,
            cb: data.item.cbNumber,
            paymentId: data.item.studentCoursePaymentPlanId !== 0 ? data.item.studentCoursePaymentPlanId : data.item.paymentPlanId,
            viewType: STUDENT_PROFILE_VIEW_TYPES.stepperView
        }
        await sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(data.item))
        this.props.history.push({pathname: rs.studentProfileView, state: details})
    }

    onInputHandler = (e) => {
        this.setState({
            ...this.state,
            selectedSlip: {
                ...this.state.selectedSlip,
                [e.target.name]: e.target.value
            }
        })
    }

    dateRangeHandler = (date) => {
        this.setState({
            ...this.state,
            selectedSlip: {
                ...this.state.selectedSlip,
                depositedDate: date[0]
            }
        })
    }

    slipFormValidation = (id, state) => {
        const {amount, depositedDate, remark, bank} = this.state.selectedSlip
        const res = slipConfirmationValidation(amount, depositedDate, remark, bank)
        this.setState({error: res})
        for (const key in res) {
            if (res[key]) {
                return
            }
        }

        this.onSubmit(id, state)
    }

    onSubmit = async (state) => {
        const {selectedSlip} = this.state
        const requestIds = selectedSlip.enrollmentRequests.map(item => {
            return item.enrollmentRequestId
        })
        const body = {
            amount: Number.parseFloat(selectedSlip.amount),
            depositedDate: moment(selectedSlip.depositedDate).format(DATE_FORMAT),
            remark: selectedSlip.remark,
            bank: selectedSlip.bank.value,
            status: state,
            requestIds,
            userId: getLoggedUserData().userId
        }

        const res = await Api.changeEnrollmentRequestsStatus(this.state.selectedSlip.id, body)
        if (res) {
            if (state === 'APPROVED') {
                this.navigateToView(this.state.selectedSlip, '6', this.state.selectedData)
                //this.viewMasterProfile(this.state.selectedData)
            } else {
                await this.getAllEnrollmentRequests()
                await this.forceUpdate()
            }
        }
        await this.slipModalHandler(false)
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                route: rs.enrollmentRequests,
                status: null
            }))
        } else if (this.props.filter.route !== rs.enrollmentRequests) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                route: rs.enrollmentRequests,
                status: null
            }))
        }
        this.setState({showFilter: true})
        await this.getAllEnrollmentRequests()
        await this.loadAllCounselors()
        await this.loadAllCourses()
        await this.loadAllIntakes()
        await this.getAllBanks()
        if (this.props.location.state) {
            await this.navigateToSlipModalView(this.props.location.state)
        }

    }

    navigateToSlipModalView = async (itemData) => {
        const requestIdList = []
        const feeTypeList = []
        let amountList = 0
        const depositedDateList = []
        itemData.enrollmentRequests.map((item, i) => {
            requestIdList.push(i !== 0 ? `, ${item.enrollmentRequestId}` : item.enrollmentRequestId)
            feeTypeList.push(item.feeType ? i !== 0 ? `, ${capitalize(item.feeType.replaceAll('_', ' ').toLowerCase())}` : capitalize(item.feeType.replaceAll('_', ' ').toLowerCase()) : '')
            //amountList.push(i !== 0 ? `, ${item.amount.toLocaleString()}` : `${item.amount.toLocaleString()}`)
            amountList += item.amount
            depositedDateList.push(i !== 0 ? `, ${item.depositDate}` : item.depositDate)
        })
        await this.slipModalHandler(true, {}, {item: itemData}, amountList, itemData.enrollmentRequests[0].depositDate)
    }


    getAllBanks = async () => {
        const res = await apiHaa.getAllBanks()
        await this.setState({
            banks: res.filter(item => item.visibility === true).map(item => {
                return {...item, label: `${item.bankName} (${item.accountNumber})`}
            })
        })
    }

    loadAllIntakes = async () => {
        const res = await ApiCounselor.getAllIntakes()
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.intakeId, label: item.intakeCode})
        })
        await this.setState({intakes: data})
    }

    loadAllCounselors = async () => {
        const res = await ApiCounselor.getAllCounselors()
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.value, label: item.label})
        })
        this.setState({counselors: data})
    }

    loadAllCourses = async () => {
        const res = await ApiCounselor.getAllCourses()
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.courseId, label: item.courseName})
        })
        this.setState({courses: data})
    }

    bodyData = () => {
        const filter = this.props.filter
        const body = {
            studentName: filter.name ? filter.name.trim() : null,
            dateRange: filter.dateRange ? filter.dateRange : null,
            counselorId: filter.counselor ? filter.counselor.value : null,
            status: filter.status ? filter.status.value : null,
            courseId: filter.course ? filter.course.value : null,
            intake: filter.intake ? filter.intake.label : null,
            inquiryNo: filter.inquiryNo ? filter.inquiryNo : null
        }
        return body
    }

    getAllEnrollmentRequests = async () => {
        const data = {body: await this.bodyData(), index: this.state.currentPage, size: 10}
        const res = await Api.getAllEnrollmentRequest(data)
        res.content && await this.setState({
            ...this.state,
            data: res.content,
            numberOfElements: res.numberOfElements,
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            offset: res.pageable.offset,
            pageSize: res.pageable.pageSize
        })
    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.enrollmentRequests}))
        await this.setState({currentPage: 0})
        await this.getAllEnrollmentRequests()
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.getAllEnrollmentRequests()
    }

    exportData = async (type, size, page, isGetPages) => {
        const data = {
            body: await this.bodyData(),
            index: page !== undefined ? page : this.state.currentPage,
            size: size ? size : 10,
            dataNeeded: !isGetPages
        }
        const res = await Api.exportAllEnrollmentRequests(data)
        if (res?.content && res?.content?.length > 0) {
            await this.setState({exportData: res.content})
        }
        return res
    }

    navigateToView = (item, tab, isData) => {
        item.enrollmentRequests = isData.item.enrollmentRequests
        sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(isData.item))
        if (isData.item.cbNumber) {
            this.viewMasterProfile(isData)
        } else {
            const data = isData ? isData : this.state.selectedData
            item['tab'] = tab
            item['viewType'] = APPROVE_PAYMENT_VIEW.enrollment
            item['inquiryId'] = data.item.inquiryId
            this.props.history.push({pathname: rs.viewEnrollmentRequests, state: item})
        }
    }

    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state
        const allData = []
        let count = 0

        this.state.data.map((item, i) => {
            allData.push({
                name: <div key={i} className={'item-name-id'}>

                    <Avatar className={"Tbl_avatar"} color={`light-${COLOR_STATUS[count]}`}
                            content={getFirstTwoLetter(item.studentName)}
                            initials/>

                    <div className={'item-name-section'}>
                        <span>{item.studentName}</span>
                        <span className={'item-id'}>{item.inquiryNo ? item.inquiryNo : '-'}</span>
                    </div>
                </div>,
                contact: <div key={i}>
                    {
                        item.studentMobile ? <>
                            <div id={`positionRight${i}`} className={'item-contact'}>{item.studentMobile}</div>
                        </> : '-'
                    }
                    {
                        item.studentEmail ? <div style={{display: 'flex'}}>
                            <div id={`email${i}`} className={'item-email'}>{item.studentEmail}</div>
                        </div> : null
                    }
                </div>,
                email: item.studentEmail,
                requestDate: <p>{item.requestDate ? moment(item.requestDate).format(DATE_FORMAT_TABLE) : '-'}</p>,
                status: <Badge
                    color={`light-${item.status === HOA_APPROVALS_STATUS[0] ? 'warning' : item.status === HOA_APPROVALS_STATUS[1] ? 'primary' : 'danger'}`}
                    pill>{item.status}</Badge>,
                actions: <Button onClick={() => {
                    item['tab'] = '6'
                    item['viewType'] = APPROVE_PAYMENT_VIEW.enrollment
                    item['inquiryId'] = item.inquiryId
                    this.props.history.push({pathname: rs.viewEnrollmentRequests, state: item})
                }} className={'top-custom-btn'}
                                 color={item.enrollmentRequests.length === 0 ? `primary` : 'secondary'}
                                 outline
                                 disabled={item.enrollmentRequests.length !== 0}
                >
                    <Eye size={15}/>
                    <span className='m-md-1 align-middle ml-50'>View</span>
                </Button>,
                counselor: item.counsellorName,
                course: <span className={'course-container'}>{item.courseName}</span>,
                // discount: item.discounts.length > 0 ? item.discounts.map((d, index) => <>{`${index !== 1 ? `${d}` : ` , ${d}`}`}</>) : 'N/A',
                intake: item.intakeCode,
                feeType: item.feeType ? capitalize(item.feeType.replaceAll('_', ' ').toLowerCase()) : '-',
                amount: item.amount,
                item
            })
            count > 5 ? count = 0 : count += 1
        })

        const ExpandableTable = ({data}) => {
            const requestIdList = []
            const feeTypeList = []
            let amountList = 0
            let currency = ''
            const depositedDateList = []
            data.item.enrollmentRequests.map((item, i) => {
                requestIdList.push(i !== 0 ? `, ${item.enrollmentRequestId}` : item.enrollmentRequestId)
                feeTypeList.push(item.feeType ? i !== 0 ? `, ${capitalize(item.feeType.replaceAll('_', ' ').toLowerCase())}` : capitalize(item.feeType.replaceAll('_', ' ').toLowerCase()) : '')
                //amountList.push(i !== 0 ? `, ${item.amount.toLocaleString()}` : ` ${item.amount.toLocaleString()}`)
                amountList += item.amount
                depositedDateList.push(i !== 0 ? `, ${item.depositDate}` : item.depositDate)
                currency = item.currency ? item.currency : ''
            })

            return (<div className={'expandable-content p-2'}>
                <Row style={{width: '100%'}}>
                    <Col md='4'>
                        <div className='expandable-card expandable-content'>
                            <p>
                                <span className='font-weight-bold'>Intake :</span> {data.intake ? data.intake : 'N/A'}
                            </p>
                        </div>
                    </Col>

                    <Col md='4'>
                        <div className='expandable-card expandable-content'>
                            <p>
                            <span
                                className='font-weight-bold'>Coordinator :</span> {data.counselor ? data.counselor : 'N/A'}
                            </p>
                        </div>
                    </Col>

                    <Col md='4'>
                        <div className='expandable-card expandable-content'>
                            <p>
                                <span className='font-weight-bold'>Course :</span> {data.course ? data.course : 'N/A'}
                            </p>
                        </div>
                    </Col>


                    <span className='font-weight-bolder'>Enrollment Requests</span>
                    <Row style={{margin: 0}}>
                        <Col md='3'>
                            <div className='expandable-card expandable-content'>
                                <p>
                                        <span
                                            className='font-weight-bold'>Request ID :</span> {requestIdList}
                                </p>
                                <p>
                                        <span
                                            className='font-weight-bold'>Deposited Date :</span> {depositedDateList}
                                </p>
                            </div>
                        </Col>

                        <Col md='3'>
                            <div className='expandable-card expandable-content'>
                                <p>
                                        <span
                                            className='font-weight-bold'>Fee Type :</span> {feeTypeList}
                                </p>
                            </div>
                        </Col>

                        <Col md='3'>
                            <div className='expandable-card expandable-content'>
                                <p>
                                        <span
                                            className='font-weight-bold'>Amount :</span> {`${currency} ${amountList.toLocaleString()}`}
                                </p>
                            </div>
                        </Col>

                        <Col md='3'>
                            <div style={{padding: '12px 0'}} className='expandable-content'>
                                <Button
                                    onClick={() => this.slipModalHandler(true, {}, data, amountList, data.item.enrollmentRequests[0].depositDate)}
                                    className={'top-custom-btn'}
                                    color='primary' outline>
                                    <FileText size={15}/>
                                    <span className='m-md-1 align-middle ml-50'> Collect</span>
                                </Button></div>
                        </Col>
                    </Row>
                </Row>
            </div>)
        }

        return (<Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>{enrollmentRequest.enrollmentRequests}</CardTitle>
                    {/*<div className='d-flex mt-md-0 mt-1'>*/}
                    {/*    <CSVLink*/}
                    {/*        headers={ENROLLMENT_REQUESTS_CSV_HEADER}*/}
                    {/*        data={this.state.exportData}*/}
                    {/*        ref={this.csvLinkEl}*/}
                    {/*        filename={"enrollment_requests_export.csv"}*/}
                    {/*    />*/}
                    {/*    <Button onClick={this.exportData} className={'top-custom-btn'} color='primary' outline>*/}
                    {/*        <Upload size={15}/>*/}
                    {/*        <span className='align-middle ml-50'> Export </span>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                    <Row>
                        <Col md={12}>
                            <ExportMenu
                                headers={ENROLLMENT_REQUESTS_CSV_HEADER}
                                filename={'enrollment_requests_export'}
                                data={this.state.exportData}
                                onClick={this.exportData}
                                btnText={'Export'}
                                outline
                            />
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    {
                        this.state.showFilter &&
                        <Filter
                            list={[
                                {
                                    type: FILTER_TYPES.input,
                                    name: 'name',
                                    label: 'Student Name',
                                    placeholder: 'Search by Student Name',
                                    value: this.props.filter.name
                                },
                                {
                                    type: FILTER_TYPES.input,
                                    name: 'inquiryNo',
                                    label: 'Inquiry Number',
                                    placeholder: 'Search by Inquiry Number',
                                    value: this.props.filter.inquiryNo
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'counselor',
                                    label: enrollmentRequest.counselor,
                                    placeholder: 'All',
                                    options: this.state.counselors,
                                    value: this.props.filter.counselor
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'course',
                                    label: enrollmentRequest.course,
                                    placeholder: 'All',
                                    options: this.state.courses,
                                    value: this.props.filter.course
                                },
                                {
                                    type: FILTER_TYPES.rangePicker,
                                    name: 'dateRange',
                                    label: enrollmentRequest.dateRange,
                                    placeholder: 'From - To',
                                    value: this.props.filter.dateRange
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'status',
                                    label: enrollmentRequest.status,
                                    placeholder: 'All',
                                    // options: FM_EXCEMPTION_STATUS,
                                    value: this.props.filter.status
                                    // default: this.props.filter.defaultStatue
                                }
                                // {
                                //     type: FILTER_TYPES.dropDown,
                                //     name: 'intake',
                                //     label: enrollmentRequest.intake,
                                //     placeholder: 'All',
                                //     options: this.state.intakes,
                                //     value: this.props.filter.intake
                                // }
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
                        columns={ENROLLMENT_REQUESTS_TABLE_COLUMN}
                        expandOnRowClicked
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10}/>}
                        expandableRowsComponent={ExpandableTable}
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

            {
                this.state.isSlipModal && <PaymentSlipConfirmation
                    title={'Payment Slip Confirmation'}
                    data={this.state.selectedSlip}
                    isOpen={this.state.isSlipModal}
                    banks={this.state.banks}
                    modalHandler={this.slipModalHandler}
                    onInputHandler={this.onInputHandler}
                    dateRangeHandler={this.dateRangeHandler}
                    onSubmit={this.slipFormValidation}
                    error={this.state.error}
                />
            }
        </Fragment>)
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(EnrollmentRequests)
