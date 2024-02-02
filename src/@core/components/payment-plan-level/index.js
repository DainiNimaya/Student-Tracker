import React, {Component} from "react"
import {CornerUpLeft, CreditCard, FileText, RefreshCw, Trello, ChevronDown, ChevronRight, RotateCcw} from 'react-feather'
import {Badge, Button, Col, Collapse, Input, Label, Row} from "reactstrap"
import moment from "moment"
import './scss/_style.scss'
import DataTable from "react-data-table-component"
import {PAYMENT_PLAN_TABLE_COLUMN_1, PAYMENT_PLAN_TABLE_COLUMN_2, TRANSACTION_TABLE_COLUMN} from './tableData'
import * as Api from '@api/haa'
import * as studentApi from '@api/student'
import * as feApi from '@api/fe'
import {capitalize, getLoggedUserData} from '@commonFunc'
import {DATE_FORMAT_TABLE, INVOICE_TYPE, DATE_FORMAT, LEVEL_EXPAND_TYPE} from '@const'
import rs from '@routes'
import Cookies from "js-cookie"
import config from '@storage'
import {toast} from "react-toastify"
import PaymentSummary from "../payment-summary"
import {fee} from '@configs/studentMasterProfileConfig'
import {basicInfo} from '@configs/basicInfomationConfig'
import LevelExpand from '@components/commonLevelExpand'
import SideBar from "./paymentExtension"
import {loadStudentPaymentPlanCourseWise, checkCurrencyType} from '@utils'
import cloneDeep from "lodash/cloneDeep"

const EXTENSION_ACCESS_LIST = ['HEAD_OF_FINANCE', 'FINANCE_MANAGER', 'FINANCE_EXECUTIVE']
let role = null

class PaymentPlanLevel extends Component {

    state = {
        data: null,
        paymentPlans: [],
        levelList: [],
        collapseType: '',
        selectedLevel: 0,
        selectedCourse: 0,
        sidebar: false,
        currentLevelIndex: 0,
        allowMultipleInvoice:false,
        activeCourseId:0
    }

    async componentWillMount() {
        role = JSON.parse(Cookies.get(config.user)).role
        const tempData = this.props.data


        // this was added to get data in refund in collect payment ui (to avoid calling same API twice)
        let result = null
        if (this.props.studentId) {
            // here inquiryId has kept empty to handle a error in enrollment req ui
            result = await loadStudentPaymentPlanCourseWise({studentId:this.props.studentId,inquiryId:''})
        } else if (this.props.inquiryId) {
            result = await loadStudentPaymentPlanCourseWise({studentId:0,inquiryId:this.props.inquiryId})
        } else {
            result = this.props.data
        }


        if (this.props.smp || this.props.student) tempData['studentDetails'] = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS'))
        this.setState({
            data: (this.props.smp || this.props.student) ? tempData : this.props.props.props.data,
            paymentPlans: result ? result.paymentPlans : [],
            selectedLevel: result ? result.selectedLevel : 0,
            selectedCourse: result ? result.selectedCourse : 0,
            activeCourseId: result ? result.selectedCourse : 0
        })
    }

    onViewReceipt = (item) => {
        if (item.paymentReceipt) {
            window.open(item.paymentReceipt)
        } else {
            toast.warning("Receipt not available!", {icon: true, hideProgressBar: true})
        }
    }

    onReceiptAction = async (receiptId, item, isTransaction) => {
        const result = await studentApi.getInvoiceDetail(receiptId, this.props.invoiceType)

        if (result !== null) {
            const user = getLoggedUserData()
            result['discountName'] = result.discountName
            result['taxPercentage'] = 0
            result['date'] = moment(result.date).format(DATE_FORMAT)
            result['student'] = {
                cbNumber: this.state.data.studentDetails.cbNumber,
                studentName: this.state.data.studentDetails.studentName,
                studentMobile: this.state.data.studentDetails.mobile,
                studentEmail: this.state.data.studentDetails.email
            }

            if (item.status === 'REFUNDED') result['refundData'] = [item]

            const history = this.props.props.history ? this.props.props.history : this.props.props.props.history
            history.push({
                pathname: rs.viewReceipt,
                state: {
                    data: result,
                    type: 'INVOICE',
                    status: isTransaction ? 'PAID' : item ? item.status : null,
                    invoiceType: INVOICE_TYPE.student,
                    paymentId: item.paymentPlanStructureId ? item.paymentPlanStructureId : item.paymentPlanId,
                    invoiceId: item.invoiceId
                }
            })
        }

        sessionStorage.setItem('FEE_PATH', 'true')
    }

    editAction = async (item) => {
        const detail = this.state.data
        const studentDetail = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS'))
        if (this.props.smp || this.props.student) {
            await sessionStorage.setItem('FEE_PATH', 'true')
            detail['studentDetails'] = studentDetail
        }

        let result = null
        if (item.invoiceId && item.invoiceId !== 0) {
            result = await feApi.getInvoiceDetail(item.invoiceId, this.props.invoiceType)
        }

        let discount = null
        detail.discounts && detail.discounts.map(itm => {
            if (itm.deductFrom === item.feeType) discount = itm
        })

        const user = getLoggedUserData()

        const val = {
            itemFee: item.amount,
            itemName: result ? result.itemName : item.feeType,
            amount: result ? result.itemFee : item.remainingAmount,
            lateFee: null,
            discoutnName: discount ? discount.discountName : null,
            discountPercentage: discount ? discount.discountPercentageLocal : null,
            taxPercentage: 0,
            courseName: detail.studentDetails.courseName,
            courseId: this.props.props.props.data?.studentDetails?.courseId ? this.props.props.props.data.studentDetails.courseId : studentDetail.courseId,
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
                cbNumber: this.state.data.studentDetails.cbNumber,
                studentName: this.state.data.studentDetails.studentName,
                studentMobile: this.state.data.studentDetails.mobile,
                studentEmail: this.state.data.studentDetails.email,
                studentId: this.state.data.studentDetails.studentId
            }
        }

        this.props.props.props.history.push({
            pathname: rs.editReceipt,
            state: {
                data: val,
                paymentId: item.paymentPlanStructureId ? item.paymentPlanStructureId : item.paymentPlanId,
                invoiceId: result && result.invoiceId !== null ? result.invoiceId : null,
                type: 'RECEIPT',
                status: item.status,
                invoiceType: this.props.invoiceType,
                // is comming from enrollment request ui or collect payment ui
                viewType: this.props.type
            }
        })
    }

    selectPayment = (type, levelId, planId, val, courseId) => {

        this.state.paymentPlans.map(course => {
            if (course.courseId === courseId) {
                course.paymentPlan.map(item => {
                    if (item.levelId === levelId) {
                        item.paymentPlan.map(plan => {
                            if (plan.paymentPlanStructureId === planId) {
                                plan.checked = val
                            }
                        })
                    }
                })
            }
        })
        this.forceUpdate()

        // const row = [...this.state.paymentPlans]
        // const level = [...this.state.levelList]

        // if (type === 'all') {
        //     level.map(item => {
        //         item.isSelected = val
        //     })
        //     row.map(lvl => {
        //         lvl.isSelected = val
        //         lvl.paymentPlan.map(pp => {
        //             pp.checked = val
        //         })
        //     })
        // } else {
        //     row[levelId].isSelected = true
        //     row[levelId].paymentPlan[planId].checked = val
        // }
        // this.setState({paymentPlans: row, levelList: level})

        // console.log(row)
    }

    viewInvoice = async () => {
        if (this.props.smp || this.props.student) await sessionStorage.setItem('FEE_PATH', 'true')

        const items = cloneDeep(this.state.paymentPlans)

        const plansWithCourses = []
        items.map(item => {
            const tempData = []
            item.paymentPlan.map(levelPlan => {
                let plansWithLevels = null
                const pp = []
                levelPlan.paymentPlan.map(plan => {
                    if (plan.checked) {
                        pp.push({
                            ...plan,
                            itemName: plan.feeType,
                            itemFee: plan.amount,
                            paymentPlanId: plan.paymentPlanStructureId ? plan.paymentPlanStructureId : plan.paymentPlanId
                        })
                    }
                })
                plansWithLevels = {
                    levelId: levelPlan.levelId,
                    levelName: levelPlan.levelName,
                    paymentPlan: pp,
                    paymentSummary:levelPlan.paymentSummary
                }

                if (plansWithLevels.paymentPlan.length !== 0) {
                    tempData.push(plansWithLevels)
                }

            })

            plansWithCourses.push({
                courseId: item.courseId,
                courseName: item.courseName,
                paymentPlanLevelWise: tempData
            })
        })

        const studentDetails = (this.props.smp || this.props.student) ? JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')) : this.state.data.studentDetails
        const data = {
            student: studentDetails,
            courseName: studentDetails.courseName ? studentDetails.courseName : studentDetails.course.courseName,
            invoiceId: null,
            refNo: null,
            items: plansWithCourses
        }

        this.props.props.props.history.push({
            pathname: rs.multiInvoice,
            state: {
                data,
                invoiceType: this.props.invoiceType
            }
        })
    }


    render() {
        const isCourseTransferUI = window.location.pathname === rs.courseTransferInvoice
        const isDropUI = window.location.pathname === rs.viewDrop
        const isAllowEdit = this.props.props.edit
        let currency = ''

        let isDiscount = false
        let isRegFeePaid = false
        const payment = []
        let levelPaySummary = null


        this.state.paymentPlans.map((course) => {
            if (course.courseId === this.state.selectedCourse) {
                course.paymentPlan.map((plan, id) => {
                    if (plan.levelId === this.state.selectedLevel) {
                        currency = checkCurrencyType(plan.paymentPlan)
                        plan.paymentPlan.map((item, i) => {
                            let tempFeeType = item.feetype ? item.feetype : item.feeType
                            let desc = item.feeDescription ? item.feeDescription : item.description
                            if (tempFeeType === 'REGISTRATION_FEE' && item.status === 'PAID') isRegFeePaid = true
                            if (tempFeeType === 'REPEAT_FEE') {
                                const codeStartIndex = desc.indexOf(desc.split(' ')[2])
                                tempFeeType = `Repeat fee - ${desc.split(' ')[0]}`
                                desc = desc.substring(codeStartIndex)
                            }
                            // if (item.status === 'PAID') isPaidItems = true
                            if (item.discount && item.discount !== 0) isDiscount = true

                            const isActiveCourse = course.courseId === this.state.activeCourseId

                            const rowData = {
                                feeDescription: <Input readOnly value={desc}/>,
                                feeType: <Input readOnly
                                                value={tempFeeType ? capitalize(tempFeeType.replaceAll('_', ' ').toLowerCase()) : 'N/A'}/>,
                                dueDate: <Input readOnly
                                                value={item.dueDate ? moment(item.dueDate).format(DATE_FORMAT_TABLE) : '-'}/>,
                                amount: <Input
                                    style={item.amount < 0 ? {color: '#00CFE8', textAlign: 'right'} : {
                                        color: '',
                                        textAlign: 'right'
                                    }}
                                    readOnly
                                    value={`${item.amount.toLocaleString()}`}/>,
                                receipt: <>{(item.status === 'PAID' && item.paymentReceipt) &&
                                <FileText style={{cursor: 'pointer'}}
                                          onClick={() => this.onViewReceipt(item)}
                                          className={'icn-file'}/>}</>,
                                payment: <Input style={{textAlign: 'right'}} readOnly
                                                value={item.payment ? `${item.payment.toLocaleString()}` : '0'}/>,
                                duePayment: <Input style={{textAlign: 'right'}} readOnly
                                                   value={item.lateFee ? item.lateFee.toLocaleString() : 0}/>,
                                discount: <Input style={{textAlign: 'right'}} readOnly
                                                 value={item.discount}/>,
                                tax: <Input style={{textAlign: 'right'}} readOnly
                                            value={`${item.taxAmount}`}/>,
                                payable: <Input style={{textAlign: 'right'}} readOnly
                                                value={`${item.amountPayable}`}/>,
                                action: <>
                                    {/*pay btn was hide as request by chamidi*/}
                                    {!isCourseTransferUI && !isDropUI && <>
                                        {item.status === 'PAID' ?
                                            <Button disabled outline color={'primary'}><Trello
                                                size={15}/> Paid&nbsp;</Button> :
                                            item.status === 'REFUNDED' ?
                                                <Button disabled outline color={'primary'}><Trello
                                                    size={15}/> Refunded</Button> :
                                                <Button
                                                    disabled={(this.props.smp ? !(isAllowEdit && this.checkAccessLevel(fee.collectPayment) && isActiveCourse) :
                                                        tempFeeType === 'REGISTRATION_FEE' ? false : !(isRegFeePaid && isActiveCourse))}
                                                    onClick={() => this.editAction(item)} outline color={'primary'}><Trello
                                                    size={15}/> Pay&nbsp;&nbsp;&nbsp;</Button>
                                        }
                                    </>
                                    }
                                    {
                                        this.state.data && this.state.data.studentDetails && this.state.data.studentDetails.cbNumber && <>
                                            {(item.status === 'PAID' || item.status === 'REFUNDED') ?
                                                <Button
                                                    onClick={() => this.onReceiptAction(item.invoiceId, item)}
                                                    outline
                                                    className={'btn-tbl-action'}
                                                    color={'primary'}><FileText
                                                    size={15}/> Receipt</Button> :
                                                <Button disabled outline className={'btn-tbl-action'} color={'secondary'}>
                                                    <FileText size={15}/> Receipt
                                                </Button>
                                            }
                                        </>
                                    }
                                </>,
                                status: <Badge style={{marginLeft: 10}}
                                               color={item.status === 'PAID' || item.status === 'DEDUCTED' ? 'light-success' : item.status === 'PENDING' ? 'light-warning' : 'light-info'}>{item.status ? capitalize(item.status.replaceAll('_', ' ').toLowerCase()) : 'N/A'}</Badge>
                            }

                            if (this.props.multipleInvoice) rowData.selectAll = <Input type={'checkbox'}
                                                                                       checked={item.checked}
                                // disabled={item.status !== 'PAID'}
                                                                                       onClick={(e) => this.selectPayment('single', plan.levelId, item.paymentPlanStructureId, e.target.checked,course.courseId)}
                            />
                            payment.push(rowData)
                        })
                        levelPaySummary = plan.paymentSummary
                    }
                })
            }
        })

        const paymentPlanDiv = <>
            <div className="react-dataTable">
                <DataTable
                    noHeader
                    data={payment}
                    columns={PAYMENT_PLAN_TABLE_COLUMN_1(currency)}
                    className='react-dataTable'
                />
            </div>
        </>

        return (
            <div className={'fee'}>

                <div className={'fee-pp-container'} style={this.props.smp ? {margin: '20px'} : {margin: 0}}>

                    <Row>
                        {
                            (!this.props.smp && !this.props.student && this.props.data.length !== 0) &&
                            <div className={'payment-tbl-header mt-3 mb-1'}>
                                <Label className={'lbl-header'}><CreditCard/> Payment Plan</Label>
                            </div>
                        }
                    </Row>
                    <div>{paymentPlanDiv}</div>

                </div>
            </div>
        )
    }
}

export default PaymentPlanLevel
