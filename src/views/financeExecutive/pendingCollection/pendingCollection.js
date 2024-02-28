import React, {Fragment} from 'react'
import {Button, Card, CardBody, Col, Label, Row} from 'reactstrap'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar/avatar'
import {
    FILTER_TYPES,
    FILTERS,
    PENDING_COLLECTION_CSV_HEADER,
    APPROVE_PAYMENT_VIEW,
    CURRENCY,
    STUDENT_PROFILE_VIEW_TYPES
} from '@const'
import {Cpu, DollarSign, User} from 'react-feather'
import CustomPagination from "@components/customPagination"
import StatsHorizontal from '@components/widgets/stats/CustomizedStatsHorizontal'
import './scss/_pendingCollection.scss'
import Filter from "@components/filter"
import {PENDING_COLLECTION_TABLE_COLUMN} from './tableData'
import * as feApi from '@api/fe'
import commaNumber from "comma-number"
import ConfirmModal from './confirmBox'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import rs from '@routes'
import ExportMenu from '@components/export-menu'
import {pendingCollectionRequestUrl} from '@utils'
import {basicInfo} from '@configs/basicInfomationConfig'

class PendingCollection extends React.Component {

    csvLinkEl = React.createRef()
    state = {
        data: [],
        courseOption: [],
        batchOption: [],

        debit: 0,
        credit: 0,
        netAmt: 0,
        debitForeign: 0,
        creditForeign: 0,
        netAmtForeign: 0,
        collectionList: [],
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        offset: 0,
        numberOfElements: 0,
        exportList: [],
        confirmModal: false,
        paymentId: '',
        dateRange: [new Date().setMonth(new Date().getMonth() - 3), new Date()],
        showFilter: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                dateRange: [new Date().setMonth(new Date().getMonth() - 3), new Date()],
                route: rs.pendingCollection
            }))
        } else if (this.props.filter.route !== rs.pendingCollection) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                dateRange: [new Date().setMonth(new Date().getMonth() - 3), new Date()],
                route: rs.pendingCollection
            }))
        }
        this.setState({showFilter: true})
        await this.loadSelectionValues()
    }


    loadSelectionValues = async () => {
        const temp = [{label: 'All', value: null}]
        const courses = await feApi.getAllCourses()
        const batches = await feApi.getAllBatches()
        this.setState({
            courseOption: temp.concat(courses),
            batchOption: temp.concat(batches)
        })
        this.getTableData(this.state.currentPage)
    }


    handlePagination = async (val) => {
        await this.getTableData(val.selected)
        this.setState({
            currentPage: (val.selected)
        })
    }

    onFilterAction = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.pendingCollection}))
        this.setState({currentPage: 0})
        this.getTableData(0)
    }

    getTableData = async (page) => {
        const url = pendingCollectionRequestUrl(this.props.filter, page, 10, true)
        const collections = await feApi.getAllPendingCollection(url)

        this.setState({
            totalPages: collections.totalPages,
            totalElements: collections.totalElements,
            // offset: collections.offset,
            numberOfElements: collections.noOfElements,
            collectionList: collections.content,
            debit: `${CURRENCY[0]} ${commaNumber(Number(collections.debit).toFixed(2))}`,
            credit: `${CURRENCY[0]} ${commaNumber(Number(collections.credit).toFixed(2))}`,
            netAmt: `${CURRENCY[0]} ${commaNumber(Number(collections.credit - collections.debit).toFixed(2))}`,
            debitForeign: `${CURRENCY[1]} ${commaNumber(Number(collections.debitForeign).toFixed(2))}`,
            creditForeign: `${CURRENCY[1]} ${commaNumber(Number(collections.creditForeign).toFixed(2))}`,
            netAmtForeign: `${CURRENCY[1]} ${commaNumber(Number(collections.creditForeign - collections.debitForeign).toFixed(2))}`
        })
    }

    exportAction = async (type, size, page, isGetPages) => {
        const url = pendingCollectionRequestUrl(this.props.filter, page !== undefined ? page : this.state.currentPage, size ? size : 10, !isGetPages)
        const res = await feApi.getAllPendingCollection(url)
        if (res.content && res.content.length !== 0) {
            this.setState({exportList: res.content})
        }
        return res
    }

    confirmHandler = (id) => {
        this.setState({
            confirmModal: !this.state.confirmModal,
            paymentId: id
        })
    }

    navigateToView = (item) => {
        item['tab'] = '6'
        item['viewType'] = APPROVE_PAYMENT_VIEW.collectPayment
        this.props.history.push({pathname: rs.viewCollectPayment, state: item, type: 'INVOICE'})
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
            mobile: data.expandDate.studentMobile,
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
        let total = 0
        let lateFee = 0
        let foreignTotal = 0
        let foreignLateFee = 0

        if (this.state.collectionList.length !== 0) {
            this.state.collectionList.map((item, i) => {

                item.currencyType === CURRENCY[0] ? total += item.amount : foreignTotal += item.amount
                item.currencyType === CURRENCY[0] ? lateFee += item.lateFee : foreignLateFee += item.lateFee

                tableData.push({
                    name: <Avatar tableAvatar count={count} name={item.studentName !== null ? item.studentName : 'N/A'}
                                  code={item.cbNumber}/>,
                    duedate: <p id={'due-date'}>{item.dueDate !== null ? item.dueDate : 'N/A'}</p>,
                    amount: <p
                        id={'amount'}>{item.amount !== null ? `${item.currencyType} ${commaNumber(Number(item.amount))}` : 'N/A'}</p>,
                    lateFee: <p
                        id={'amount'}>{item.lateFee !== null ? `${item.currencyType} ${commaNumber(Number(item.lateFee))}` : 'N/A'}</p>,
                    action: <>
                        <Button className='me-1' outline color='danger' size={'sm'} disabled={item.paymentId === 0}
                                onClick={() => this.confirmHandler(item.paymentPlanStructureId)}><span>Remind</span></Button>
                    </>,
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
                            <Button outline size='sm' color='secondary' onClick={() => this.viewStudent(data)}><User
                                id={'user-icon'}/><span>Student Profile</span></Button>
                        </Col>
                        <Col lg={4}>
                            <p>
                                <span
                                    className='fw-bold'>Last Payment Date: </span>{data.expandDate.lastPaymentDate !== null ? data.expandDate.lastPaymentDate : 'N/A'}
                            </p>
                        </Col>
                        <Col lg={4}>
                            <p>
                                <span
                                    className='fw-bold'>Last Payment Amount: </span>{data.expandDate.lastPaymentAmount !== null ? `${data.expandDate.currencyType} ${data.expandDate.lastPaymentAmount}` : 'N/A'}
                            </p>
                        </Col>
                    </Row>
                </div>
            )
        }


        return (
            <Fragment>
                <Card className={'fe-pending-collection'}>
                    <CardBody>
                        <Row className={'statics-row'}>
                            <Col xs={4} className={'heading'}>
                                <Label>Pending Collections</Label>
                            </Col>
                            <Col xs={8} style={{display: 'inline-flex'}}>
                                <div align={'right'} style={{marginRight: 0}}>
                                    <ExportMenu
                                        headers={PENDING_COLLECTION_CSV_HEADER}
                                        filename={'pending_collection_export'}
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
                                            label: 'Due Date Range',
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
                                        }
                                    ]}
                                    onFilter={this.onFilterAction}
                            />
                        }
                    </CardBody>
                    <div className='react-dataTable'>
                        <DataTable
                            noHeader
                            pagination
                            columns={PENDING_COLLECTION_TABLE_COLUMN}
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
                {
                    this.state.confirmModal &&
                    <ConfirmModal isOpen={this.state.confirmModal} close={this.confirmHandler}
                                  id={this.state.paymentId}/>
                }
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(PendingCollection)
