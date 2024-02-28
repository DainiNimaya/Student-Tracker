import React, {Component} from "react"
import {Badge, Button, Card, CardBody, CardHeader, CardTitle, Input} from "reactstrap"
import {Book, Eye, HelpCircle, Info, Trash, Upload, X} from "react-feather"
import './_classViewer.scss'
import ClassSlot from '@components/class-viewer/classSlot'
import {CLASS_SLOT_TABLE_COLUMN_1, CLASS_SLOT_TABLE_COLUMN_2} from './tableData'
import {selectThemeColors, getAmPmTimeFromNormalTime, getCookieUserData} from "@utils"
import * as Api from "@api/haa_"
import {academicStatus} from '@strings'
import rs from '@routes'
import moment from "moment"
import {ATTENDANCE_EXPORT_TEMPLATE_CVS_HEADER, DATE_FORMAT_TABLE, FILTERS, ROLES} from '@const'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import config from '@storage'
import ConfirmBox from "@components/confirm-box"

let props = null
const lec = getCookieUserData()

class classViewer extends Component {
    csvLinkEl = React.createRef()
    state = {
        classSlots: [],
        slotInfo: null,
        classScheduleViewer: false,
        noOfStudents: 0,
        exportData: [],
        selectedData: null,
        deleteConfirm: false
    }

    async componentWillMount() {
        this.loadAllData()
    }

    loadAllData = async () => {
        sessionStorage.removeItem('SLOT_DATA')
        this.props.dispatch(handleFilter({...FILTERS, route: undefined}))

        const classScheduleViewer = window.location.pathname === rs.classScheduleViewer
        await this.setState({classScheduleViewer})
        props = await this.props.location.state
        this.loadAllClassSlots()
    }

    loadAllClassSlots = async () => {
        //const res = null
        /*if (lec.role === ROLES.maa.value) {
            res = await ApiLec.getAllSlotsByClassIdAndLecturerId(props.classId, lec.userId)
        } else {
            res = await Api.loadAllClassSlots(props.classId)
        }*/
        const res = await Api.loadAllClassSlots(props.classId)

        this.setState({classSlots: res.slots, noOfStudents: res.noOfStudents})
    }

    addSlot = () => {
        const obj = {...this.props.location.state}
        obj['noOfStudents'] = this.state.noOfStudents
        obj['assignNewSlot'] = true
        obj['slotId'] = 0
        obj.slotStudents = {
            classId: obj.classId,
            slotId: 0
        }
        this.props.history.push({pathname: rs.assignClass, state: obj})
    }

    onEditSlot = (data) => {
        const props = this.props.location.state
        data['class'] = data.classCode
        data['className'] = props.className
        data['class'] = data.classCode
        data['classId'] = props.classId
        data['startDate'] = props.startDate
        data['endDate'] = props.endDate
        data['slotId'] = data.slotId
        data['edit'] = true
        data['moduleId'] = props.moduleId

        data.slotStudents = {
            classId: data.classId,
            slotId: data.slotId
        }
        this.props.history.push({pathname: rs.assignClass, state: data})
    }

    viewAttendance = (data) => {
        sessionStorage.setItem(rs.viewAttendanceTimeTable, JSON.stringify(this.state.slotInfo))
        data['classId'] = props.classId
        data['moduleId'] = this.state.slotInfo.moduleId
        this.props.history.push({pathname: rs.markAttendance, state: data})
    }

    viewSummary = () => {
        sessionStorage.setItem(rs.viewAttendanceTimeTable, JSON.stringify(this.state.slotInfo))
        this.props.history.push(rs.attendanceSummary, {...this.state.slotInfo, classId: props.classId})
    }

    exportData = async () => {
        const res = await Api.loadAllClassSlots(props.classId)

        if (res && res.slots.length > 0) {
            await this.setState({
                exportData: res.slots.map(item => {
                    return {
                        ...{
                            slotName: item.slotName,
                            lecturer: item.lecturer,
                            venue: item.venue,
                            day: item.day,
                            timeDuration: `${item.from} - ${item.to}`
                        }
                    }
                })
            })
            return {content: res.slots}
            //this.csvLinkEl.current.link.click()
        }
    }

    onDeleteSlot = async () => {
        // const res = await Api.deleteSlotByClassIdAndSlotId(this.props.location.state.classId, this.state.selectedData.slotId)
        // if (res) {
        //     this.setState({deleteConfirm: false, selectedData: null})
        //     this.loadAllData()
        // }
    }

    render() {
        const className = this.props.location.state.class ?? this.props.location.state.classCode
        const classN = this.props.location.state.className
        const classC = this.props.location.state.classCode
        const attendance = this.props.location.state.attendance
        const classSchedule = this.props.location.state.classSchedule

        const data = []
        this.state.classSlots.map(item => {
            data.push({
                ...item,
                slotName: <span className={'lbl-slot-name'}>{item.slotName}</span>,
                lecturer: item.lecturer,
                venue: item.venue,
                day: item.day,
                timeDuration: item.from ? `${getAmPmTimeFromNormalTime(item.from)} - ${getAmPmTimeFromNormalTime(item.to)}` : '-',
                action: <>
                    <Button size={'sm'} color='danger' outline style={{marginLeft: 10}} onClick={() => {
                        this.setState({
                            selectedData: item,
                            deleteConfirm: true
                        })
                    }}>
                        <Trash size={15}/>
                    </Button>
                </>
            })
        })

        const slotInfo = []
        this.state.slotInfo?.timeline.map((item, i) => {
            item['lecturer'] = {label: item.lecturerName, value: item.lecturerId}
            item['venueObj'] = {label: `${item.venue} (${item.capacity})`, value: item.venueId}
            item['dateNew'] = moment(item.date).format(DATE_FORMAT_TABLE)
            item['fromNew'] = getAmPmTimeFromNormalTime(item.from)
            item['toNew'] = getAmPmTimeFromNormalTime(item.to)

            slotInfo.push(item)
        })

        return (<>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle
                        tag='h4'>{attendance ? "Timetable" : this.state.classScheduleViewer ? 'Class Schedule' : 'Class Viewer'}</CardTitle>

                    <div className='d-flex align-items-center'>
                        <X style={{cursor: 'pointer', marginLeft: '15px'}} onClick={() => this.props.history.goBack()}/>
                    </div>
                </CardHeader>
                <CardBody>

                    <div className={'class-section'}>
                        <div className='d-flex flex-row justify-content-between'>
                            <label className={'lbl-class'}><Book size={20} className="me-1"/>{classN}({classC})</label>

                            <div className='d-flex justify-content-end align-items-center'>
                                {
                                    (!attendance && !classSchedule) && <>
                                        <Badge color={'light-info'}>
                                            <Info size={15}/> {this.state.noOfStudents} Students
                                        </Badge>
                                    </>
                                }
                            </div>
                        </div>

                        <ClassSlot addSlot={this.addSlot} data={data} title={'Class Slots'} btnLbl={'Add Session'}
                                   classScheduleViewer={this.state.classScheduleViewer}
                                   attendance={attendance}
                                   tblColumns={lec?.role === config.haaRole ? CLASS_SLOT_TABLE_COLUMN_2 : CLASS_SLOT_TABLE_COLUMN_1}/>
                    </div>
                </CardBody>
            </Card>

            <ConfirmBox
                isOpen={this.state.deleteConfirm}
                toggleModal={() => this.setState({deleteConfirm: false})}
                yesBtnClick={this.onDeleteSlot}
                noBtnClick={() => {
                    this.setState({deleteConfirm: false, selectedData: null})
                }}
                title={'Confirmation'}
                message={'Are you sure do you want to delete this slot?'}
                yesBtn="Yes"
                noBtn="No"
                icon={<HelpCircle size={40} color="#FFCC00"/>}
            />
        </>)
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(classViewer)
