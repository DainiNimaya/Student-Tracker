import React, {Component} from "react"
import {CornerUpLeft, CreditCard, FileText, RefreshCw, Trello, DollarSign, Eye} from 'react-feather'
import {Button, Col, Input, Label, Row} from "reactstrap"
import moment from "moment"
import './scss/_studentProfile.scss'
import DataTable from "react-data-table-component"
import {PAYMENT_PLAN_TABLE_COLUMN_1, PAYMENT_PLAN_TABLE_COLUMN_2, TRANSACTION_TABLE_COLUMN} from './tableData'
import * as Api from '@api/haa'
import * as studentApi from '@api/student'
import * as feApi from '@api/fe'
import {capitalize, getLoggedUserData} from '@commonFunc'
import {DATE_FORMAT_TABLE, INVOICE_TYPE, DATE_FORMAT} from '@const'
import rs from '@routes'
import Cookies from "js-cookie"
import config from '@storage'
import {toast} from "react-toastify"
import PaymentSummary from "../payment-summary"
import {fee} from '@configs/studentMasterProfileConfig'
import PaymentPlanLevel from '@components/payment-plan-level'

const role = JSON.parse(Cookies.get(config.user)).role

class Fee extends Component {

    state = {
        data: null,
        paymentPlans: []
    }

    componentWillMount() {
        this.getFeeScheme()
    }

    getFeeScheme = async () => {
        const studentId = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const res = await Api.getFeeSchemeByStudentId(studentId)
        if (res) {
            await this.setState({data: res, paymentPlans: res.paymentsPlan})
        }
    }

    // onViewReceipt = (item) => {
    //     if (item.paymentReceipt) {
    //         window.open(item.paymentReceipt)
    //     } else {
    //         toast.warning("Receipt not available!", {icon: true, hideProgressBar: true})
    //     }
    // }

    onReceiptAction = async (receiptId, item, isTransaction) => {
        const result = await studentApi.getInvoiceDetail(receiptId, INVOICE_TYPE.student)

        if (result !== null) {
            const user = getLoggedUserData()
            result['collectedBy'] = `${user.firstName} ${user.lastName}`
            result['discoutnName'] = result.discountName
            result['taxPercentage'] = 0
            result['date'] = moment(result.date).format(DATE_FORMAT)

            this.props.props.props.history.push({
                pathname: rs.viewReceipt,
                state: {
                    data: result,
                    type: 'INVOICE',
                    status: isTransaction ? 'PAID' : item ? item.status : null,
                    invoiceType: INVOICE_TYPE.student,
                    paymentId: item.paymentPlanStructureId,
                    invoiceId: item.invoiceId
                }
            })
        }

        sessionStorage.setItem('FEE_PATH', 'true')
    }

    editAction = async (item) => {
        await sessionStorage.setItem('FEE_PATH', 'true')
        const studentDetails = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS'))

        let result = null
        if (item.invoiceId && item.invoiceId !== 0) {
            result = await feApi.getInvoiceDetail(item.invoiceId, INVOICE_TYPE.student)
        }
        const data = {studentDetails}
        const discount = null
        // data.discounts.map(itm => {
        //     if (itm.deductFrom === item.feeType) discount = itm
        // })
        const user = getLoggedUserData()

        const val = {
            itemFee: item.amount,
            itemName: item.description,
            amount: result ? result.itemFee : item.remainingAmount,
            lateFee: null,
            discoutnName: discount ? discount.discountName : null,
            discountPercentage: discount ? discount.discountPercentageLocal : null,
            taxPercentage: 0,
            courseName: data.studentDetails.courseName,
            refNo: '',
            remark: result ? result.remark : '',
            collectedBy: (result && result.collectedBy) ? result.collectedBy : `${user.firstName} ${user.lastName}`,
            paymentMethod: result ? result.paymentMethod : item.paymentMethod,
            date: result ? result.date : '',
            depositedDate: result ? result.depositedDate : '',
            chequeNo: result ? result.chequeNo : '',
            cardReceipt: result ? result.cardReceipt : '',
            collectedDate: result ? result.collectedDate : '',
            bankReceipt: result ? result.bankReceipt : '',
            bankDetail: result ? result.bankDetail : null,
            paymentMethodType: result ? result.paymentMethodType : null,
            student: {
                cbNumber: data.studentDetails.cbNumber,
                studentName: data.studentDetails.studentName,
                address: '',
                country: '',
                studentMobile: data.studentDetails.mobile,
                studentEmail: data.studentDetails.email
            }
        }

        this.props.props.props.history.push({
            pathname: rs.editReceipt,
            state: {
                data: val,
                paymentId: item.paymentPlanStructureId,
                invoiceId: null,
                type: 'RECEIPT',
                status: item.status,
                invoiceType: INVOICE_TYPE.student
            }
        })
    }

    render() {


        const isAllowEdit = this.props.props.edit
        const paymentDetails = this.state.data ? this.state.data.paymentDetails : null
        const paymentPlan = this.state.data ? this.state.data : null
        const paySummery = this.state.data ? this.state.data.paymentSummary : null
        const transactionHistory = this.state.data ? this.state.data.transactionHistory : []
        const currency = paymentDetails && paymentDetails.currencyType ? paymentDetails.currencyType : ''

        const transaction = []
        transactionHistory.map(item => {
            let status = 'Completed'
            if (item.paymentType === 'BANK') {
                status = item.status
            }


            transaction.push({
                invoice: item.invoiceId ? item.invoiceId : '-',
                description: item.description ? item.description : '-',
                transactionType: item.transactionType ? capitalize(item.transactionType.replaceAll('_', ' ').toLowerCase()) : '-',
                date: item.date ? moment(item.date).format(DATE_FORMAT_TABLE) : '-',
                amount: <div align={'right'}>{`${item.currencyType ? item.currencyType : item.currency} ${item.amount ? item.amount.toLocaleString() : '0'}`}</div>,
                actions: <Button size={'sm'} onClick={() => this.onReceiptAction(item.invoiceId, item, true)} outline
                                 color={'primary'}><Eye
                    size={15}/> Receipt</Button>,
                paymentType: item.paymentType ? item.paymentType : 'N/A',
                status: status ? capitalize(status.replaceAll('_', ' ').toLowerCase()) : 'N/A'
            })
        })

        return (
            <div className={'fee'}>
                <h4><CreditCard/>&nbsp; Payment Information</h4>

                <div className={'fee-container'}>

                    {
                        paymentPlan !== null ? <PaymentPlanLevel
                            data={paymentPlan}
                            props={this.props.props}
                            smp={true}
                            invoiceType={INVOICE_TYPE.student}
                            paySummary={paySummery}
                            multipleInvoice
                            studentId={JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId}
                        /> : <div align={'center'}
                                  style={{border: '1px solid #E6E6E6', borderRadius: 6, padding: '10px 0'}}>There
                            are no records to
                            display</div>
                    }
                    <div className={'hr'}/>
                    <div className={'transaction-container'}>
                        <h4><DollarSign/> Transaction History</h4>

                        <div className="react-dataTable table-container">
                            <DataTable
                                noHeader
                                data={transaction}
                                columns={TRANSACTION_TABLE_COLUMN}
                                className='react-dataTable'
                                pagination
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Fee
