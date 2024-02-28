import React, {Component, Fragment} from 'react'
import {Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap"
import DataTable from "react-data-table-component"
import {BANK_TRANSFER_TABLE_COLUMN} from "./tableData"
import {ChevronDown, Eye, FileText} from "react-feather"
import {enrollmentRequest, errorMessage, bankTransfer} from '@strings'
import {
    FILTER_TYPES,
    COLOR_STATUS,
    HOA_APPROVALS_STATUS,
    DATE_FORMAT_TABLE,
    // FM_EXCEMPTION_STATUS,
    BANK_TRANSFER_CSV_HEADER,
    APPROVE_PAYMENT_VIEW,
    FILTERS,
    DATE_FORMAT
} from '@const'
import Filter from "@components/filter"
import PaymentSlipConfirmation from "@components/payment-slip-confirmation"
import CustomPagination from "@components/customPagination"
import Avatar from '@components/avatar'
import './scss/_enrollmentRequests.scss'
import * as Api from "@api/fe"
import * as ApiHaa from "@api/haa"
import * as ApiCounselor from "@api/counsellor"
import moment from "moment"
import {toast} from "react-toastify"
import {CommonToast} from "@toast"
import {slipConfirmationValidation} from '@validations/financeExecutive'
import {slipConfirmationErrors} from '@formError/financeExecutive'
import rs from '@routes'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import {capitalize} from '@commonFunc'
import {showError, getFirstTwoLetter} from '@utils'
import ExportMenu from '@components/export-menu'

const initialSlipState = {
    paymentSlip: '',
    amount: '',
    depositedDate: '',
    remark: '',
    studentName: '',
    apiitRefNo: '',
    id: '',
    enrollmentRequests: []
}

class BankTransfer extends Component {
    csvLinkEl = React.createRef()

    state = {
        batches: [],
        data: [],
        courses: [],
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

    slipModalHandler = async (state, data, totalAmount) => {
        if (state) {
            const item = data.item.bankTransfers[0]
            const res = await ApiHaa.getAllBanks()

            this.setState({
                isSlipModal: state,
                selectedSlip: {
                    ...this.state.selectedSlip,
                    paymentSlip: item.bankSlip,
                    studentName: item.studentName,
                    apiitRefNo: item.apiitRefNo,
                    id: item.transferId,
                    amount: totalAmount,
                    depositedDate: item.depositDate,
                    enrollmentRequests: data.item.bankTransfers
                },
                selectedItem: item,
                selectedData: data,
                banks: res
            })
        } else {
            this.setState({isSlipModal: state, selectedSlip: initialSlipState, error: slipConfirmationErrors})
        }
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
                showError()
                return
            }
        }

        this.onSubmit(id, state)
    }

    onSubmit = async (state) => {
        const {selectedSlip} = this.state
        const requestIds = selectedSlip.enrollmentRequests.map(item => {
            return item.transferId
        })

        const body = {
            amount: Number.parseFloat(selectedSlip.amount),
            depositedDate: moment(selectedSlip.depositedDate).format(DATE_FORMAT),
            remark: selectedSlip.remark,
            status: state,
            bank: selectedSlip?.bank?.id,
            requestIds
        }

        const res = Api.changeBankTransferRequestsStatus(body)
        if (res) {
            await this.slipModalHandler(false)
            if (state === 'APPROVED') {
                this.navigateToView(this.state.selectedData)
            } else {
                await this.getAllEnrollmentRequests()
                await this.forceUpdate()
            }
        }
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                route: rs.bankTransfer,
                status: {label: 'Pending', value: 'PENDING'}
            }))
        } else if (this.props.filter.route !== rs.bankTransfer) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                route: rs.bankTransfer,
                status: {label: 'Pending', value: 'PENDING'}
            }))
        }
        this.setState({showFilter: true})
        await this.getAllEnrollmentRequests()
        await this.loadAllCourses()
        await this.loadAllBatches()
    }

    loadAllBatches = async () => {
        const res = await Api.getAllBatches()
        if (res) {
            const data = [{label: 'All', value: null}]
            res.map(item => {
                data.push(item)
            })
            await this.setState({batches: data})
        }
    }

    loadAllCourses = async () => {
        const res = await ApiCounselor.getAllCourses()
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.courseId, label: item.courseName})
        })
        this.setState({courses: data})
    }

    bodyData = async () => {
        const filter = await this.props.filter
        const body = {
            cbNumber: filter.cbNumber ? filter.cbNumber.trim() : null,
            studentName: filter.name ? filter.name.trim() : null,
            nicPassport: filter.nicPassport ? filter.nicPassport.trim() : null,
            dateRange: filter.dateRange ? filter.dateRange : null,
            batchId: filter.batch ? filter.batch.value : null,
            status: filter.status ? filter.status.value : null,
            courseId: filter.course ? filter.course.value : null
        }
        return body
    }

    getAllEnrollmentRequests = async () => {
        const data = {body: await this.bodyData(), page: this.state.currentPage, size: 10}
        const res = await Api.getAllBankTransferRequest(data)
        if (res && res.content) {
            this.setState({
                ...this.state,
                data: res.content,
                numberOfElements: res.numberOfElements,
                totalElements: res.totalElements,
                totalPages: res.totalPages,
                offset: res.pageable.offset,
                pageSize: res.pageable.pageSize
            })
        }
    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.bankTransfer}))
        await this.setState({currentPage: 0})
        await this.getAllEnrollmentRequests()
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.getAllEnrollmentRequests()
    }

    exportData = async (type, size, page, isGetPages) => {
        const res = await Api.exportAllBankTransferRequests(this.bodyData(), page !== undefined ? page : this.state.currentPage, size ? size : 10, !isGetPages)
        if (res?.content && res?.content.length > 0) {
            await this.setState({exportData: res.content})
        }
        return res
    }

    navigateToView = (data) => {
        const item = {}
        item['tab'] = '6'
        item['viewType'] = APPROVE_PAYMENT_VIEW.bankTransfer
        item['studentId'] = data.item.studentId
        item['transferId'] = data.item.bankTransfers[0].transferId
        item['paymentId'] = data.item.studentCoursePaymentPlanId
        item['amount'] = data.amount
        item['batch'] = data.batch
        item['counselor'] = data.counselor
        // item['discount'] = data.discount
        item['email'] = data.email
        item['feeType'] = data.feeType
        item['intake'] = data.intake
        item['item'] = data.item
        this.props.history.push({pathname: rs.viewBankTransfer, state: item})
    }

    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state
        const allData = []
        let count = 0

        this.state.data.map((item, i) => {
            allData.push({
                //cbNo: <span className={'lbl-cbno'}>{item.cbNumber}</span>,
                name: <div key={i} className={'item-name-id'}>

                    <Avatar className={'Tbl_avatar'} color={`light-${COLOR_STATUS[count]}`}
                            content={item.studentName ? getFirstTwoLetter(item.studentName) : 'A'} initials/>

                    <div className={'item-name-section'}>
                        <span className={'item-name'}>{item.studentName ? item.studentName : '-'}</span>
                        <span className={'item-id'}>{item.cbNumber}</span>
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
                // actions: <Button onClick={() => this.navigateToView(item)} className={'top-custom-btn'} color='primary'
                //                  outline>
                //     <Eye size={15}/>
                //     <span className='m-md-1 align-middle ml-50'>View</span>
                // </Button>,
                counselor: item.counsellorName,
                course: <div className={'course-container'}>
                    <span>{item.courseName}</span>
                    <span>{item.courseCode}</span>
                </div>,
                discount: item.discounts.length > 0 ? item.discounts.map((d, index) => <>{`${index !== 1 ? `${d}` : ` , ${d}`}`}</>) : 'N/A',
                intake: item.intakeCode,
                // depositDate: item.depositDate ? moment(item.depositDate).format(DATE_FORMAT_TABLE) : 'N/A',
                feeType: item.feeType,
                amount: item.amount,
                batch: item.batchCode,
                item
            })
            count > 5 ? count = 0 : count += 1
        })

        const ExpandableTable = ({data}) => {
            let transferIds = ''
            let depositDates = ''
            let feeTypes = ''
            let amount = 0
            let currency = ''
            data.item.bankTransfers.map((item, i) => {
                const typeFee = item.feeType ? capitalize(item.feeType.replaceAll('_', ' ').toLowerCase()) : ''
                const dateDeposit = item.depositDate ? moment(item.depositDate).format(DATE_FORMAT_TABLE) : ''
                transferIds += i !== 0 ? `, ${item.transferId}` : item.transferId
                depositDates += i !== 0 ? `, ${dateDeposit}` : dateDeposit
                feeTypes += i !== 0 ? `, ${typeFee}` : typeFee
                amount += item.amount
                currency = item.currency ? item.currency : ''
            })

            return (<div className={'expandable-content p-2'}>
                <Row style={{width: '100%'}}>
                    <Col md='4'>
                        <div className='expandable-card expandable-content'>
                            <p>
                            <span
                                className='font-weight-bold'>Batch :</span> {data.batch ? data.batch : 'N/A'}
                            </p>
                        </div>
                    </Col>

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
                                className='font-weight-bold'>Counselor :</span> {data.counselor ? data.counselor : 'N/A'}
                            </p>
                        </div>
                    </Col>

                    <span className='font-weight-bolder'>Bank Transfers</span>
                    <Row>
                        <Col md='5'>
                            <div className='expandable-card expandable-content'>
                                <p>
                                        <span
                                            className='font-weight-bold'>Transfer ID :</span> {transferIds}
                                </p>

                                <p>
                                        <span
                                            className='font-weight-bold'>Deposited Date :</span> {depositDates}
                                </p>
                            </div>
                        </Col>

                        <Col md='5'>
                            <div className='expandable-card expandable-content'>
                                <p>
                                        <span
                                            className='font-weight-bold'>Fee Type :</span> {feeTypes}
                                </p>

                                <p>
                                        <span
                                            className='font-weight-bold'>Amount :</span> {amount ? `${currency} ${amount.toLocaleString()}` : 'N/A'}
                                </p>
                            </div>
                        </Col>

                        <Col md='2'>
                            {data.item.status === HOA_APPROVALS_STATUS[1] && <div style={{padding: '12px 0'}}>
                                <Button onClick={() => this.navigateToView(data)} className={'top-custom-btn'}
                                        color='primary'
                                        outline>
                                    <Eye size={15}/>
                                    <span className='m-md-1 align-middle ml-50'>View</span>
                                </Button>
                            </div>}

                            {data.item.status !== HOA_APPROVALS_STATUS[1] &&
                                <div style={{padding: '12px 0'}} className='expandable-content'>
                                    <Button onClick={() => this.slipModalHandler(true, data, amount)}
                                            className={'top-custom-btn'}
                                            color='primary' outline>
                                        <FileText size={15}/>
                                        <span className='m-md-1 align-middle ml-50'> Collect</span>
                                    </Button>
                                </div>}
                        </Col>
                    </Row>
                </Row>
            </div>)
        }

        return (<Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>{bankTransfer.bankTransferRequests}</CardTitle>
                    {/*<div className='d-flex mt-md-0 mt-1'>*/}
                    {/*    <CSVLink*/}
                    {/*        headers={BANK_TRANSFER_CSV_HEADER}*/}
                    {/*        data={this.state.exportData}*/}
                    {/*        ref={this.csvLinkEl}*/}
                    {/*        filename={"bank_transfer_requests_export.csv"}*/}
                    {/*    />*/}
                    {/*    <Button onClick={this.exportData} className={'top-custom-btn'} color='primary' outline>*/}
                    {/*        <Upload size={15}/>*/}
                    {/*        <span className='align-middle ml-50'> Export </span>*/}
                    {/*    </Button>*/}
                    {/*</div>*/}
                    <Row>
                        <Col md={12}>
                            <ExportMenu
                                headers={BANK_TRANSFER_CSV_HEADER}
                                filename={'bank_transfer_requests_export'}
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
                                    name: 'cbNumber',
                                    label: bankTransfer.cbNumber,
                                    placeholder: bankTransfer.searchByCBNumber,
                                    value: this.props.filter.cbNumber
                                },
                                {
                                    type: FILTER_TYPES.input,
                                    name: 'nicPassport',
                                    label: bankTransfer.nicPassport,
                                    placeholder: bankTransfer.searchByNICPassport,
                                    value: this.props.filter.nicPassport
                                },
                                {
                                    type: FILTER_TYPES.rangePicker,
                                    name: 'dateRange',
                                    label: 'Request Date',
                                    placeholder: 'From - To',
                                    value: this.props.filter.dateRange
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'batch',
                                    label: bankTransfer.batch,
                                    placeholder: 'All',
                                    options: this.state.batches,
                                    value: this.props.filter.batch
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
                                    type: FILTER_TYPES.dropDown,
                                    name: 'status',
                                    label: enrollmentRequest.status,
                                    placeholder: 'All',
                                    // options: FM_EXCEMPTION_STATUS,
                                    value: this.props.filter && this.props.filter.status ? this.props.filter.status : {
                                        label: 'Pending',
                                        value: 'PENDING'
                                    }
                                    // default: this.props.filter.status
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
                        columns={BANK_TRANSFER_TABLE_COLUMN}
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
                    modalHandler={this.slipModalHandler}
                    onInputHandler={this.onInputHandler}
                    dateRangeHandler={this.dateRangeHandler}
                    onSubmit={this.slipFormValidation}
                    error={this.state.error}
                    banks={this.state.banks}
                />
            }
        </Fragment>)
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(BankTransfer)
