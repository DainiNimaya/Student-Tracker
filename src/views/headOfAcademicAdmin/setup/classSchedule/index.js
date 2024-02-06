import React, {Component, Fragment, useEffect, useState} from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    Button,
    Row, Col, Label, Input, FormGroup, CardBody,
    UncontrolledTooltip, Badge
} from "reactstrap"
import {ChevronDown, Plus} from "react-feather"
import {STUDY_MODES, FILTER_TYPES, FILTERS} from '@const'
import * as Api from "@api/haa_"
import * as ApiC from "@api/counselor_"
import DataTable from "react-data-table-component"
import CustomPagination from "@components/customPagination"
import Filter from "@components/filter"
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import rs from '@routes'
import {getClassesUrl} from "@utils"
import {allClassesExpandableTable, columns_TableAllClasses} from "./tableData"

const all = {value: undefined, label: 'All'}

class App extends React.Component {

    state = {
        modules: [],
        batches: [],
        classCodes: [],
        courses: [],
        data: [],
        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0,
        showFilter: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.classSchedule}))
        } else if (this.props.filter.route !== rs.classSchedule) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.classSchedule}))
        }

        this.setState({ showFilter:true })
        let res = await ApiC.getAllCourses()
        const courses = res.map(item => {
            return {value: item.courseId, label: item.courseName}
        })

        res = await Api.getAllBatches()
        const batches = res.content.map(item => {
            return {label: item.batchCode, value: item.batchId}
        })

        res = await Api.getAllClassCodes()
        const classCodes = res.map(item => {
            return {label: item.classCode, value: item.classCode}
        })

        res = await Api.getAllModules()
        const modules = res.content.map(item => {
            return {label: item.moduleName, value: item.moduleId}
        })

        await this.setState({
            courses,
            batches,
            classCodes,
            modules
        })
        await this.loadAllClasses()
    }

    onFilterHandler = async (data) => {
        await this.setState({currentPage: 0})
        await this.props.dispatch(handleFilter({...data, route: rs.classSchedule}))
        await this.loadAllClasses()
    }

    loadAllClasses = async () => {
        const url = getClassesUrl(this.props.filter, this.state.currentPage)
        const res = await Api.getAllClasses(url)
        if (res) {
            let count = 0
            this.setState({
                data: res.content.map((item, index) => {
                    const d = {
                        ...item,
                        count,
                        index
                    }
                    count > 6 ? count = 0 : count += 1
                    return d
                }),
                numberOfElements: res.numberOfElements,
                totalElements: res.totalElements,
                totalPages: res.totalPages,
                offset: res.pageable.offset,
                pageSize: res.pageable.pageSize
            })
        }
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.loadAllClasses()
    }

    onViewClass = (item) => {
        item['startDate'] = item.from
        item['endDate'] = item.to
        this.props.history.push({pathname: rs.classScheduleViewer, state: item})
    }

    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state

        return <div>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Class Schedules</CardTitle>
                </CardHeader>
                <CardBody>
                    {
                        this.state.showFilter &&
                        <Filter
                            list={[
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'module',
                                    label: "Module",
                                    placeholder: 'All',
                                    options: [all, ...this.state.modules],
                                    value: this.props.filter.module
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'course',
                                    label: "Course",
                                    placeholder: 'All',
                                    options: [all, ...this.state.courses],
                                    value: this.props.filter.course
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'batch',
                                    label: "Batch",
                                    placeholder: 'All',
                                    options: [all, ...this.state.batches],
                                    value: this.props.filter.batch
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'classCode',
                                    label: "Class Code",
                                    placeholder: 'All',
                                    options: [all, ...this.state.classCodes],
                                    value: this.props.filter.classCode
                                }
                            ]}
                            onFilter={this.onFilterHandler}
                        />
                    }
                    <div className='react-dataTable mt-3'>
                        <DataTable
                            noHeader
                            pagination
                            data={this.state.data}
                            expandableRows
                            columns={columns_TableAllClasses(this.onViewClass)}
                            expandOnRowClicked
                            className='react-dataTable'
                            sortIcon={<ChevronDown size={10}/>}
                            expandableRowsComponent={allClassesExpandableTable}
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
            </Card>
        </div>
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(App)
