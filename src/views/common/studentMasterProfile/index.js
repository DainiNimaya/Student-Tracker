import React, {Fragment} from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, Input, UncontrolledTooltip} from 'reactstrap'
import {STUDENT_PROFILE_TABLE_COLUMN} from './tableData'
import './scss/_studentProfile.scss'
import {isNULL, getCookieUserData, getFirstTwoLetter} from '@utils'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar'
import {
    COLOR_STATUS,
    FILTERS,
    FILTER_TYPES,
    STUDENT_CSV_HEADER,
    STUDENT_PROFILE_VIEW_TYPES
} from '@const'
import {Eye, Info} from 'react-feather'
import CustomPagination from "@components/customPagination"
import rs from '@routes'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import Filter from "@components/filter"
import * as apiHaa from "@api/haa"
import * as apiItAdmin from "@api/itAdmin"
import * as apiCounselor from "@api/counsellor"
import config from '@storage'
import Cookies from "js-cookie"
import student from "../../../navigation/student"
import ConfirmBox from "@components/confirm-box"
import ExportMenu from '@components/export-menu'
import {basicInfo} from '@configs/basicInfomationConfig'

const all = {label: 'All', value: 'All'}
const registrationRole = [config.counsellorRole, config.hocRole]
let selectedStudentIds = []
let pagesDetailsStudents = []
const role = JSON.parse(Cookies.get(config.user)).role

class StudentProfiles extends React.Component {


    csvLinkEl = React.createRef()
    state = {
        // data: [{studentId:1,studentName:'Kamal Sooriyabandara',cbNumber:'CB-123-DE',studentMobile:'0775618631',studentEmail:'tim.jennings@example.com',batchCode:'23ww',courseName:'Integrated Law Course- BA + LL.B',uniId:'56'}],
        data: [],
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        offset: 0,
        numberOfElements: 0,
        courseOption: [],
        batchOption: [],
        counsellorOption: [],
        exportList: [],
        userId: getCookieUserData().userId,
        showFilter: false,
        isAllSelect: false,
        isSelectRow: false,
        generateIdButtonState: true,
        showModal: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.manageStudentProfiles}))
        } else if (this.props.filter.route !== rs.manageStudentProfiles) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.manageStudentProfiles}))
        }
        this.setState({showFilter: true})
        await this.loadDropdownData()
        await this.loadTableData(this.props.filter, 0)

        selectedStudentIds = []
        pagesDetailsStudents = []
        this.configArray()
        this.onSelect('PAGEH', this.state.currentPage)

    }

    popUpsBlockIdentifier = () => {
        const {detect} = require('detect-browser')
        const browser = detect()

        // handle the case where we don't detect the browser
        const workingBrowser = ['chrome', 'edge', 'edge-chromium', 'firefox']

        if (workingBrowser.includes(browser.name)) {
            const window1 = window.open(null, '')
            const window2 = window.open(null, '')
            try {
                window1.close()
                window2.close()

                return false
            } catch (e) {
                return true
            }
        } else {
            return false
        }
    }
    // openIdWindow = () => {
    //     return new Promise((resolve, reject) => {
    //         const newWindow = window.open(rs.frontIds, '_blank')
    //
    //         const checkWindowStatus = setInterval(() => {
    //             if (newWindow && newWindow.closed) {
    //                 clearInterval(checkWindowStatus)
    //                 resolve()
    //             }
    //         }, 1000)
    //         setTimeout(() => {
    //             clearInterval(checkWindowStatus)
    //             // reject(new Error('Window did not close within the specified time.'))
    //         }, 10000)
    //     })
    // }

    idCardPrintView = async () => {

        const response = await apiItAdmin.getStudentIdCardDetails(selectedStudentIds)

        if (response.status === 0 && response.body && response.body.length > 0) {
            this.props.history.push({
                pathname: rs.idCards,
                state: {
                    studentDetails: response.body
                }
            })
        }
    }


    configArray = () => {
        pagesDetailsStudents.length = this.state.totalPages

        for (let i = 0; i < pagesDetailsStudents.length; i++) {
            pagesDetailsStudents[i] = []
        }
    }

    loadDropdownData = async () => {
        const all = [{label: 'All', value: 'All'}]

        const url = `courses/restriction?userId=${this.state.userId}`
        const courseRsult = await apiCounselor.getAllCourses(url)
        const batchRsult = await apiHaa.getAllBatches()
        const counselorRsult = await apiCounselor.getAllCounselors(this.state.userId)

        this.setState({
            courseOption: [
                ...all, ...courseRsult.map(item => {
                    return {value: item.courseId, label: item.courseName}
                })
            ],
            batchOption: [
                ...all, ...batchRsult.map(item => {
                    return {value: item.batchId, label: item.batchCode}
                })
            ],
            counsellorOption: [...all, ...counselorRsult]
        })

    }

    loadTableData = async (data, page) => {
        const students = await apiHaa.getAllStudent(data, page, '', 10, true)
        if (students !== undefined && students.content !== undefined) {
            this.setState({
                data: students.content,
                totalPages: students.totalPages,
                totalElements: students.totalElements,
                offset: students.pageable.offset,
                numberOfElements: students.numberOfElements
            })
        }
    }

    onFilterHandler = async (data) => {
        await this.props.dispatch(handleFilter({...data, route: rs.manageStudentProfiles}))
        this.setState({currentPage: 0})
        this.loadTableData(data, 0)
    }

    handlePagination = async (val) => {
        await this.loadTableData(this.props.filter, val.selected)
        this.setState({
            currentPage: (val.selected)
        })
        this.onSelect('PAGEH', val.selected)
    }

    viewAction = (data) => {
        const details = {
            studentId: data.studentId,
            cb: data.cbNumber,
            inquiryId: data.inquiryId,
            paymentId: data.studentCoursePaymentPlanId,
            viewType: STUDENT_PROFILE_VIEW_TYPES.stepperView,
            batchId: data.batchId
        }
        sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(data))
        this.props.history.push({pathname: rs.studentProfileView, state: details})
    }

    exportAction = async (type, size, page, isGetPages) => {
        const student = await apiHaa.getAllStudent(this.props.filter,
            (page !== undefined ? page : this.state.currentPage),
            '',
            (size ? size : 10),
            !isGetPages)
        const temp = []
        if (student?.content?.length !== 0) {
            student.content.map(item => {
                item.studentMobile = item.studentMobile && item.studentMobile.replace('+94', '')

                let tempQual = ''
                item?.qualificationList.map((qual, qi) => {
                    tempQual += `${qi === 0 ? '' : ' / '} ${qual.qualificationName}`
                    qual?.results.map((result, ri) => {
                        tempQual += `${ri === 0 ? ' - (' : ', '} ${result.subjectName} -  ${result.result} ${(qual.results.length - 1 === ri ? ')' : '')}`
                    })
                })
                temp.push({
                    ...item,
                    qualifications: tempQual
                })
            })
            this.setState({exportList: temp})
        }
        return student
    }

    onSelect = (type, i, state) => {

        const rows = [...this.state.data]
        let countSelected = 0
        let selectAll = false
        let selectRow = false

        this.setState({isAllSelect: false})
        //pagesDetailsStudents[this.state.currentPage] = []

        if (type !== 'PAGEH') {
            pagesDetailsStudents[this.state.currentPage] = []
            //selectedStudentIds = []

            rows.map((item, index) => {
                //select All and unSelect All item
                if (type === 'ALL') {
                    item.select = !this.state.isAllSelect
                    selectAll = !this.state.isAllSelect
                    if (selectAll === true) {
                        pagesDetailsStudents[this.state.currentPage].push(item.studentId)
                        if (!selectedStudentIds.includes(item.studentId)) {
                            selectedStudentIds.push(item.studentId)
                        }
                    } else {
                        if (selectedStudentIds.includes(item.studentId)) {
                            const arrIndex = selectedStudentIds.indexOf(item.studentId)
                            selectedStudentIds.splice(arrIndex, 1)
                        }
                    }

                } else {
                    rows[i].select = state
                    //select and unSelect one item
                    if (item.select) {
                        countSelected = countSelected + 1
                        selectRow = true

                        if (!selectedStudentIds.includes(item.studentId)) {
                            selectedStudentIds.push(item.studentId)
                        }
                        pagesDetailsStudents[this.state.currentPage].push(item.studentId)

                    } else {

                        if (selectedStudentIds.includes(item.studentId)) {
                            const arrIndex = selectedStudentIds.indexOf(item.studentId)
                            selectedStudentIds.splice(arrIndex, 1)
                        }
                    }
                }
            })
            if (rows.length === countSelected) {
                selectAll = true
            }
            this.setState({data: rows, isAllSelect: selectAll, isSelectRow: selectRow})
        } else {

            if (pagesDetailsStudents[i] && pagesDetailsStudents[i].length > 0) {
                rows.map((item, index) => {
                    if (pagesDetailsStudents[i].includes(item.studentId)) {
                        rows[index].select = true
                        // selectedStudentIds.push(pagesDetailsStudents[i][index])
                        countSelected = countSelected + 1
                    }
                })
                if (rows.length === countSelected) {
                    selectAll = true
                }
                this.setState({data: rows, isAllSelect: selectAll, isSelectRow: selectRow})
            }
        }
        if (selectedStudentIds.length > 0) {
            this.setState({generateIdButtonState: false})
        } else {
            this.setState({generateIdButtonState: true})
        }

    }

    /* onSelect = (type, i, state) => {
         const rows = [...this.state.data]
         let countSelected = 0
         let selectAll = false
         let selectRow = false
         selectedStudentIds = []

         rows.map((item,index) => {
             if (type === 'ALL') {
                 item.select = !this.state.isAllSelect
                 selectAll = !this.state.isAllSelect
                 if (selectAll === true) {
                     selectedStudentIds.push(item.studentId)
                     //this.setState({selectedStudentIds : [...this.state.selectedStudentIds, item]})

                 }

             } else {
                 rows[i].select = state
                 if (item.select) {
                     countSelected = countSelected + 1
                     selectRow = true
                     selectedStudentIds.push(item.studentId)
                     //this.setState({selectedStudentIds : [...this.state.selectedStudentIds, item]})
                 }

             }
         })
         if (selectedStudentIds.length > 0) {
             this.setState({generateIdButtonState : false})
         } else {
             this.setState({generateIdButtonState : true})
         }

         if (rows.length === countSelected) {
             selectAll = true

         }

         this.setState({data: rows, isAllSelect: selectAll, isSelectRow: selectRow})
     }*/


    render() {

        const {
            currentPage,
            totalElements,
            totalPages,
            offset,
            numberOfElements,
            data,
            counsellorOption,
            batchOption,
            courseOption
        } = this.state
        const tableData = []
        let count = 0

        if (data.length !== 0) {
            data.map((item, i) => {
                tableData.push({
                    select: <Input type={'checkbox'} checked={item.select}
                                   onClick={() => this.onSelect('SINGLE', i, !item.select)}/>,
                    name:
                        <div className="name-container">
                            <Avatar className={'Tbl_avatar'} color={`light-${COLOR_STATUS[count]}`}
                                    content={getFirstTwoLetter(item.studentName)}
                                    initials/>

                            <div className={'item-name'}>
                                <span id={`name${i}`}>{item.studentName}</span>
                                <span style={{fontWeight: 'normal'}}>{item.cbNumber}</span>
                            </div>
                        </div>,
                    contact: item.studentMobile === null && item.studentEmail === null ? 'N/A' : <div>
                        <p className="item-contact">{item.studentMobile}</p>
                        <span>{item.studentEmail}</span>
                    </div>,
                    batch: <div className={'tbl-data'}>{isNULL(item.batchCode) ? item.batchCode : 'N/A'}</div>,
                    course: <div className={'tbl-data'}>{isNULL(item.courseName) ? item.courseName : 'N/A'}</div>,
                    uniId: <div className={'tbl-data'}>{isNULL(item.uniId) ? item.uniId : 'N/A'}</div>,
                    action: <Button outline className={'edit-btn'} size={'sm'} color='primary'
                                    onClick={() => this.viewAction(item)}><Eye size={15}/> View</Button>
                })
                count > 5 ? count = 0 : count += 1
            })
        }

        return (
            <Fragment>
                <Card className={'student-profiles'}>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'
                                   className="heading">{registrationRole.includes(getCookieUserData().role) ? 'Registrations' : 'Student Master Profiles'}</CardTitle>
                        <div className='d-flex mt-md-0 mt-1'>
                            <ExportMenu
                                headers={STUDENT_CSV_HEADER}
                                filename={'student'}
                                data={this.state.exportList}
                                onClick={this.exportAction}
                                btnText={'Export'}
                                outline
                            />

                            {/*<Button className={'top-custom-btn'} color='primary' outline size={'sm'}*/}
                            {/*        onClick={() => this.exportAction()}>*/}
                            {/*    <Upload size={15}/>*/}
                            {/*    <span className='align-middle ml-50'> Export </span>*/}
                            {/*</Button>*/}
                            {/*<CSVLink data={this.state.exportList} filename={"student.csv"}*/}
                            {/*         headers={STUDENT_CSV_HEADER} ref={this.csvLinkEl}>*/}
                            {/*</CSVLink>*/}
                        </div>
                    </CardHeader>
                    <CardBody>
                        {
                            this.state.showFilter &&
                            <Filter
                                list={[
                                    {
                                        type: FILTER_TYPES.input,
                                        name: 'name',
                                        label: 'Name',
                                        placeholder: 'Search by Name',
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
                                        name: 'nicPassport',
                                        label: 'NIC/PP',
                                        placeholder: 'Search by NIC/PP',
                                        value: this.props.filter.nicPassport
                                    },
                                    {
                                        type: FILTER_TYPES.number,
                                        name: 'contact',
                                        label: 'Contact No',
                                        placeholder: 'Search by Contact Number',
                                        value: this.props.filter.contact
                                    },
                                    {
                                        type: FILTER_TYPES.dropDown,
                                        name: 'course',
                                        label: 'Course',
                                        placeholder: 'All',
                                        options: courseOption,
                                        value: this.props.filter.course
                                    },
                                    {
                                        type: FILTER_TYPES.dropDown,
                                        name: 'batch',
                                        label: 'Batch',
                                        placeholder: 'All',
                                        options: batchOption,
                                        value: this.props.filter.batch
                                    },
                                    {
                                        type: FILTER_TYPES.dropDown,
                                        name: 'counselor',
                                        label: ' Counselor',
                                        placeholder: 'All',
                                        options: counsellorOption,
                                        value: this.props.filter.counselor
                                    }
                                ]}
                                onFilter={this.onFilterHandler}
                            />
                        }

                        {this.state.data.length > 0 && role === config.itAManagerRole &&
                        <div className="mt-1 mb-1 d-flex justify-content-between align-items-center">
                            <div><Input type={'checkbox'} checked={this.state.isAllSelect}
                                        onClick={() => this.onSelect('ALL')}/> <span style={{marginLeft: 10}}>Select All</span>
                                <Info id="test" color='#ff5a68' style={{marginLeft: '5px', marginBottom: '3px'}}
                                      size={20}/> <UncontrolledTooltip placement='top' target={`test`}>
                                    This function only includes students in the current page. Can be used over
                                    multiple pages.
                                </UncontrolledTooltip>
                            </div>
                            <Button className={'top-custom-btn'} color='primary' outline size={'sm'}
                                    disabled={this.state.generateIdButtonState}
                                    onClick={() => this.idCardPrintView()}>
                                <svg width="17" height="14" viewBox="0 0 17 14" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M0.125 3.1875C0.125 2.44158 0.421316 1.72621 0.948762 1.19876C1.47621 0.671316 2.19158 0.375 2.9375 0.375H13.0625C13.8084 0.375 14.5238 0.671316 15.0512 1.19876C15.5787 1.72621 15.875 2.44158 15.875 3.1875V4.13363C15.5859 3.69938 15.2 3.33488 14.7466 3.07388C14.7178 2.64688 14.5278 2.24679 14.2152 1.95458C13.9025 1.66238 13.4905 1.49988 13.0625 1.5H2.9375C2.48995 1.5 2.06072 1.67779 1.74426 1.99426C1.42779 2.31072 1.25 2.73995 1.25 3.1875V8.8125C1.25 9.26005 1.42779 9.68928 1.74426 10.0057C2.06072 10.3222 2.48995 10.5 2.9375 10.5H8.05625C8.01913 10.6823 8 10.8701 8 11.0625C8 11.2504 8.01463 11.4383 8.04275 11.625H2.9375C2.19158 11.625 1.47621 11.3287 0.948762 10.8012C0.421316 10.2738 0.125 9.55842 0.125 8.8125V3.1875ZM9.87875 4.875C9.755 5.22712 9.6875 5.60625 9.6875 6H4.0625C3.91332 6 3.77024 5.94074 3.66475 5.83525C3.55926 5.72976 3.5 5.58668 3.5 5.4375C3.5 5.28832 3.55926 5.14524 3.66475 5.03975C3.77024 4.93426 3.91332 4.875 4.0625 4.875H9.87875ZM4.0625 2.625C3.91332 2.625 3.77024 2.68426 3.66475 2.78975C3.55926 2.89524 3.5 3.03832 3.5 3.1875C3.5 3.33668 3.55926 3.47976 3.66475 3.58525C3.77024 3.69074 3.91332 3.75 4.0625 3.75H7.4375C7.58668 3.75 7.72976 3.69074 7.83525 3.58525C7.94074 3.47976 8 3.33668 8 3.1875C8 3.03832 7.94074 2.89524 7.83525 2.78975C7.72976 2.68426 7.58668 2.625 7.4375 2.625H4.0625ZM4.0625 7.125C3.91332 7.125 3.77024 7.18426 3.66475 7.28975C3.55926 7.39524 3.5 7.53832 3.5 7.6875C3.5 7.83668 3.55926 7.97976 3.66475 8.08525C3.77024 8.19074 3.91332 8.25 4.0625 8.25H8.5625C8.71168 8.25 8.85476 8.19074 8.96025 8.08525C9.06574 7.97976 9.125 7.83668 9.125 7.6875C9.125 7.53832 9.06574 7.39524 8.96025 7.28975C8.85476 7.18426 8.71168 7.125 8.5625 7.125H4.0625ZM15.3125 6C15.3125 6.59674 15.0754 7.16903 14.6535 7.59099C14.2315 8.01295 13.6592 8.25 13.0625 8.25C12.4658 8.25 11.8935 8.01295 11.4715 7.59099C11.0496 7.16903 10.8125 6.59674 10.8125 6C10.8125 5.40326 11.0496 4.83097 11.4715 4.40901C11.8935 3.98705 12.4658 3.75 13.0625 3.75C13.6592 3.75 14.2315 3.98705 14.6535 4.40901C15.0754 4.83097 15.3125 5.40326 15.3125 6ZM17 11.0625C17 12.4631 15.875 13.875 13.0625 13.875C10.25 13.875 9.125 12.4688 9.125 11.0625C9.125 10.6149 9.30279 10.1857 9.61926 9.86926C9.93572 9.55279 10.3649 9.375 10.8125 9.375H15.3125C15.7601 9.375 16.1893 9.55279 16.5057 9.86926C16.8222 10.1857 17 10.6149 17 11.0625Z"
                                        className="idIcon"/>
                                </svg>
                                <span className='align-middle ml-50'> Generate ID </span>
                            </Button>
                        </div>}

                        <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                pagination
                                data={tableData}
                                columns={STUDENT_PROFILE_TABLE_COLUMN}
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

                            />
                        </div>

                    </CardBody>
                </Card>


                <ConfirmBox
                    isOpen={this.state.showModal}
                    toggleModal={() => this.setState({showModal: false})}
                    noBtnClick={() => this.setState({showModal: false})}
                    yesBtnClick={async () => {
                        await this.idCardPrintView()


                    }}
                    title={<div className="title-danger" style={{marginLeft: '10px'}}>Pop-Ups Blocked</div>}
                    message={
                        <div className="d-flex flex-column">
                            <ul id="guide" className="popup-guide mb-3">
                                <li>Click the three-dot menu in the top-right corner and select "Settings".</li>
                                <li>Scroll down and click on "Privacy and security".</li>
                                <li>Under "Site Settings", click on "Pop-ups and redirects".</li>
                                <li>Toggle the switch to allow or block pop-ups and redirects.</li>
                            </ul>

                            <span className="title-danger">Do the above and try again.</span>
                        </div>
                    }
                    noBtn='Close'
                    yesBtn={'Try Again'}

                />
            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(StudentProfiles)
