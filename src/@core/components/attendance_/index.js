import React from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row} from 'reactstrap'
import Filter from "@components/filter"
import {COLOR_STATUS, ROLES, FILTERS, FILTER_TYPES, MARK_ATTENDANCE_TEMPLATE_CSV_HEADER} from '@const'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import {CSVLink} from "react-csv"
import {ChevronDown, Download, Edit, Upload, X} from "react-feather"
import DataTable from "react-data-table-component"
import CustomPagination from "@components/customPagination"
import {MARK_ATTENDANCE_TABLE} from "./tableData"
import Cookies from "js-cookie"
import * as Api from "@api/haa_"
import config from '@storage'

const role = JSON.parse(Cookies.get(config.user)).role

class Attendance extends React.Component {


    fileRef = React.createRef()
    csvLinkEl = React.createRef()
    state = {
        importData: undefined,
        exportData: [],
        data: [],
        changeData: [],
        batches: [],

        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0,
        presents: 0,
        absent: 0,
        edit: true,
        model: false,
        title: "",
        yesBtn: "",
        noBtn: "",
        url: "",
        qrCode: "",
        showFilter: false
    }

    async componentWillMount() {
        await this.loadAllStudents()
    }

    onFilterHandler = async (data, clear) => {
        await this.setState({currentPage: 0})
        await this.props.dispatch(handleFilter({...data, route: rs.markAttendance}))
        await this.loadAllStudents()
    }

    loadAllStudents = async () => {
        const clz = this.props.location.state
        const res = await Api.getStudentsForAttendance()
        if (res) {
            let count = 0
            const content = []
            res.content.map((item, index) => {
                const i = this.findIndex(this.state.changeData, item)
                if (i > -1) {
                    const ex = this.state.changeData[i]
                    content.push({
                        ...item,
                        status: ex.status,
                        remark: ex.remark,
                        no: (this.state.currentPage * 10) + (index + 1)
                    })
                } else {
                    const d = {
                        ...item,
                        count,
                        //status: (user && this.state.edit) ? ATTENDANCE_STATUS[0] : item.status,
                        status: item.status,
                        index,
                        no: (this.state.currentPage * 10) + (index + 1)
                    }
                    count > 6 ? count = 0 : count += 1
                    content.push(d)
                }
            })

            await this.setState({
                data: content,
                numberOfElements: res.numberOfElements,
                totalElements: res.totalElements,
                totalPages: res.totalPages,
                offset: res.pageable.offset,
                pageSize: res.pageable.pageSize
            })
            await this.setCount()
        }
    }

    onEdit = async (row, name, value) => {
        if (this.state.edit) {
            const data = [...this.state.data], changeData = [...this.state.changeData]
            let index = this.findIndex(data, row)
            data[index][name] = value

            index = this.findIndex(this.state.changeData, row)
            if (index === -1) {
                changeData.push(row)
            } else {
                changeData[index] = row
            }
            await this.setState({data, changeData})
            await this.setCount()
        }
    }

    findIndex = (array, data) => {
        const filter = array.filter(i => i.cbNumber === data.cbNumber)[0]
        return filter ? array.findIndex(i => i.cbNumber === filter.cbNumber) : -1
    }

    markAll = async (action) => {
        const res = await Api.markAllAttendance(this.props.location.state.timelineId, action)
        if (res) {
            await this.setState({currentPage: 0, changeData: []})
            await this.loadAllStudents()
        }
    }

    render() {
        return (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle tag='h4'>Attendance Sheet</CardTitle>

                        <div className='d-flex align-items-center'>

                            {
                                role !== config.haaRole && <>
                                    <CSVLink filename={'template_mark_attendance.csv'} data={[]}
                                             headers={MARK_ATTENDANCE_TEMPLATE_CSV_HEADER}>
                                        <div className={'link-csv-template me-1'}>
                                            <Download className={'lbl-csv-template'} size={15}/>{" "}
                                            <span className='lbl-csv-template align-middle ml-50'>CSV Template</span>
                                        </div>
                                    </CSVLink>

                                    <Button size={"sm"} tag={Label} className='importBtn top-custom-btn me-1 mb-0' color='primary'
                                            outline>
                                        <Download size={15} className={"importBtn"}/>
                                        <span className='importBtn align-middle ml-50'> Import </span>
                                        <input type='file' ref={this.fileRef} onChange={this.onImportFile} hidden
                                               accept='.xlsx, .xls, .csv'/>
                                    </Button>
                                </>
                            }

                            <Button size={"sm"} className={'top-custom-btn me-1'} color='primary'
                                    outline>
                                <Upload size={15}/>
                                <span className='align-middle ml-50'> Export </span>
                            </Button>

                        </div>
                    </CardHeader>
                    <CardBody>
                        <Filter
                            list={[
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'module',
                                    label: 'Batch',
                                    placeholder: 'All',
                                    options: [],
                                    value: this.props.filter.module
                                },{
                                    type: FILTER_TYPES.dropDown,
                                    name: 'module',
                                    label: 'Module',
                                    placeholder: 'All',
                                    options: [],
                                    value: this.props.filter.module
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'school',
                                    label: ' Class',
                                    placeholder: 'All',
                                    options: [],
                                    value: this.props.filter.school
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'role',
                                    label: 'Session',
                                    placeholder: 'All',
                                    options: [],
                                    value: this.props.filter.role
                                }
                            ]}
                            onFilter={this.onFilterHandler}
                        />
                        <Row className="mb-2">
                            <Col sm='2' className="d-flex flex-column">
                                <Label>
                                    <strong>Date</strong>
                                </Label>
                                <Label>
                                   2024-01-10
                                </Label>
                            </Col>
                            <Col sm='2' className="d-flex flex-column">
                                <Label>
                                    <strong>Starting Time</strong>
                                </Label>
                                <Label>
                                    08:00:00
                                </Label>
                            </Col>
                            <Col sm='2' className="d-flex flex-column">
                                <Label>
                                    <strong>Ending Time</strong>
                                </Label>
                                <Label>
                                    10:00.00
                                </Label>
                            </Col>
                            <Col sm='2' className="d-flex flex-column">
                                <Label>
                                    <strong>Number of Presents</strong>
                                </Label>
                                <Label>
                                   1
                                </Label>
                            </Col>
                            <Col sm='2' className="d-flex flex-column">
                                <Label>
                                    <strong>Number of Absent</strong>
                                </Label>
                                <Label>
                                    0
                                </Label>
                            </Col>
                        </Row>

                        {
                            role !== config.haaRole && <div className="d-flex flex-row justify-content-between mt-2">

                                <div className="d-flex flex-row">
                                    <Button size={"sm"} className="btn-present me-1"
                                        // onClick={() => this.markAll(ATTENDANCE_STATUS[0])}
                                    >
                                        Mark All as Present
                                    </Button>

                                    <Button size={"sm"} className="btn-absence"
                                        // onClick={() => this.markAll(ATTENDANCE_STATUS[1])}
                                    >
                                        Mark all as absence
                                    </Button>
                                </div>
                            </div>
                        }

                        <div className='react-dataTable mt-2'>
                            <DataTable
                                noHeader
                                pagination
                                data={this.state.data}
                                columns={MARK_ATTENDANCE_TABLE(this.onEdit, this.state.edit,role === config.haaRole)}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10}/>}
                                paginationDefaultPage={this.state.currentPage + 1}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                paginationComponent={() => CustomPagination({
                                    ...this.state,
                                    handlePagination: page => this.handlePagination(page)
                                })}
                            />
                        </div>
                        {
                            role !== config.haaRole && <div className="d-flex justify-content-end mt-2">
                                <Button color='primary' onClick={this.saveAttendance}>
                                    Save Changes
                                </Button>
                            </div>
                        }
                    </CardBody>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(Attendance)