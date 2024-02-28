import React, {Component} from "react"
import {
    MoreVertical,
    Plus
} from 'react-feather'
import {
    Card,
    CardHeader,
    CardTitle,
    Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardBody
} from 'reactstrap'
import {academicPlan, academicStatus} from '@strings'
import {selectThemeColors} from '@utils'
import '../../../@core/scss/react/libs/tables/react-dataTable-component.scss'
import '../../../@core/scss/react/libs/react-select/_react-select.scss'
import Table from '@components/table-gap/index'
import Flatpickr from "react-flatpickr"
import {DATE_FORMAT, YEAR_MONTH_FORMAT, FILTER_TYPES, FILTERS} from '@const'
import './_generalacademicPlan.scss'
import * as Api from "@api/haa"
import moment from "moment"
import {GAP_TABLE_COLUMN} from './tableData'
import rs from '@routes'
import classnames from "classnames"
import Select from "react-select"
import Filter from "@components/filter"
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'

const colourOptions = [
    {value: 'FF2021LLB', label: 'FF2021LLB'},
    {value: 'assign', label: 'Assign a Slot'}
]

class AllAcademics extends Component {
    state = {
        data: [],
        section: [],
        dateRange: [new Date(), new Date().setFullYear(new Date().getFullYear() + 1)],
        batches: [],
        modules: [],
        showFilter: false
        // dateRange: ['2022/01/01', '2022/12/31']
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                route: rs.academicPlan
            }))
        } else if (this.props.filter.route !== rs.academicPlan) {
            await this.props.dispatch(handleFilter({
                ...FILTERS,
                route: rs.academicPlan
            }))
        }
        this.setState({ showFilter: true})
        await this.loadAllGaps()
        await this.loadAllBatches()
        await this.loadAllModule()
    }

    loadAllGaps = async () => {
        const filter = this.props.filter
        const data = {
            startDate: filter.dateRange ? moment(filter.dateRange[0]).format(DATE_FORMAT) : moment(this.state.dateRange[0]).format(DATE_FORMAT),
            endDate: filter.dateRange ? moment(filter.dateRange[1]).format(DATE_FORMAT) : moment(this.state.dateRange[1]).format(DATE_FORMAT),
            moduleId: filter.module ? filter.module.value : null,
            batchId: filter.batch ? filter.batch.value : null
        }

        const res = await Api.loadAllGaps(data)
        const rows = []
        res.gapWeeks.map((row, rowId) => {
            row['class'] = row.classCode
            row['className'] = row.className ?? ''

            const rowDates = []
            res.calender.map(y => {
                const year = Number.parseInt(y.year)

                y.months.map(m => {
                    const month = Number.parseInt(moment().month(m.name).format("M"))

                    m.dates.map(d => {
                        const found = row.dates.map(date => {
                            const yearSlot = Number.parseInt(date.year)
                            if (yearSlot === year && date.month === month && date.day === d) {
                                rowDates.push(date)
                            }
                        })
                    })
                })
            })

            row.dates = rowDates
            rows.push(row)
        })

        await this.setState({
            data: res.calender,
            section: rows
        })
    }

    loadAllBatches = async () => {
        const res = await Api.getAllBatchesForProgression()
        this.setState({batches: res})
    }

    loadAllModule = async () => {
        const res = await Api.getAllModulesForDropDown()
        this.setState({modules: res})
    }

    dateStateHandler = async (sec, date) => {
        const section = [...this.state.section]
        const foundS = {...section[sec.secId].dates}
        switch (foundS[date.dateId].status) {
            case academicStatus.default:
                foundS[date.dateId].status = academicStatus.class
                break

            case academicStatus.class:
                foundS[date.dateId].status = academicStatus.exam
                break

            case academicStatus.exam:
                foundS[date.dateId].status = academicStatus.studyLeave
                break

            case academicStatus.studyLeave:
                foundS[date.dateId].status = academicStatus.holiday
                break

            case academicStatus.holiday:
                foundS[date.dateId].status = academicStatus.default
                break

            default:
                break
        }
        await this.setState({section})
    }

    dateRangeHandler = async (date) => {
        if (date.length === 2) {
            await this.setState({dateRange: date})
            await this.loadAllGaps()
        }
    }

    classViewer = (sec) => {
        this.props.history.push({pathname: rs.classViewer, state: sec})
    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.academicPlan}))
        await this.loadAllGaps()
    }

    render() {
        const data = []
        const totalCount = []

        // let dateCount = 0;
        // (this.state.data.length > 0 && this.state.section.length > 0) && this.state.data.map(cal => {
        //     cal.months.map(mon => {
        //         dateCount = dateCount + (mon.dates.length)
        //     })
        // })

        // const a = []
        // this.state.data.map(year => {
        //     year.months.map(month => {
        //         month.dates.map((date, i) => a.push(date))
        //     })
        // })

        const temp = []
        // const lastTemp = []

        if (this.state.data[0] !== undefined && this.state.data[0].months !== undefined) {
            const lastDateCount = this.state.data[(this.state.data.length - 1)].months[(this.state.data[(this.state.data.length - 1)].months.length - 1)].dates.length
            const dateCount = this.state.data[0].months[0].dates.length
            if (dateCount < 4) {
                for (let i = dateCount; i < 4; i++) {
                    temp.push({status: 'NONE', noOfHours: 0})
                }
            }

            // if (lastDateCount < 4) {
            //     for (let i = lastDateCount; i < 4; i++) {
            //         lastTemp.push({status: 'NONE', noOfHours: 0})
            //     }
            // }
        }


        this.state.section.map((sec, secId) => {
            const startDate = moment(sec.startDate)


            const endDate = moment(sec.endDate)

            // let tempYear = 0
            const sample = temp.concat(sec.dates)
            // const lastSample = lastTemp.concat(sample)
            data.push({
                class: <div className={'class-menu'}>
                    {/*<label className={'class-label'}>{sec.class}</label>*/}
                    <Select
                        menuPortalTarget={document.body}
                        theme={selectThemeColors}
                        style={{minWidth: 200}}
                        className={classnames('react-select')}
                        classNamePrefix='select'
                        value={{label: sec.class, value: sec.class}}
                        options={[
                            {
                                label: <>
                                    {/*<Plus size={15}/>*/}
                                    <span className='align-middle ml-50'> View / Assign a Slot</span></>,
                                value: ''
                            }
                        ]}
                        isClearable={false}
                        isSearchable={false}
                        onChange={(e) => this.classViewer(sec)}
                        //placeholder={'Select fee type'}
                    />
                    <div className='class-menu d-flex'>
                        {/*<UncontrolledDropdown>*/}
                        {/*    <DropdownToggle className='pr-1' tag='span'>*/}
                        {/*        <MoreVertical size={15}/>*/}
                        {/*    </DropdownToggle>*/}
                        {/*    <DropdownMenu right>*/}
                        {/*        <DropdownItem tag='a' className='w-100' onClick={() => this.classViewer(sec)}>*/}
                        {/*            <Plus size={15}/>*/}
                        {/*            <span className='align-middle ml-50'>Assign a Slot</span>*/}
                        {/*        </DropdownItem>*/}
                        {/*    </DropdownMenu>*/}
                        {/*</UncontrolledDropdown>*/}


                    </div>
                </div>,
                module: <><Input disabled type='text' id='basicInput' value={`${sec.moduleCode} - ${sec.module}`}
                                 placeholder='-'
                                 style={{width: '100%'}}/></>,
                intake: <><Input disabled type='text' id='basicInput' value={sec.intake} placeholder='-'
                                 style={{width: '100% !important'}}/></>,
                days: sample.map((d, dateId) => {
                    totalCount[dateId] = (totalCount[dateId] ? totalCount[dateId] : 0) + ((d.status === academicStatus.class || d.status === academicStatus.extra) ? d.noOfHours : 0)
                    const date = moment(`${d.year}-${d.month}-${d.day}`)

                    return <div
                        className={'item-selector'}
                        // onClick={() => this.dateStateHandler({sec, secId}, {d, dateId})}
                    >
                        <div className={`selector-gap ${d.status === academicStatus.default
                            ? date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate) ? 'class-range' : 'default' : (d.status === academicStatus.class || d.status === academicStatus.extra)
                                ? 'class-week' : d.status === academicStatus.exam
                                    ? 'exam-week' : d.status === academicStatus.studyLeave
                                        ? 'study-leave-week' : 'holiday-week'}`}>{d.status !== academicStatus.default ? d.status === academicStatus.exam ? 'E' : d.status === academicStatus.studyLeave ? 'S' : d.status === academicStatus.holiday ? 'H' : d.noOfHours : ''}
                        </div>
                    </div>
                })
                // days: a.map((d, dateId) => {
                //     // if (tempYear !== sec.dates[dateId].year) {
                //     //     tempYear = sec.dates[dateId].year
                //     // }
                //     if (d === sec.dates[dateId].day) {
                //         const slot = sec.dates[dateId]
                //         console.log(slot)
                //         return <div
                //             className={'item-selector'}
                //             // onClick={() => this.dateStateHandler({sec, secId}, {d, dateId})}
                //         >
                //             <div className={`selector-gap ${slot.status === academicStatus.default
                //                 ? 'default' : slot.status === academicStatus.class
                //                     ? 'class-week' : slot.status === academicStatus.exam
                //                         ? 'exam-week' : slot.status === academicStatus.studyLeave
                //                             ? 'study-leave-week' : 'holiday-week'}`}>{slot.status !== academicStatus.default ? slot.status === academicStatus.exam ? 'E' : slot.status === academicStatus.studyLeave ? 'S' : slot.status === academicStatus.holiday ? 'H' : slot.noOfHours : ''}
                //             </div>
                //         </div>
                //     } else {
                //         return <div
                //             className={'item-selector'}>
                //             <div className={`selector-gap default`}></div>
                //         </div>
                //     }
                // })
            })

            // sec.dates.map((d, dateId) => {
            //     console.log(d)
            //     // totalCount.push(<div className={'lbl-gap-total'}>3</div>)
            // })
        })

        return (
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>{academicPlan.generalAcademicPlan}</CardTitle>
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
                                },
                                {
                                    type: FILTER_TYPES.rangePicker,
                                    name: 'dateRange',
                                    label: 'Date Range',
                                    placeholder: 'From - To',
                                    value: (this.props.filter && this.props.filter.dateRange ? this.props.filter.dateRange : this.state.dateRange)
                                }
                            ]}
                            onFilter={this.onFilterHandler}
                        />
                    }
                </CardBody>

                {/*<div className={'hr'}/>*/}
                {(this.state.data.length > 0 && this.state.section.length > 0) ? <Table
                    dateStateHandler={this.dateStateHandler}
                    columns={GAP_TABLE_COLUMN}
                    state={this.state}
                    rows={data}
                    totalCount={totalCount}
                /> : <div align={'center'} className={'p-2'}>
                    No records to display
                </div>}
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(AllAcademics)
