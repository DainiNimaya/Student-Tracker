import React, {Component, useState} from "react"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    UncontrolledTooltip
} from "reactstrap"
import {
    Book, HelpCircle,
    X
} from "react-feather"
import './_assignClass.scss'
import AvailableClass from '@components/assign-class/availableClass'
import LectureVenueAvailability from '@components/assign-class/lectureVenueAvailability'
import {
    TIME_SLOT_TYPES,
    TIME_PICKER_FORMAT,
    DATE_FORMAT,
    DATE_FORMAT_TABLE,
    SLOT_VALIDATION_TIME_FORMAT,
    SLOT_CREATION_TIME_FORMAT,
    TIME_PICKER_FORMAT_24_SEC
} from '@const'
import * as Api from "@api/haa"
import moment from "moment"
import {SLOT_SETUP_TABLE_COLUMN} from "./tableData"
import SlotInfo from '@components/class-viewer/slotInfo'
import {getSpecificDayOfWeek, checkClassDateRange, getTodayNameInUppercase, showError, findObject} from '@utils'
import {slotSetupTimelineValidation, timelineAvailabilityValidation} from '@validations/headOfAcademicAdmin'
import {slotSetupTimelineError} from '@formError/headOfAcademicAdmin'
import {toast} from "react-toastify"
import ConfirmBox from "@components/confirm-box"
import AddClassStudentModel from '@components/add-class-student/classSlotStudent'
import {gap, academicStatus, assignClassSlot} from '@strings'

// import '@styles/react/apps/app-calendar.scss'

const fromTime = new Date()
fromTime.setHours(8)
fromTime.setMinutes(0)

const toTime = new Date()
toTime.setHours(18)
toTime.setMinutes(0)

const initialLectureVenueState = {
    from: fromTime,
    to: toTime
}

const initialSlotInfo = {
    slotName: '',
    lecturer: null,
    venue: null,
    day: '',
    from: null,
    to: null
}

class assignClass extends Component {

    handleMouseEnter = (arg) => {
        // const desc = arg.event._def.extendedProps.description
        // console.log(desc)

        return <UncontrolledTooltip placement='right' target='positionRight'>
            Tooltip on Right
        </UncontrolledTooltip>
    }

    componentWillMount() {
        this.loadAvailableClassSlot()
        this.loadAvailableLectureVenue()

        if (this.props.location.state.edit) {
            this.getSlotTimelineData()
        }
    }

    state = {
        classSlot: {
            dateRange: [new Date(this.props.location.state.startDate), new Date(this.props.location.state.endDate)],
            type: TIME_SLOT_TYPES.student,
            id: ''
        },
        classSlotData: null,
        lectureVenue: {
            day: moment(new Date()).format('dddd').toUpperCase(),
            from: initialLectureVenueState.from,
            to: initialLectureVenueState.to,
            type: TIME_SLOT_TYPES.lecturer
        },
        data: [],
        venueData: null,
        lecturerData: [],
        calender: null,
        slotInfo: initialSlotInfo,
        noOfStudents: 0,
        slotSetupData: [],
        selectedRows: null,
        isBulkEditMenu: false,
        studentModel: false,
        timelineError: slotSetupTimelineError,
        isTimelineConfirm: false,
        slotId: 0,
        allTimelineSelect: false,
        isSelected: false,
        isTimelineSave: false,
        isStudentAssignClose: false,
        isSlotSetup: false,
        isSameSlotDay: true
    }

    getSlotTimelineData = async (isNew) => {
        const propState = this.props.location.state
        const res = await Api.getSlotTimelineData(propState.assignNewSlot ? this.state.slotId : propState.slotId)
        const tempArr = []
        res.map(item => {
            item['lecturer'] = {label: item.lecturerName, value: item.lectureId}
            item['venue'] = {label: `${item.venue} (${item.capacity})`, value: item.venueId}
            item['checked'] = false
            item['dateNew'] = item.date
            item['venueObj'] = item.venue
            item['fromNew'] = item.from
            item['toNew'] = item.to
            // item['lecturerAvailable'] = false
            tempArr.push(item)
        })

        const slotInfoData = {
            slotName: propState.slotName,
            lecturer: {label: propState.lecturer, value: propState.lecturerId},
            venue: {label: propState.venue, value: propState.venueId},
            day: propState.day,
            from: propState.from,
            to: propState.to
        }

        await this.setState({
            ...this.state,
            slotSetupData: tempArr,
            slotInfo: !isNew ? slotInfoData : this.state.slotInfo
        })
    }

    loadAvailableClassSlot = async () => {
        const {dateRange, type, id} = this.state.classSlot
        const props = this.props.location.state

        const data = {
            start: dateRange ? moment(dateRange[0]).format('yyyy-MM-DD') : null,
            end: dateRange ? moment(dateRange[1]).format('yyyy-MM-DD') : null,
            type,
            id: props.classId
        }

        const res = await Api.getAvailableTimeSlotOfClass(data)
        this.setState({
            classSlotData: res,
            noOfStudents: props.noOfStudents,
            classId: props.classId,
            class: props.class
        })
    }

    loadAvailableLectureVenue = async () => {
        const {dateRange} = this.state.classSlot
        const {day, from, to, type} = this.state.lectureVenue
        const props = this.props.location.state

        const data = {
            start: dateRange ? moment(dateRange[0]).format('yyyy-MM-DD') : null,
            end: dateRange ? moment(dateRange[1]).format('yyyy-MM-DD') : null,
            day,
            from: moment(from).format('HH:mm'),
            to: moment(to).format('HH:mm'),
            classId: props.classId,
            slotId: props.slotId ? props.slotId : null,
            type
        }
        const res = await Api.getAvailableLecturerVenue(data)
        if (res) {
            const tempColumn = res.calender.map(year => {
                return {
                    ...year,
                    months: year.months.map((month, monInd) => {
                        const dates = month.dates.length
                        let tempArr = []
                        if (monInd === 0) {
                            for (let i = dates; i < 4; i++) {
                                tempArr.push('-')
                            }
                        }
                        tempArr = [...tempArr, ...month.dates]

                        return {
                            ...month,
                            dates: tempArr
                        }
                    })
                }
            })

            this.setState({venueData: res.venues, lecturerData: res.lecturers, data: tempColumn})
        }
    }

    onTabHandler = async (type) => {
        await this.setState({...this.state, classSlot: {...this.state.classSlot, type}})
        await this.loadAvailableClassSlot()
    }

    onLectureVenueTabHandler = async (type) => {
        await this.setState({...this.state, lectureVenue: {...this.state.lectureVenue, type}})
        await this.loadAvailableLectureVenue()
    }

    onTimeHandler = async (name, e) => {
        await this.setState({
            ...this.state,
            lectureVenue: {...this.state.lectureVenue, [name]: e}
        })
        await this.loadAvailableLectureVenue()
    }

    onLectureVenueDayHandler = async (item) => {
        await this.setState({
            ...this.state,
            lectureVenue: {...this.state.lectureVenue, day: item.value}
        })
        await this.loadAvailableLectureVenue()
    }

    dateRangeHandler = async (date) => {
        if (date.length === 2) {
            await this.setState({...this.state, classSlot: {...this.state.classSlot, dateRange: date}})
            await this.loadAvailableClassSlot()
            await this.loadAvailableLectureVenue()
        }
    }

    onDayHandler = (val) => {
        const propState = this.props.location.state
        this.setState(
            {
                ...this.state,
                slotInfo: {...this.state.slotInfo, day: val},
                isSameSlotDay: propState.slotId !== 0 ? val.value === propState.day.value : true
            }
        )
    }

    onSlotTimeHandler = async (name, e) => {
        await this.setState({...this.state, slotInfo: {...this.state.slotInfo, [name]: e}})
    }

    onCreateTimeline = async (isSlotSetup, lectureList, venueList) => {
        if (this.state.isSameSlotDay) {
            if (this.state.slotSetupData.length > 0) {
                this.setState({isTimelineConfirm: true, isSlotSetup})
            } else {
                await this.createTimeline()
            }
        } else {
            const res = await this.assignClassSlot(true)
            if (res) {
                await this.getSlotTimelineData()
                await this.updateSlotData(lectureList, venueList)
            }
        }
    }

    updateSlotData = async (lectureList, venueList) => {
        const res = await Api.getSlotInfo(this.state.slotId)
        const slotInfo = {
            slotName: res.slotName,
            lecturer: findObject(lectureList, res.lecturerId),
            venue: findObject(venueList, res.venueId),
            day: {value: res.day},
            from: res.from,
            to: res.to
        }

        this.setState({
            ...this.state,
            slotInfo
        })
    }

    createTimeline = async () => {
        const edit = this.props.location.state.edit
        this.assignClassSlot()
        // if (edit) {
        //     await this.generateSampleTimelineData(this.props.location.state.slotId)
        // } else {
        //     const res = await this.assignClassSlot()
        //     if (res !== null) {
        //         await this.generateSampleTimelineData(res)
        //     }
        // }

        // await this.setState({isTimelineConfirm: false})
    }

    generateSampleTimelineData = async (res) => {
        const {lecturer, venue, from, to, day} = this.state.slotInfo
        const {startDate, endDate, extraClass} = this.props.location.state

        const daysArr = getSpecificDayOfWeek(startDate, 4, day.value ? day.value : day.no)
        const tempArr = []
        daysArr.map(item => {
            tempArr.push({
                lecturer,
                date: item,
                from,
                to,
                venue,
                availability: true,
                lecturerAvailable: true,
                type: extraClass ? academicStatus.extra : academicStatus.class
            })
        })

        await this.setState({
            ...this.state,
            slotSetupData: [...this.state.slotSetupData, ...tempArr],
            slotId: res.slotId
        })
        this.forceUpdate()
    }

    onSlotInputHandler = (e) => {
        this.setState({...this.state, slotInfo: {...this.state.slotInfo, [e.target.name]: e.target.value}})
    }

    slotDropdownHandler = (name, val) => {
        if (name === 'venue') {
            const noOfStudents = this.props.location.state.noOfStudents
            if (noOfStudents <= val.capacity) {
                this.setState({...this.state, slotInfo: {...this.state.slotInfo, [name]: val}})
            } else {
                toast.warning(assignClassSlot.studentLimitExceeded, {icon: true, hideProgressBar: true})
            }
        } else {
            this.setState({...this.state, slotInfo: {...this.state.slotInfo, [name]: val}})
        }
    }

    slotTableDropdownHandler = async (name, id, e) => {
        const noOfStudents = this.props.location.state.noOfStudents

        const rows = [...this.state.slotSetupData]
        if (name === 'lecturer') {
            rows[id].lecturer = e
        } else if (name === 'venue') {
            if (noOfStudents <= e.capacity) {
                rows[id].venueObj = e
            } else {
                toast.warning(assignClassSlot.studentLimitExceeded, {icon: true, hideProgressBar: true})
            }
        }

        await this.setState({...this.state, slotSetupData: rows})

        // this.forceUpdate()
    }

    slotTableTimeHandler = async (name, id, e) => {
        const rows = [...this.state.slotSetupData]
        if (name === 'from') {
            rows[id].fromNew = e
        } else {
            rows[id].toNew = e
        }

        await this.setState({...this.state, slotSetupData: rows})
        // this.forceUpdate()
    }

    slotTableAvailabilityHandler = async (id, e) => {
        const rows = [...this.state.slotSetupData]
        rows[id].availability = e

        await this.setState({...this.state, slotSetupData: rows})
        this.forceUpdate()
        if (!e) {
            toast.warning(`#${id + 1} Class has been cancelled`, {icon: true, hideProgressBar: true})
        }
    }

    onWeekStateHandler = async (id, state) => {
        const rows = [...this.state.slotSetupData]
        rows[id].type = state

        await this.setState({...this.state, slotSetupData: rows})
        this.forceUpdate()
    }

    slotTableDateHandler = async (id, e) => {
        const rows = [...this.state.slotSetupData]
        rows[id].dateNew = e[0]
        if (this.props.location.state.rescheduleClass) rows[id].isRescheduled = true

        await this.setState({...this.state, slotSetupData: rows})
        // this.forceUpdate()
    }

    slotTableAddRow = () => {
        const extraClass = this.props.location.state.extraClass
        this.state.slotSetupData.push({
            lecturer: {label: '', value: 0},
            date: moment().format(DATE_FORMAT),
            dateNew: null,
            from: 'from',
            to: 'to',
            fromNew: null,
            toNew: null,
            venue: {label: '', value: 0},
            venueObj: null,
            availability: true,
            lecturerAvailable: true,
            studentAvailable: true,
            venueAvailable: true,
            type: extraClass ? academicStatus.extra : academicStatus.class,
            allowDelete: true
        })
        this.forceUpdate()
    }

    slotTableRemoveRow = async (i) => {
        await this.state.slotSetupData.splice(i, 1)
        this.forceUpdate()
    }

    rowCheck = async (e) => {
        await this.setState({selectedRows: e})
        this.forceUpdate()
    }

    slotTableCheckBoxHandler = async (all, item, id) => {
        const rows = [...this.state.slotSetupData]
        if (all) {
            rows.map(item => {
                item.checked = !this.state.allTimelineSelect
            })
        } else {
            rows[id].checked = !item.checked
        }

        let isSelected = false
        rows.map(item => {
            if (item.checked) isSelected = true
        })

        await this.setState({
            ...this.state,
            slotSetupData: rows,
            allTimelineSelect: all ? !this.state.allTimelineSelect : false,
            isSelected
        })
        // this.forceUpdate()
    }

    onSave = async (tempTimeline) => {
        if (this.props.location.state.slotStudents.slotId === 0) {
            await this.setState({
                selectedClass: this.props.location.state.slotStudents.classId,
                selectedClassSlot: this.state.slotId,
                studentModel: true
            })
        } else {
            const timeline = this.state.slotSetupData
            const res = await slotSetupTimelineValidation(timeline, this.state.noOfStudents)
            this.setState({timelineError: res})
            for (const key in res) {
                if (res[key]) {
                    // showError()
                    return
                }
            }
            this.setState({isTimelineSave: true})
        }
    }

    dateValidateWithClassRange = async (res) => {
        let isComplete = false
        await this.state.slotSetupData.map(async item => {
            if (item.lecturerAvailable && item.studentAvailable && item.venueAvailable) {
                isComplete = true
            } else {
                isComplete = false
            }
        })

        if (!this.state.isStudentAssignClose) isComplete = false

        if (isComplete) {
            this.updateLecturerAvailability()
        } else {
            this.setState({...this.state, isTimelineConfirm: true, isTimelineSave: false})
        }
    }

    updateLecturerAvailability = async () => {
        const timeline = this.state.slotSetupData
        const slotData = this.state.slotInfo

        let slotFromTime = slotData.from
        let slotToTime = slotData.to
        if (typeof slotFromTime !== 'string') {
            slotFromTime = moment(slotData.from).format(SLOT_CREATION_TIME_FORMAT)
        } else {
            slotFromTime = `${slotData.from}:00`
        }

        if (typeof slotToTime !== 'string') {
            slotToTime = moment(slotData.to).format(SLOT_CREATION_TIME_FORMAT)
        } else {
            slotToTime = `${slotData.to}:00`
        }

        const data = timeline.map(item => {
            let fromTime = item.fromNew
            let toTime = item.toNew

            if (typeof (item.fromNew) === 'object') {
                fromTime = moment(item.fromNew).format(TIME_PICKER_FORMAT_24_SEC)
            }

            if (typeof (item.toNew) === 'object') {
                toTime = moment(item.toNew).format(TIME_PICKER_FORMAT_24_SEC)
            }

            if (typeof (item.dateNew) === 'object') {
                item['date'] = moment(item.dateNew).format(DATE_FORMAT)
            }

            return {
                classDateId: item.classDateId ? item.classDateId : 0,
                availability: item.availability,
                weekType: item.type,
                lectureId: (this.state.isSlotSetup && (slotData.lecturer.value !== item.lecturer.value)) ? slotData.lecturer.value : item.lecturer.value,
                venueId: (this.state.isSlotSetup && (slotData.venue.value !== item.venueObj.value)) ? slotData.venue.value : item.venueObj.value,
                date: item.date,
                startTime: (this.state.isSlotSetup && (fromTime !== slotFromTime)) ? slotFromTime : fromTime,
                endTime: (this.state.isSlotSetup && (toTime !== slotToTime)) ? slotToTime : toTime,
                isRescheduled: item.isRescheduled ? item.isRescheduled : false
            }
        })

        const propState = this.props.location.state
        const timelineRes = await this.assignClassSlot()

        if (timelineRes) {
            const res = await Api.updateLecturerAvailability((propState.assignNewSlot ? this.state.slotId : propState.slotId), data)
            if (res && res.status === 0) {
                this.props.history.goBack()
            } else {
                this.setState({isTimelineSave: false})
            }
        }
        this.setState({isTimelineConfirm: false, isTimelineSave: false})
    }

    assignClassSlot = async (isTimelineRecreate) => {
        const data = this.state.slotInfo
        const slotId = this.props.location.state.slotId
        const isEdit = this.props.location.state.edit
        let res = null

        const body = {
            slotId: slotId ? slotId : null, // can be null
            slotName: data.slotName,
            lectureId: data.lecturer ? data.lecturer.value : null,
            venueId: data.venue ? data.venue.value : null,
            day: data.day.value,
            startTime: typeof data.from === 'string' ? `${data.from}:00` : `${moment(data.from).format(SLOT_CREATION_TIME_FORMAT)}`,
            endTime: typeof data.to === 'string' ? `${data.to}:00` : `${moment(data.to).format(SLOT_CREATION_TIME_FORMAT)}`,
            resetTimeLine: isTimelineRecreate ? isTimelineRecreate : false
        }

        const classId = this.props.location.state.classId
        res = await Api.assignClassSlot(classId, body)
        if (res) {
            await this.setState({...this.state, slotId: res.slotId})
            if (!isEdit) await this.getSlotTimelineData(true)
        }
        return res
    }

    onBulkEdit = async (state) => {
        // if (this.state.selectedRows) {
        //     const line = [...this.state.slotSetupData]
        //     this.state.selectedRows.selectedRows.map(item => {
        //         const lineId = item.slotNo.props.children[2]
        //         line[(lineId - 1)].lecturer = state.lecturer
        //         line[(lineId - 1)].venue = state.venue
        //         line[(lineId - 1)].from = moment(state.from).format(TIME_PICKER_FORMAT)
        //         line[(lineId - 1)].to = moment(state.to).format(TIME_PICKER_FORMAT)
        //         line[(lineId - 1)].availability = state.availability
        //     })
        //
        //     await this.setState({...this.state, slotSetupData: line, isBulkEditMenu: false})
        //     await this.forceUpdate()
        // }

        if (this.state.isSelected) {
            const rows = [...this.state.slotSetupData]

            rows.map((item, i) => {
                if (item.checked) {
                    rows[i].lecturer = state.lecturer
                    rows[i].venueObj = state.venue
                    // rows[i].fromNew = moment(state.from).format(TIME_PICKER_FORMAT)
                    rows[i].fromNew = state.from
                    // rows[i].toNew = moment(state.to).format(TIME_PICKER_FORMAT)
                    rows[i].toNew = state.to
                    rows[i].availability = state.availability
                    rows[i].checked = false
                }
            })

            await this.setState({
                ...this.state,
                slotSetupData: rows,
                isBulkEditMenu: false,
                allTimelineSelect: false,
                isSelected: false
            })
            await this.forceUpdate()
        }
    }

    slotEditHandler = () => {
        if (!this.state.isSelected) {
            toast.warning('Please select at least a row', {icon: true, hideProgressBar: true})
        } else {
            this.setState({isBulkEditMenu: !this.state.isBulkEditMenu})
        }
    }

    reset = () => {
        this.setState({...this.state, slotInfo: initialSlotInfo, slotSetupData: []})
    }

    updateSlotInfo = () => {
        const val = JSON.parse(sessionStorage.getItem('SLOT_DATA'))

        this.setState({
            slotInfo: {
                ...this.state.slotInfo,
                ...val,
                from: val.from ? moment(val.from) : null,
                to: val.to ? moment(val.to) : null
            }
        })
    }

    render() {
        const data = []
        this.state.lecturerData && this.state.lecturerData.map(sec => {
            const tempDays = []
            const fm = (sec.dates.length > 0) ? (`${sec.dates[0].year}-${sec.dates[0].month}`) : ''
            let isAdded = true
            let monthCount = 0
            sec.dates.map(count => {
                if (fm === `${count.year}-${count.month}`) monthCount = monthCount + 1
            })

            sec.dates.map((d, dateId) => {
                if (isAdded && fm === `${d.year}-${d.month}`) {
                    if (monthCount < 4) {
                        for (let i = monthCount; i < 4; i++) {
                            tempDays.push(<div className={'item-selector'}>
                                <div className={`selector-lecture-venue blank`}></div>
                            </div>)
                        }
                        isAdded = false
                    }
                }

                tempDays.push(<div className={'item-selector'}>
                    <div className={`selector-lecture-venue ${d.available ? 'available' : 'unavailable'}`}></div>
                </div>)
            })

            data.push({
                module: <span style={{marginLeft: 12}}>{sec.lecturerName}</span>,
                days: tempDays
            })

        })

        const venueData = []
        this.state.venueData && this.state.venueData.map(item => {
            const tempDays = []
            const fm = (item.dates.length > 0) ? (`${item.dates[0].year}-${item.dates[0].month}`) : ''
            let isAdded = true
            let monthCount = 0
            item.dates.map(count => {
                if (fm === `${count.year}-${count.month}`) monthCount = monthCount + 1
            })
            item.dates.map((d, dateId) => {
                if (isAdded && fm === `${d.year}-${d.month}`) {
                    if (monthCount < 4) {
                        for (let i = monthCount; i < 4; i++) {
                            tempDays.push(<div className={'item-selector'}>
                                <div className={`selector-lecture-venue blank`}></div>
                            </div>)
                        }
                        isAdded = false
                    }
                }

                tempDays.push(<div className={'item-selector'}>
                    <div className={`selector-lecture-venue ${d.available ? 'available' : 'unavailable'}`}></div>
                </div>)
            })

            venueData.push({
                module: <span style={{marginLeft: 12}}>{item.venueName}</span>,
                intake: <span style={{marginLeft: 12}}>{item.capacity}</span>,
                days: tempDays
            })
        })

        const className = this.props.location.state.class ?? this.props.location.state.classCode
        const propState = {...this.props.location.state}
        return (<div className={'assign-class'}>
                {this.state.classSlotData && <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle
                            tag='h4'>{this.props.location.state.edit ? 'Class Update ' : 'Assign a Class'}</CardTitle>
                        <div className='d-flex mt-md-0 mt-1'>
                            <X style={{cursor: 'pointer'}} onClick={() => this.props.history.goBack()}/>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="class-section d-flex align-items-center">
                            <Book style={{marginRight: '10px'}}/> <label
                            className="lbl-class"> {propState.className} - {propState.classCode} <small
                            style={{fontWeight: 400}}>({propState.noOfStudents} Student{propState.noOfStudents > 1 ? 's' : ''})</small></label>
                        </div>

                        <AvailableClass dateRangeHandler={this.dateRangeHandler} onTabHandler={this.onTabHandler}
                                        data={this.state}/>

                        <div className={'mt-3'}>
                            <LectureVenueAvailability onTimeHandler={this.onTimeHandler}
                                                      onTabHandler={this.onLectureVenueTabHandler}
                                                      data={data} state={this.state} venueData={venueData}
                                                      onDayHandler={this.onLectureVenueDayHandler}/>
                        </div>

                        <div className={'mt-3'}>
                            <SlotInfo title={'Slot Setup'}
                                      state={{...this.state, propState}}
                                      dataSlotInfo={[...this.state.slotSetupData]}
                                      classScheduleViewer={this.state.classScheduleViewer}
                                      tblColumnSlotInfo={SLOT_SETUP_TABLE_COLUMN}
                                      type={true}
                                      onDayHandler={this.onDayHandler}
                                      onTimeHandler={this.onSlotTimeHandler}
                                      onCreateTimeline={this.onCreateTimeline}
                                      onInputHandler={this.onSlotInputHandler}
                                      slotDropdownHandler={this.slotDropdownHandler}
                                      slotTableDropdownHandler={this.slotTableDropdownHandler}
                                      slotTableTimeHandler={this.slotTableTimeHandler}
                                      slotTableAvailabilityHandler={this.slotTableAvailabilityHandler}
                                      slotTableAddRow={this.slotTableAddRow}
                                      rowCheck={this.rowCheck}
                                      editTimeSlotModalHandler={this.slotEditHandler}
                                      onWeekStateHandler={this.onWeekStateHandler}
                                      slotTableDateHandler={this.slotTableDateHandler}
                                      onBulkEdit={this.onBulkEdit}
                                      reset={this.reset}
                                      history={this.props.history}
                                      clzName={className}
                                      isEdit={this.props.location.state.edit}
                                      slotTableCheckBoxHandler={this.slotTableCheckBoxHandler}
                                      classCode={className}
                                      selectedClass={this.props.location.state}
                                      updateSlotInfo={this.updateSlotInfo}
                                      slotStudents={propState.slotStudents}
                                      slotTableRemoveRow={this.slotTableRemoveRow}
                            />
                        </div>

                        {this.state.slotSetupData.length > 0 && <div align={'right'} className={'mt-2'}>
                            <Button onClick={() => this.props.history.goBack()} outline
                                    color={'primary'}>Cancel</Button>
                            <Button onClick={() => this.onSave()} style={{marginLeft: 20}}
                                    color={'primary'}>{propState.slotStudents.slotId === 0 ? 'Save & Assign Students' : 'Save Changes'}</Button>
                        </div>}
                    </CardBody>
                </Card>}

                <ConfirmBox
                    isOpen={this.state.isTimelineConfirm}
                    toggleModal={() => this.setState({isTimelineConfirm: !this.state.isTimelineConfirm})}
                    yesBtnClick={this.updateLecturerAvailability}
                    noBtnClick={() => this.setState({isTimelineConfirm: !this.state.isTimelineConfirm})}
                    title={'Confirmation'}
                    message={gap.unavailableWarning}
                    yesBtn="Ok"
                    noBtn="Cancel"
                    icon={<HelpCircle size={40} color="#F1C40F"/>}
                />

                <ConfirmBox
                    isOpen={this.state.isTimelineSave}
                    toggleModal={() => this.setState({isTimelineSave: !this.state.isTimelineSave})}
                    yesBtnClick={() => {
                        const slotId = this.props.location.state.slotId
                        if (this.state.isStudentAssignClose && slotId !== null) {
                            this.props.history.goBack()
                        } else {
                            this.dateValidateWithClassRange()
                        }
                    }}
                    noBtnClick={() => this.setState({isTimelineSave: !this.state.isTimelineSave})}
                    title={'Confirmation'}
                    message={'Are you sure do you want to save it?'}
                    yesBtn="Yes"
                    noBtn="No"
                    icon={<HelpCircle size={40} color="#F1C40F"/>}
                />
                {
                    this.state.studentModel &&
                    <AddClassStudentModel
                        visible={this.state.studentModel}
                        isPreConfirmation
                        toggleModal={async () => {
                            const timeline = this.state.slotSetupData
                            const res = await slotSetupTimelineValidation(timeline, this.state.noOfStudents)
                            this.setState({timelineError: res})
                            for (const key in res) {
                                if (res[key]) {
                                    // showError()
                                    return
                                }
                            }
                            this.setState({
                                studentModel: !this.state.studentModel,
                                isStudentAssignClose: true
                            })
                            this.props.history.goBack()
                        }}
                        title='Add New Students'
                        classId={this.state.selectedClass}
                        slotId={this.state.selectedClassSlot}
                    />
                }
            </div>
        )
    }
}

export default assignClass
