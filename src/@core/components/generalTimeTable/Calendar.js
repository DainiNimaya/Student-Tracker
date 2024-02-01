import React from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, UncontrolledTooltip} from 'reactstrap'
import {FILTER_TYPES, FILTERS, UPCOMING_CLASSES_EXPORT_TEMPLATE_CSV_HEADER, WEEK_TYPES} from '@const'
import Filter from "@components/filter"
import {handleFilter} from '@store/filter'
import {connect} from "react-redux"
import rs from '@routes'
import * as Api from "@api/haa"
import * as ApiIt from "@api/itAdmin"
import {createUpcomingClassesDataObject, getCookieUserData, titleCase} from '@utils'
import DataTable from "react-data-table-component"
import {UPCOMING_CLASS_TABLE_COLUMN} from "./tableData"
import {CSVLink} from "react-csv"
import {Info, Upload} from "react-feather"
import {toast} from "react-toastify"
import Cookies from "js-cookie"
import config from '@storage'
import '../../../assets/scss/classWeeks.scss'
import ExportMenu from '@components/export-menu'
import CustomPagination from "@components/customPagination"

const all = {value: null, label: 'All'}

class App extends React.Component {

    csvLinkEl = React.createRef()

    state = {
        data: [],
        exportData: [],
        dateRange: null,
        batches: [],
        lectures: [],
        venues: [],
        schools: [],
        modules: [],
        role: Cookies.get(config.role),
        showFilter: false,
        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.generalTimeTable}))
        } else if (this.props.filter.route !== rs.generalTimeTable) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.generalTimeTable}))
        }
        this.setState({showFilter: true})
        await this.loadAllBatches()
        await this.loadAllModule()
        await this.loadAllVenues()
        await this.loadAllSchools()
        await this.loadAllLectures()
        await this.loadAllClasses()
    }

    loadAllBatches = async () => {
        const res = await Api.getAllBatchesForProgression()
        this.setState({batches: [all, ...res]})
    }

    loadAllModule = async () => {
        const res = await Api.getAllModulesForDropDown()
        this.setState({modules: [all, ...res]})
    }

    loadAllLectures = async () => {
        const res = await Api.getLecturers()
        this.setState({lectures: [all, ...res]})
    }

    loadAllSchools = async () => {
        const res = await ApiIt.getAllSchools()
        this.setState({schools: [all, ...res]})
    }

    loadAllVenues = async () => {
        const res = await Api.getAllVenues()
        this.setState({
            venues: res.map(item => {
                item['label'] = item.venueName
                item['value'] = item.venueId
                return item
            })
        })
    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.generalTimeTable}))
        await this.loadAllClasses()
    }

    loadAllClasses = async () => {
        const res = await Api.getAllUpcomingClasses(createUpcomingClassesDataObject(this.props.filter, getCookieUserData().userId, this.state, this.state.currentPage, 10, true))
        this.setState({
            data: res?.content?.map(item => {
                return {
                    ...item,
                    classTime: `${item.from.toString().substring(0, item.from.length - 3)} - ${item.to.toString().substring(0, item.to.length - 3)}`,
                    details: item.details.map((i, index) => {
                        return item.details.length === 1 || index === item.details.length - 1 ? `${i.batchCode}` : `${i.batchCode}, `
                    })
                }
            }),
            numberOfElements: res.numberOfElements,
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            offset: res.pageable.offset,
            pageSize: res.pageable.pageSize
        })
    }

    exportData = async (type, size, page, isGetPages) => {
        const res = await Api.getAllUpcomingClasses(createUpcomingClassesDataObject(this.props.filter, getCookieUserData().userId, this.state, (page !== undefined ? page : this.state.currentPage), (size ? size : 10), !isGetPages))
        if (res?.content?.length > 0) {
            await this.setState({exportData: res.content})
        }
        return res
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.loadAllClasses()
    }

    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state
        const {role} = this.state
        const tempData = []
        this.state.data.map((item, i) => {
            const type = item.availability
                ? item.classWeekType === WEEK_TYPES.class ? 'C'
                    : item.classWeekType === WEEK_TYPES.holiday ? 'H'
                        : item.classWeekType === WEEK_TYPES.study ? 'S'
                            : item.classWeekType === WEEK_TYPES.examWeek ? 'E'
                                : item.classWeekType === WEEK_TYPES.extraClass ? 'EC'
                                    : '' : 'N'

            tempData.push({
                ...item,
                weekType: <div>
                    <UncontrolledTooltip placement='right' target={`slot-tooltip${i}`}>
                        {item.availability ? titleCase(item.classWeekType) : 'Not Available'}
                    </UncontrolledTooltip>
                    {(type === 'C' || type === 'N' || type === 'H' || type === 'S' || type === 'E' || type === 'EC') &&
                        <span id={`slot-tooltip${i}`}
                              className={`dashboard-selector ${type === 'C' ? 'class-week'
                                  : type === 'N' ? 'not-available'
                                      : type === 'H' ? 'holiday-week'
                                          : type === 'S' ? 'study-leave-week'
                                              : type === 'E' ? 'exam-week'
                                                  : type === 'EC' ? 'extra-week'
                                                      : ''}`}>{type === 'EC' ? <Info size={12}/> : type}</span>}
                </div>
            })
        })

        const list = [
            {
                type: FILTER_TYPES.dropDown,
                name: 'module',
                label: "Module",
                placeholder: 'All',
                options: this.state.modules,
                value: this.props.filter.module
            },
            {
                type: FILTER_TYPES.dropDown,
                name: 'batch',
                label: "Batch",
                placeholder: 'All',
                options: this.state.batches,
                value: this.props.filter.batch
            }
        ]

        if (JSON.parse(Cookies.get(config.user)).role !== 'LECTURER') {
            list.push({
                type: FILTER_TYPES.dropDown,
                name: 'lecturer',
                label: "Lecturer",
                placeholder: 'All',
                options: this.state.lectures,
                value: this.props.filter.lecturer
            })
        }
        list.push({
            type: FILTER_TYPES.rangePicker,
            name: 'dateRange',
            label: 'Date Range',
            placeholder: 'From - To',
            value: (this.props.filter && this.props.filter.dateRange ? this.props.filter.dateRange : this.state.dateRange)
        })

        return <Card className='shadow-none border-0 mb-0 rounded-0'>
            {/*{*/}
            {/*(role === config.haaRole || role === config.maaRole || role === config.aaRole) ?*/}
            {/*<>*/}
            <CardHeader className='border-bottom'>
                <CardTitle tag='h4'>General Timetable</CardTitle>

                <div className='d-flex mt-md-0 mt-1'>
                    <ExportMenu
                        headers={UPCOMING_CLASSES_EXPORT_TEMPLATE_CSV_HEADER}
                        filename={'upcoming_classes_export'}
                        data={this.state.exportData}
                        onClick={this.exportData}
                        btnText={'Export'}
                        outline
                    />
                </div>
            </CardHeader>
            <CardBody>
                {
                    this.state.showFilter &&
                    <Filter
                        list={list}
                        onFilter={this.onFilterHandler}
                    />
                }
                <div className='react-dataTable mt-3'>
                    <DataTable
                        noHeader
                        data={tempData}
                        columns={UPCOMING_CLASS_TABLE_COLUMN}
                        className='react-dataTable'
                        pagination
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
            </CardBody>
            {/*</> : <Calendar week={true} onlyClass={true}/>*/}

            {/*}*/}
        </Card>
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(App)
