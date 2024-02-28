import React, {Fragment} from 'react'
import {Badge, Button, Card, CardBody, Col, Label, Row} from 'reactstrap'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar'
import {
    COLOR_STATUS, DAILY_TRANSACTION_CSV_HEADER, FILTER_TYPES, PAYMENT_METHOD, PAYMENT_TYPE,
    FILTERS, INVOICE_TYPE, STUDENT_PROFILE_VIEW_TYPES, ALL_DAILY_TRANS_PAYMENT_METHOD, INVOICE_PAYMENT_METHOD, CURRENCY
} from '@const'
import {Cpu, FileText, User} from 'react-feather'
import CustomPagination from "@components/customPagination"
import StatsHorizontal from '@components/widgets/stats/CustomizedStatsHorizontal'
import './scss/_dailyTransaction.scss'
import Filter from "@components/filter"
import {DAILY_TRANSACTION_TABLE_COLUMN} from './tableData'
import * as feApi from '@api/fe'
import commaNumber from "comma-number"
import rs from '@routes'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import moment from "moment"
import {getFirstTwoLetter, dailyTransactionRequestUrl} from '@utils'
import {capitalize} from '@commonFunc'
import ExportMenu from '@components/export-menu'
import {basicInfo} from '@configs/basicInfomationConfig'

class DailyTransaction extends React.Component {

    csvLinkEl = React.createRef()
    state = {
        data: [],
        courseOption: [],
        batchOption: [],
        collectedOption: [],

        debit: 0,
        credit: 0,
        netAmt: 0,
        debitForeign: 0,
        creditForeign: 0,
        netAmtForeign: 0,
        transactionList: [],
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        offset: 0,
        numberOfElements: 0,
        exportList: [],
        dateRange: [new Date().setMonth(new Date().getMonth() - 3), new Date()],
        showFilter: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                dateRange: [new Date().setMonth(new Date().getMonth() - 3), new Date()],
                route: rs.dailyTransaction
            }))
        } else if (this.props.filter.route !== rs.dailyTransaction) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                dateRange: [new Date().setMonth(new Date().getMonth() - 3), new Date()],
                route: rs.dailyTransaction
            }))
        }
        this.setState({showFilter: true})
        await this.loadSelectionValues()
    }

    loadSelectionValues = async () => {
        const course = [{label: 'All', value: 'All'}]
        const batch = [{label: 'All', value: 'All'}]
        const collected = [{label: 'All', value: 'All'}]

        const courses = await feApi.getAllCourses()
        const batches = await feApi.getAllBatches()
        const collectedList = await feApi.getCollectedByList()
        this.setState({
            courseOption: course.concat(courses),
            batchOption: batch.concat(batches),
            collectedOption: collected.concat(collectedList)
        })
        this.getTableData(this.state.currentPage)
    }

    handlePagination = async (val) => {
        await this.getTableData(val.selected)
        this.setState({
            currentPage: (val.selected)
        })
    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.dailyTransaction}))
        this.setState({currentPage: 0})
        this.getTableData(0)
    }

    getTableData = async (page) => {
        const url = dailyTransactionRequestUrl(this.props.filter, page, 10, true)
        const transactions = await feApi.getAllDailyTransaction(url)

        this.setState({
            totalPages: transactions.totalPages,
            totalElements: transactions.totalElements,
            offset: transactions.offset,
            numberOfElements: transactions.noOfElements,
            transactionList: transactions.content,
            debit: `${CURRENCY[0]} ${commaNumber(Number(transactions.debit).toFixed(2))}`,
            credit: `${CURRENCY[0]} ${commaNumber(Number(transactions.credit).toFixed(2))}`,
            netAmt: `${CURRENCY[0]} ${commaNumber(Number(transactions.credit - transactions.debit).toFixed(2))}`,
            debitForeign: `${CURRENCY[1]} ${commaNumber(Number(transactions.debitForeign).toFixed(2))}`,
            creditForeign: `${CURRENCY[1]} ${commaNumber(Number(transactions.creditForeign).toFixed(2))}`,
            netAmtForeign: `${CURRENCY[1]} ${commaNumber(Number(transactions.creditForeign - transactions.debitForeign).toFixed(2))}`
        })
    }

    exportAction = async (type, size, page, isGetPages) => {
        const url = dailyTransactionRequestUrl(this.props.filter, page !== undefined ? page : this.state.currentPage, size ? size : 10, !isGetPages)
        const res = await feApi.getAllDailyTransaction(url)
        if (res.content && res.content.length !== 0) {
            await this.setState({exportList: res.content})
        }
        return res
    }

    onReceiptAction = async (pId, iId, type) => {
        if (pId !== null && iId !== null) {
            const result = await feApi.getInvoiceDetail(iId, INVOICE_TYPE.student)
            if (type === 'REFUND') result['refundData'] = [{amount: result.itemFee, feeType: result.itemName}]
            if (result !== null) this.props.history.push({
                pathname: rs.viewReceipt,
                state: {
                    data: result,
                    paymentId: pId,
                    invoiceId: iId,
                    type: 'INVOICE',
                    status: type === 'PAYMENT' ? 'PAID' : type === 'REFUND' ? 'REFUNDED' : 'PAID',
                    invoiceType: INVOICE_TYPE.student
                }
            })
        }
    }

    viewStudent = (data) => {
        const details = {
            studentId: data.expandDate.studentId,
            cb: data.expandDate.cbNumber,
            paymentId: data.expandDate.paymentId,
            viewType: STUDENT_PROFILE_VIEW_TYPES.stepperView
        }
        const requiredData = {
            studentId: data.expandDate.studentId,
            cbNumber: data.expandDate.cbNumber,
            courseName: data.expandDate.courseName,
            courseId: data.expandDate.courseId,
            studentName: data.expandDate.studentName,
            mobile: data.expandDate.studentNumber,
            email: data.expandDate.studentEmail,
            inquiryId: 0
        }
        sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(requiredData))
        this.props.history.push({pathname: rs.studentProfileView, state: details})
    }

    render() {

        const {currentPage, totalElements, totalPages, offset, numberOfElements} = this.state
        const tableData = []
        let count = 0
        let totalLocalRefund = 0
        let totalLocalTransfer = 0
        let totalLocalPayment = 0
        let totalForeignRefund = 0
        let totalForeignTransfer = 0
        let totalForeignPayment = 0
        const tempAll = [{label: 'All', value: 'All'}]

        if (this.state.transactionList.length !== 0) {
            this.state.transactionList.map((item, i) => {

                switch (item.transactionType) {
                    case 'PAYMENT':
                        item.currencyType === CURRENCY[0] ? (totalLocalPayment += item.amount) : (totalForeignPayment += item.amount)
                        break
                    case 'REFUND':
                        item.currencyType === CURRENCY[0] ? (totalLocalRefund += item.amount) : (totalForeignRefund += item.amount)
                        break
                    case 'TRANSFER':
                        item.currencyType === CURRENCY[0] ? (totalLocalTransfer += item.amount) : (totalForeignTransfer += item.amount)
                        break
                }


                tableData.push({
                    receipt: <p id={'receipt_no'}>{item.receiptId !== null ? item.receiptId : '-'}</p>,
                    name: <div className='name-container'>
                        <Avatar className={'Tbl_avatar'} color={`light-${COLOR_STATUS[count]}`}
                                content={getFirstTwoLetter(item.studentName !== null ? item.studentName : 'N')}
                                initials/>
                        <div className='user-info  ms-1 item-name' id={'name-div'}>
                            <p className='d-block fw-bold'>{item.studentName !== '' ? item.studentName : 'N/A'}</p>
                            <span>{item.cbNumber}</span>
                        </div>
                    </div>,
                    type: item.transactionType === 'PAYMENT' ? <Badge color='light-primary'>Payment</Badge> :
                        item.transactionType === 'REFUND' ? <Badge color='light-warning'>Refund</Badge> :
                            item.transactionType === 'TRANSFER' ? <Badge color='light-info'>Transfer</Badge> : '-',
                    paymentType: item.paymentType !== null ? capitalize(item.paymentType.replaceAll('_', ' ').toLowerCase()) : 'N/A',
                    date: <p>{item.date === null ? 'N/A' : moment(item.date).format('DD/MM/YYYY')}</p>,
                    amount: <p
                        id={'amount'}>{item.totalAmountPaid !== null ? `${item.currencyType} ${commaNumber(Number(item.totalAmountPaid))}` : `-`}</p>,
                    action: <Button outline id={'receipt-btn'}
                                    color={item.receiptId === null ? 'secondary' : 'primary'}
                                    size={'sm'} disabled={item.receiptId === null}
                                    onClick={() => this.onReceiptAction(item.paymentPlanStructureId, item.invoiceId, item.transactionType)}>
                        <FileText id={'file-icon'}/><span>Receipt</span>
                    </Button>,
                    expandDate: item
                })
                count > 5 ? count = 0 : count += 1
            })
        }

        const ExpandableTable = ({data}) => {
            return (
                <div className='expandable-content p-2'>
                    <Row>
                        <Col lg={4}>
                            <p>
                                <span
                                    className='fw-bold'>Course: </span>{data.expandDate.courseName !== null ? data.expandDate.courseName : 'N/A'}
                            </p>
                        </Col>
                        <Col lg={4}>
                            <p>
                                <span
                                    className='fw-bold'>Batch: </span>{data.expandDate.batchCode !== null ? data.expandDate.batchCode : 'N/A'}
                            </p>
                        </Col>
                        <Col lg={4}>
                            <p>
                                <span
                                    className='fw-bold'>Contact: </span>{data.expandDate.studentNumber !== null ? data.expandDate.studentNumber : 'N/A'}
                            </p>
                        </Col>
                        <Col lg={4}>
                            <p>
                                <span
                                    className='fw-bold'>Email: </span>{data.expandDate.studentEmail !== null ? data.expandDate.studentEmail : 'N/A'}
                            </p>
                        </Col>
                        {data.expandDate.transactionType === 'PAYMENT' && <>
                            {/*<Col lg={4}>*/}
                            {/*    <p>*/}
                            {/*        <span className='fw-bold'>Payment Type: </span>{data.expandDate.paymentType !== null ? data.expandDate.paymentType : 'N/A'}*/}
                            {/*    </p>*/}
                            {/*</Col>*/}
                            <Col lg={4}>
                                <p>
                                    <span className='fw-bold'>Payment Method: </span>
                                    {
                                        (data.expandDate.paymentMethod === INVOICE_PAYMENT_METHOD[0].value || data.expandDate.paymentMethod === PAYMENT_METHOD[2].value) ? INVOICE_PAYMENT_METHOD[0].label :
                                            data.expandDate.paymentMethod === INVOICE_PAYMENT_METHOD[1].value ? INVOICE_PAYMENT_METHOD[1].label :
                                                data.expandDate.paymentMethod === INVOICE_PAYMENT_METHOD[2].value ? INVOICE_PAYMENT_METHOD[2].label :
                                                    (data.expandDate.paymentMethod === INVOICE_PAYMENT_METHOD[3].value) ? INVOICE_PAYMENT_METHOD[3].label :
                                                        data.expandDate.paymentMethod === INVOICE_PAYMENT_METHOD[4].value ? INVOICE_PAYMENT_METHOD[4].label :
                                                            data.expandDate.paymentMethod === INVOICE_PAYMENT_METHOD[5].value ? INVOICE_PAYMENT_METHOD[5].label :
                                                                data.expandDate.paymentMethod === INVOICE_PAYMENT_METHOD[6].value ? INVOICE_PAYMENT_METHOD[6].label :
                                                                    data.expandDate.paymentMethod === ALL_DAILY_TRANS_PAYMENT_METHOD[7].value ? ALL_DAILY_TRANS_PAYMENT_METHOD[7].label : 'N/A'
                                    }
                                    {
                                        data.expandDate.paymentMethod === PAYMENT_METHOD[2].value && data.expandDate.bankSlip !== null && data.expandDate.bankSlip !== '' &&
                                        <a target='_blank' href={data.expandDate.bankSlip}> View Slip</a>
                                    }
                                </p>
                            </Col>
                            <Col lg={4}>
                                <Button outline size='sm' color='secondary' onClick={() => this.viewStudent(data)}><User
                                    id={'user-icon'}/><span>Student Profile</span></Button>
                            </Col>
                            <Col lg={4}>
                                <p>
                                    <span
                                        className='fw-bold'>Deposit Date: </span>{data.expandDate.depositedDate !== null ? data.expandDate.depositedDate : 'N/A'}
                                </p>
                            </Col>
                            <Col lg={4}>
                                <p>
                                    <span
                                        className='fw-bold'>Fee Amount: </span>{data.expandDate.amount !== null ? `${data.expandDate.currencyType} ${commaNumber(Number(data.expandDate.amount))}` : 'N/A'}
                                </p>
                            </Col>
                        </>}
                    </Row>
                </div>
            )
        }

        return (
            <Fragment>
                <Card className={'fe-daily-transaction'}>
                    <CardBody>
                        <Row className={'statics-row'}>
                            <Col xs={4} className={'heading'}>
                                <Label>Daily Transactions</Label>
                            </Col>
                            <Col xs={8} style={{display: 'inline-flex'}}>
                                <div align={'right'} style={{marginRight: 0}}>
                                    <ExportMenu
                                        headers={DAILY_TRANSACTION_CSV_HEADER}
                                        filename={'daily_transactions_export'}
                                        data={this.state.exportList}
                                        onClick={this.exportAction}
                                        btnText={'Export'}
                                        outline
                                    />
                                </div>
                            </Col>
                        </Row>
                        {
                            this.state.showFilter &&
                            <Filter id={'filter-row'}
                                    list={[
                                        {
                                            type: FILTER_TYPES.input,
                                            name: 'receipt',
                                            label: 'Receipt Number ',
                                            placeholder: 'Search by Receipt Number',
                                            value: this.props.filter.receipt
                                        },
                                        {
                                            type: FILTER_TYPES.input,
                                            name: 'name',
                                            label: 'Student Name',
                                            placeholder: 'Search by Student Name',
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
                                            name: 'nic',
                                            label: 'NIC / Passport',
                                            placeholder: 'Search by NIC / Passport',
                                            value: this.props.filter.nic
                                        },
                                        {
                                            type: FILTER_TYPES.rangePicker,
                                            name: 'dateRange',
                                            label: 'Date Range',
                                            placeholder: 'From - To',
                                            value: this.props.filter && this.props.filter.dateRange ? this.props.filter.dateRange : this.state.dateRange
                                        },
                                        {
                                            type: FILTER_TYPES.dropDown,
                                            name: 'batch',
                                            label: 'Batch',
                                            placeholder: 'All',
                                            options: this.state.batchOption,
                                            value: this.props.filter.batch

                                        },
                                        {
                                            type: FILTER_TYPES.dropDown,
                                            name: 'course',
                                            label: 'Course',
                                            placeholder: 'All',
                                            options: this.state.courseOption,
                                            value: this.props.filter.course
                                        },
                                        {
                                            type: FILTER_TYPES.dropDown,
                                            name: 'type',
                                            label: 'Transaction Type',
                                            placeholder: 'All',
                                            options: tempAll.concat(PAYMENT_TYPE),
                                            value: this.props.filter.type
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
                            columns={DAILY_TRANSACTION_TABLE_COLUMN}
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
                            data={tableData}
                            expandableRows
                            expandOnRowClicked
                            expandableRowsComponent={ExpandableTable}
                        />
                    </div>
                </Card>
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(DailyTransaction)
