import React, {Fragment} from 'react'
import {Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Row, UncontrolledTooltip} from 'reactstrap'
import {FEE_SCHEME_TABLE_COLUMN} from './tableData'
import './scss/_fee-scheme.scss'
import DataTable from 'react-data-table-component'
import {Eye, Plus} from 'react-feather'
import CustomPagination from "@components/customPagination"
import AddScheme from './addFeeScheme'
import rs from '@routes'
import * as Api from "@api/counsellor"
import * as ApiHof from "@api/hof"
import moment from "moment"
import {DATE_FORMAT_TABLE, FEE_SCHEME_STATUS, FILTER_TYPES, FILTERS, TABLE_STATUS} from '@const'
import {capitalize, tableCoursesFormat} from "@commonFunc"
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import Filter from "@components/filter"

class Index extends React.Component {

    state = {
        courses: [],
        intakes: [],
        levels: [],
        data: [],
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        offset: 0,
        numberOfElements: 0,
        viewModal: false,
        addModal: false,
        showFilter: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route:rs.feeSchemes}))
        } else if (this.props.filter.route !== rs.bankTransfer) {
            await this.props.dispatch(handleFilter({...FILTERS, route:rs.feeSchemes}))
        }
        this.setState({ showFilter:true })
        await this.loadAllSchemes()
        // await this.loadAllCourses()
        await this.loadAllIntakes()
        await this.loadAllLevels()
    }

    bodyData = () => {
        const filter = this.props.filter
        return {
            schemeCode: filter.feeNo ? filter.feeNo.trim() : null,
            schemeName: filter.feeName ? filter.feeName.trim() : null,
            // courseId: filter.course ? filter.course.value : null,
            intakeId: filter.intake ? filter.intake.value : null,
            status: filter.status ? filter.status.value : null,
            levelId: filter.level ? filter.level.value : null
        }
    }

    loadAllSchemes = async () => {
        const data = {body: this.bodyData(), index: this.state.currentPage, size: 10}
        const res = await ApiHof.getAllFeeSchemes(data)
        this.setState({
            data: res.content,
            numberOfElements: res.numberOfElements,
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            offset: res.pageable.offset,
            pageSize: res.pageable.pageSize
        })
    }

    loadAllIntakes = async () => {
        const res = await Api.getAllIntakes()
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.intakeId, label: item.intakeCode})
        })
        await this.setState({intakes: data})
    }

    loadAllCourses = async () => {
        const res = await Api.getAllCourses()
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.courseId, label: item.courseName})
        })
        this.setState({courses: data})
    }

    loadAllLevels = async () => {
        const res = await ApiHof.getLevel()
        const data = [{value: null, label: 'All'}]
        await this.setState({levels: data.concat(res)})
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.loadAllSchemes()
    }

    onFilterHandler = async (data) => {
        await this.setState({ currentPage: 0})
        await this.props.dispatch(handleFilter({...data, route: rs.feeSchemes}))
        await this.loadAllSchemes()
    }

    viewDetails = (data) => {
        this.props.onViewClick(this.props.props, data)
    }

    addScheme = () => {
        this.props.history.push(rs.addFeeSchemes)
    }

    render() {

        const {currentPage, totalElements, totalPages, offset, numberOfElements} = this.state
        const tableData = []

        const ExpandableTable = ({data}) => {
            return (
                <div className='expandable-content p-2'>
                    <Row>
                        <Col lg={4}>
                            <p>
                                <span className='fw-bold'>Number of Payment Plan : </span>{data.plans}
                            </p>
                        </Col>
                        <Col lg={4}>
                            <p>
                                <span className='fw-bold'>Assigned Courses : </span> Biology and Chemical Science
                            </p>
                        </Col>
                        <Col lg={4}>
                            <p>
                                <span className='fw-bold'>Assigned Intakes : </span> {data.intake}
                            </p>
                        </Col>

                        <Col lg={8}>
                            <p>
                                <span className='fw-bold'>Description : </span> {data.desc}
                            </p>
                        </Col>
                    </Row>
                </div>
            )
        }

        if (this.state.data.length !== 0) {
            this.state.data.map((item, i) => {

                let levelName = ''
                const test = []
                if (item.levelDTOS.length !== 0) {
                    item.levelDTOS.map(level => {
                        if (!test.includes(level.levelId)) {
                            test.push(level.levelId)
                            levelName += `,${level.levelName}`
                        }
                    })
                }

                tableData.push({
                    // code: <p id={'code'}>{item.schemeCode}</p>,
                    name: <div className={'scheme-container'}>
                        <span>{item.schemeName}</span>
                        <span id={'code'}>{item.schemeCode}</span>
                    </div>,
                    level: item.levelDTOS.length !== 0 ? <>
                        <div id={`positionTop${i}`} className={'tbl-data'}>{levelName.substring(1)}</div>
                        <UncontrolledTooltip placement='bottom' target={`positionTop${i}`}>
                            {levelName.substring(1)}
                        </UncontrolledTooltip>
                    </> : 'N/A',
                    date: <p>{item.createdDate ? moment(item.createdDate).format(DATE_FORMAT_TABLE) : '-'}</p>,
                    action: <Button className={'top-custom-btn'} color='primary' outline
                                    onClick={() => this.viewDetails(item)}>
                        <Eye size={15}/>
                        <span className='m-md-1 align-middle ml-50'>View</span>
                    </Button>,
                    status: <Badge
                        color={`light-${item.status === TABLE_STATUS[0] ? 'primary' : 'danger'}`}>{capitalize(item.status.replaceAll('_', ' ').toLowerCase())}</Badge>,
                    plans: item.numberOfPaymentPlan ? item.numberOfPaymentPlan : 'N/A',
                    awardingBody: item.awardingBody ? item.awardingBody : '-',
                    // course: item.assignedCourses ? tableCoursesFormat(item.assignedCourses) : 'N/A',
                    // batch: item.assignedBatches ? tableCoursesFormat(item.assignedBatches) : 'N/A',
                    desc: item.description ? item.description : 'N/A',
                    intake: item.assignedIntake ? item.assignedIntake : 'N/A'
                })

            })
        }

        return (
            <Fragment>
                {
                    this.state.addModal ? <AddScheme/> : <Card className={'hof-fee-scheme'}>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4' className={'heading-feeScheme'}>Fee Schemes</CardTitle>
                            <Button color='primary' size={'sm'} onClick={() => this.addScheme()}><Plus
                                id={'plus-icon'}/> Add Fee Scheme</Button>
                        </CardHeader>
                        <CardBody>
                            {
                                this.state.showFilter &&
                                <Filter
                                    list={[
                                        {
                                            type: FILTER_TYPES.input,
                                            name: 'feeName',
                                            label: 'Scheme Name / Code',
                                            placeholder: 'Search by Scheme Name / Code',
                                            value: this.props.filter.feeName
                                        },
                                        {
                                            type: FILTER_TYPES.dropDown,
                                            name: 'course',
                                            label: "Programme",
                                            placeholder: 'All',
                                            options: this.state.courses,
                                            value: this.props.filter.course
                                        },
                                        {
                                            type: FILTER_TYPES.dropDown,
                                            name: 'course',
                                            label: 'Course',
                                            placeholder: 'All',
                                            options: this.state.courses,
                                            value: this.props.filter.course
                                        },
                                        {
                                            type: FILTER_TYPES.dropDown,
                                            name: 'intake',
                                            label: 'Intake',
                                            placeholder: 'All',
                                            options: this.state.intakes,
                                            value: this.props.filter.intake
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
                                // selectedRows = {tableData.slice(0,1)}
                                columns={FEE_SCHEME_TABLE_COLUMN}
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
                }

            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(Index)
