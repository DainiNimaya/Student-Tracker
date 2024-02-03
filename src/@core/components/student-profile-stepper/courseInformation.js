import React, {Component} from "react"
import DataTable from "react-data-table-component"
import {
    COURSES_TABLE_COLUMNS,
    MODULE_RESULTS_TABLE_COLUMNS,
    RESULTS_TABLE_COLUMNS,
    OTHER_INFO_TABLE_COLUMNS
} from './tableData'
import themeConfig from '@configs/themeConfig'
import * as Api from '@api/haa_'
import {
    Badge,
    Button,
    Row,
    Col,
    CardHeader
} from "reactstrap"
import {
    GRADES,
    COLOR_STATUS,
    STUDENT_COURSES_STATUS,
    STUDENT_MODULE_CSV_HEADER,
    STUDENT_RESULTS_CSV_HEADER,
    EMPTY_FILE,
    SMP_MODULE_STATUS,
    STUDENT_OTHER_INFO_CSV_HEADER,
    COURSE_TRANSFER_REQUEST_STATUS,
    COURSE_TRANSFER_REQUEST_STATUS_WITH_LABELS
} from '@const'
import {capitalize} from '@commonFunc'
import './scss/_studentProfile.scss'
import {CSVLink} from "react-csv"
import {BookOpen, HelpCircle, Upload, X} from "react-feather"
import TableLevelExpand from "@components/table-level-expand"
import Avatar from '@components/avatar'
import Select from "react-select"
import {selectThemeColors, getCookieUserData, getFirstTwoLetter, findObject} from '@utils'
import config from '@storage'
import AttendanceModal from "./attendanceModal"
import AssessmentsModal from "./assessmentsModal"
import {toast} from "react-toastify"
import rs from '@routes'
import ChangeCourseModal from "./modals/changeCourseModal"
import ConfirmBox from "@components/confirm-box"
import UpdateOfferModal from './sideModals/updateOfferModal'
import FilePreview from "@components/file-preview"
import {courseInformation} from '@configs/studentMasterProfileConfig'
import DropModule from "../drop-module"
import {accessList} from '@configs/basicInfomationConfig'
import ExportMenu from '@components/export-menu'

const ACCESS_LIST = [config.haaRole, config.maaRole, config.aaRole]

class CourseInformation extends Component {
    csvLinkEl = React.createRef()

    state = {
        courses: [],
        exportData: [],
        moduleResults: [],
        isAttendanceModal: false,
        studentDetails: null
    }

    componentWillMount() {
        this.loadCourses()
    }

    loadCourses = async () => {
        const studentId = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const res = await Api.getCoursesByStudentId(studentId)

        let isOngoingCourse = true
        await this.setState({
            courses: res.map(item => {
                if (item.status === 'ONGOING') isOngoingCourse = false
                return item
            }),
            studentDetails: null,
            isOngoingCourse
        })
    }


    checkAccessLevel = (data) => {
        return data.users.includes(getCookieUserData().role)
    }

    render() {
        let currentCourse = null
        const courseList = []
        let isOngoing = false
        this.state.courses.map(item => {
            if (item.status === 'ONGOING') {
                isOngoing = true
                currentCourse = item
            }

            courseList.push({
                ...item,
                // studyMode: item.studyMode ? capitalize(item.studyMode.replaceAll('_', ' ').toLowerCase()) : 'N/A',
                batchCode: item.batchCode ? item.batchCode : 'N/A',
                status: <Badge
                    color={`light-${item.status === STUDENT_COURSES_STATUS.ongoing ? COLOR_STATUS[0]
                        : item.status === STUDENT_COURSES_STATUS.enrolled ? COLOR_STATUS[3]
                            : item.status === STUDENT_COURSES_STATUS.completed ? COLOR_STATUS[0] : COLOR_STATUS[1]}`}>{item.status === 'ONGOING' ? 'Active' : capitalize(item.status.replaceAll('_', ' ').toLowerCase())}</Badge>,
                action: <span className={'lbl-view'}
                              onClick={() => this.moduleResultHandler('MODULE', item)}>View</span>
            })
        })

        let ongoingCourse = null
        this.state.courses.filter(item => {
            if (item.status === 'ONGOING') ongoingCourse = item
        })


        const mobile = window.innerWidth <= 991
        return (<>
                <div className={'course-information'}>
                    <CardHeader className="p-0 mb-1">
                        <h4><BookOpen size={20}/> Courses</h4>
                        {
                            mobile &&
                            <X onClick={() => this.props.onClose()} id={'close-icon'}/>
                        }
                    </CardHeader>

                    <div className={'courses-section'}>
                        <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                columns={COURSES_TABLE_COLUMNS}
                                paginationPerPage={10}
                                className='react-dataTable'
                                data={courseList}
                                expandableRows={getCookieUserData().role === config.studentRole}
                                expandableRowsComponent={getCookieUserData().role === config.studentRole ? ExpandableTable : null}
                            />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default CourseInformation
