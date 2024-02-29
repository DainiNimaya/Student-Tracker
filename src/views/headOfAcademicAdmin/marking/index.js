import React, {useEffect, useRef, useState} from 'react'
import {Row, Col, Card, CardBody, CardTitle, CardHeader, Button, Label, Input, UncontrolledTooltip} from 'reactstrap'
import DataTable from "react-data-table-component"
import './scss/_style.scss'
import {MARKINGS_TABLE_COLUMN} from "./tableData"
import CustomPagination from "@components/customPagination"
import {Plus, Eye, Upload, X} from 'react-feather'
import Avatar from '@components/avatar/avatar'
import * as apiHaa from "@api/haa_"
import {MARKINGS_CSV_HEADER, FILTER_TYPES, FILTERS} from '@const'
import {getFirstTwoLetter} from '@utils'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import Filter from "@components/filter"
import rs from '@routes'


class Markings extends React.Component {

    csvLinkEl = React.createRef()
    state = {
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        offset: 0,
        numberOfElements: 0,
        markingsList: [],
        exportList: [],
        levelList: [],
        courseList: [],
        semesterList: [],
        moduleList: [],
        batchList: [],
        showFilter: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.allStudentMarking}))
        } else if (this.props.filter.route !== rs.allStudentMarking) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.allStudentMarking}))
        }
        this.setState({showFilter: true})
        await this.loadSelectionData()
        await this.getTableData(0)
    }

    loadSelectionData = async () => {

        let res = await apiHaa.getAllBatches()
        const batches = res

        res = await apiHaa.getAllModulesForDropDown()
        const modules = res

        res = await apiHaa.getAllCourses()
        const courses = res.map(item => {
            return {label: item.courseName, value: item.courseId}
        })

        this.setState({
            courseList: courses,
            moduleList: modules,
            batchList: batches
        })
    }


    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.allStudentMarking}))
        await this.setState({currentPage: 0})
        this.getTableData(0)
    }

    getTableData = async (page) => {
        const markingList = await apiHaa.getMarkingList(this.props.filter, page, 10, true)
        if (markingList !== null) {
            this.setState({
                markingsList: markingList.content,
                currentPage: page,
                totalPages: markingList.totalPages,
                totalElements: markingList.totalElements,
                offset: markingList.pageable.offset,
                numberOfElements: markingList.numberOfElements
            })
        }
    }

    handlePagination = async (val) => {
        this.getTableData(val.selected)
    }


    render() {

        const defaultAll = [{label: 'All', value: null}]
        const {
            markingsList, exportList, batchList, moduleList, levelList, semesterList, courseList, currentPage,
            totalElements, totalPages, numberOfElements, offset
        } = this.state
        const tableBody = []
        let count = 0

        if (markingsList.length !== 0) {
            markingsList.map((item,i) => {
                let tempSem = ''
                if (item.semesterName.length !== 0) {
                    item.semesterName.map(sem => {
                        tempSem += `/${sem}`
                    })
                }
                item['tempSemester'] = tempSem.substring(1)
                tableBody.push({
                    batch: item.batchName ? item.batchName : 'N/A',
                    module: <Avatar count={count} name={item.moduleName ? item.moduleName : 'N/A'}
                                    code={item.moduleCode}/>,
                    course: <Avatar name={item.courseName ? item.courseName : 'N/A'} code={item.courseCode}
                                    noAvatar={true}/>,
                    level: item.levelName ? item.levelName : 'N/A',
                    semester: item.semesterName.length !== 0 ? <>
                        <div id={`positionTop${i}`} className={'tbl-data'}>{tempSem.substring(1)}</div>
                        <UncontrolledTooltip placement='bottom' target={`positionTop${i}`}>
                            {tempSem.substring(1)}
                        </UncontrolledTooltip>
                    </> : 'N/A',
                    action: <Button color='primary' outline size='sm'
                                    onClick={() => this.props.history.push({
                                        pathname: rs.studentsMarking,
                                        state: item
                                    })}>
                        <Eye size={13}/> View</Button>
                })
                count > 5 ? count = 0 : count += 1
            })
        }

        return (
            <Card className={'haa-students-marking'} style={{height: '100%'}}>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                    <CardTitle tag='h4'>Markings</CardTitle>
                </CardHeader>
                <CardBody>
                    {
                        this.state.showFilter &&
                        <Filter
                            list={[
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'batch',
                                    label: 'Batch',
                                    placeholder: 'All',
                                    options: defaultAll.concat(batchList),
                                    value: this.props.filter.batch
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'module',
                                    label: 'Module',
                                    placeholder: 'All',
                                    options: defaultAll.concat(moduleList),
                                    value: this.props.filter.module
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'course',
                                    label: ' Course',
                                    placeholder: 'All',
                                    options: defaultAll.concat(courseList),
                                    value: this.props.filter.course
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
                        columns={MARKINGS_TABLE_COLUMN}
                        paginationPerPage={40}
                        className='react-dataTable'
                        paginationDefaultPage={currentPage + 1}
                        paginationComponent={() => CustomPagination({
                            currentPage,
                            numberOfElements,
                            totalElements,
                            totalPages,
                            offset,
                            handlePagination: page => this.handlePagination(page)
                        })}
                        data={tableBody}
                    />
                </div>
            </Card>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(Markings)
