import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    Row,
    Col,
    Badge,
    Input,
    Label,
    UncontrolledTooltip
} from 'reactstrap'
import {X, Edit, HelpCircle, MinusCircle, Upload, Eye} from "react-feather"
import './scss/_configuration.scss'
import DataTable from "react-data-table-component"
import SideBar from "./commonSidebar"
import moment from 'moment'
import ConfirmBox from "@components/confirm-box"
import {HOLIDAY_TYPES, HOLIDAY_CSV_HEADER} from '@const'
import {DatePicker} from "antd"
import CustomPagination from "@components/customPagination"
import * as apiHaa from '@api/haa'
import * as apiItAdmin from '@api/itAdmin'
import {getCookieUserData, findObject} from '@utils'
import config from '@storage'
import ExportMenu from '@components/export-menu'
import Switch from "@components/switch"
import themeConfig from '@configs/themeConfig'

class Configurations extends React.Component {

    state = {
        sidebar: false,
        sidebarData: {},
        confirmModal: false,
        confirmationData: '',
        exportList: [],
        modalType: '',
        modalMsg: ''
    }


    addAction = (type) => {
        let data = {}
        switch (type) {
            case 'INTAKE':
                data = {type: this.props.type, title: 'Create an Intake', text1: 'Intake Name', text2: 'Intake Code'}
                break
            case 'ASSESSMENT':
                data = {type: this.props.type, title: 'Create Assessment Type', text1: 'Assessment Type', text2: ''}
                break
            case 'PROVIDE':
                data = {
                    type: this.props.type,
                    title: 'Create Provide Code',
                    text1: 'Provide Name',
                    text2: 'Provide Code'
                }
                break
            case 'LEVEL':
                data = {type: this.props.type, title: 'Create a Level', text1: 'Level', text2: ''}
                break
            case 'SEMESTER':
                data = {type: this.props.type, title: 'Create a Semester', text1: 'Semester'}
                break
            case 'VENUE':
                data = {
                    type: this.props.type,
                    title: 'Create a Venue',
                    text1: 'Venue Name',
                    text2: 'Capacity',
                    text3: 'Branch'
                }
                break
            case 'HOLIDAY':
                data = {
                    type: this.props.type,
                    title: 'Create a Holiday',
                    text1: 'Holiday Name',
                    text2: 'Holiday Type',
                    text3: 'Year',
                    text4: 'Date From'
                }
                break
            case 'SCHOOL':
                data = {type: this.props.type, title: 'Create a School', text1: 'School Name', text2: 'Description'}
                break
            case 'BRANCH':
                data = {type: this.props.type, title: 'Create a Branch', text1: 'Branch Name', text2: 'Branch Address'}
                break
            case 'BANK':
                data = {
                    type: this.props.type,
                    title: 'Create a Bank',
                    text1: 'Bank Name',
                    text2: 'Account Number',
                    text3: 'Branch Name',
                    text4: 'SWIFT Code',
                    text5: 'Bank Code',
                    text6: 'Account Type'
                }
                break
        }
        this.setState({sidebar: true, sidebarData: data})
    }

    editRemoveAction = (eData, type, isEdit) => {
        let data = {}
        let edit = {}
        let msg = ''
        let deleteId = 0
        switch (type) {
            case 'INTAKE':
                if (isEdit) {
                    edit = {
                        id: eData.intakeId,
                        text1: eData.intakeName,
                        text2: eData.intakeCode,
                        text3: '',
                        text4: '',
                        ongoing: eData.ongoing
                    }
                    data = {
                        type: this.props.type,
                        title: 'Update Intake',
                        text1: 'Intake Name',
                        text2: 'Intake Code',
                        editData: edit
                    }
                } else {
                    msg = `Are you sure, you want to remove ${eData.intakeName}`
                    deleteId = eData.intakeId
                }
                break
            case 'ASSESSMENT':
                if (isEdit) {
                    edit = {
                        id: eData.configAssessmentTypeId,
                        text1: eData.assessmentTypeName,
                        text2: '',
                        text3: '',
                        text4: '',
                        examType: eData.examType
                    }
                    data = {
                        type: this.props.type,
                        title: 'Update Assessment Type',
                        text1: 'Assessment Type',
                        text2: '',
                        editData: edit
                    }
                } else {
                    msg = `Are you sure, you want to remove ${eData.assessmentTypeName}`
                    deleteId = eData.configAssessmentTypeId
                }
                break
            case 'PROVIDE':
                if (isEdit) {
                    edit = {
                        id: eData.providerCodeId,
                        text1: eData.providerName,
                        text2: eData.providerCode,
                        text3: '',
                        text4: ''
                    }
                    data = {
                        type: this.props.type,
                        title: 'Update Provide Code',
                        text1: 'Provide Name',
                        text2: 'Provide Code',
                        editData: edit
                    }
                } else {
                    msg = `Are you sure, you want to remove ${eData.providerName}`
                    deleteId = eData.providerCodeId
                }
                break
            case 'LEVEL':
                if (isEdit) {
                    edit = {id: eData.value, text1: eData.label, text2: '', text3: '', text4: ''}
                    data = {type: this.props.type, title: 'Update Level', text1: 'Level', text2: '', editData: edit}
                } else {
                    msg = `Are you sure, you want to remove ${eData.label}`
                    deleteId = eData.value
                }
                break
            case 'SEMESTER':
                if (isEdit) {
                    edit = {id: eData.semesterId, text1: eData.semesterName, text2: '', text3: '', text4: ''}
                    data = {type: this.props.type, title: 'Update Semester', text1: 'Semester', editData: edit}
                } else {
                    msg = `Are you sure, you want to remove ${eData.semesterName}`
                    deleteId = eData.semesterId
                }
                break
            case 'VENUE':
                if (isEdit) {
                    edit = {
                        id: eData.venueId,
                        text1: eData.venueName,
                        text2: eData.capacity,
                        text3: eData.branchId === 0 ? '' : {value: eData.branchId, label: eData.branchName},
                        text4: ''
                    }
                    data = {
                        type: this.props.type,
                        title: 'Update a Venue',
                        text1: 'Name',
                        text2: 'Capacity',
                        text3: 'Branch',
                        editData: edit
                    }
                } else {
                    msg = `Are you sure, you want to remove ${eData.venueName}`
                    deleteId = eData.venueId
                }
                break
            case 'HOLIDAY':
                if (isEdit) {
                    edit = {
                        id: eData.holidayId,
                        text1: eData.holidayName,
                        text2: findObject(HOLIDAY_TYPES, eData.holidayType),
                        text3: eData.year,
                        text4: [new Date(eData.dates[0]), new Date(eData.dates[eData.dates.length - 1])]
                    }
                    data = {
                        type: this.props.type,
                        title: 'Update a Holiday',
                        text1: 'Holiday Name',
                        text2: 'Holiday Type',
                        text3: 'Year',
                        text4: 'Date From',
                        editData: edit
                    }
                } else {
                    msg = `Are you sure, you want to remove ${eData.holidayName}`
                    deleteId = eData.holidayId
                }
                break
            case 'SCHOOL':
                if (isEdit) {
                    edit = {id: eData.value, text1: eData.label, text2: eData.desc, text3: '', text4: ''}
                    data = {
                        type: this.props.type,
                        title: 'Update a School',
                        text1: 'School Name',
                        text2: 'Description',
                        editData: edit
                    }
                } else {
                    msg = `Are you sure, you want to remove ${eData.label}`
                    deleteId = eData.value
                }
                break
            case 'BRANCH':
                if (isEdit) {
                    edit = {id: eData.value, text1: eData.label, text2: eData.branchAddress, text3: '', text4: ''}
                    data = {type: this.props.type, title: 'Update a Branch', text1: 'Branch Name', text2: 'Branch Address', editData: edit}
                } else {
                    msg = `Are you sure, you want to remove ${eData.branchName}`
                    deleteId = eData.value
                }
                break
            case 'BANK':
                if (isEdit) {
                    edit = {
                        id: eData.value,
                        text1: eData.label,
                        text2: eData.accountNumber,
                        text3: eData.branch,
                        text4: eData.swiftCode,
                        text5: eData.bankCode,
                        text6: eData.accountType
                    }
                    data = {
                        type: this.props.type,
                        title: 'Update Bank',
                        text1: 'Bank Name',
                        text2: 'Account Number',
                        text3: 'Branch Name',
                        text4: 'SWIFT Code',
                        text5: 'Bank Code',
                        text6: 'Account Type',
                        editData: edit
                    }

                }
                break
        }

        isEdit ? this.setState({sidebar: true, sidebarData: data}) :
            this.setState({
                confirmModal: !this.state.confirmModal,
                confirmationData: deleteId,
                modalType: this.props.type === 'HOLIDAY' ? 'DELETE_HOLIDAY' :
                    this.props.type === 'BRANCH' ? 'DELETE_BRANCH' :
                        this.props.type === 'SCHOOL' ? 'DELETE_SCHOOL' : 'DELETE_CONFIG',
                modalMsg: msg
            })
    }

    closeAction = (data) => {
        switch (data.type) {
            case 'close' :
                this.setState({sidebar: false})
                break
            case 'saved' :
                if (this.props.handleDatepicker) this.props.handleDatepicker()
                this.setState({sidebar: false})
                this.props.type !== 'HOLIDAY' ? this.props.loadFunction() : this.props.loadFunction(null, 0)
                break
        }

    }

    handleConfirmModal = (data, type, msg) => {
        this.setState({
            confirmModal: !this.state.confirmModal,
            confirmationData: data,
            modalType: type,
            modalMsg: msg
        })
    }

    handleConfirmYes = async () => {
        let result = 1
        switch (this.state.modalType) {
            case 'INTAKE_STATUS' :
                result = await this.props.handleOngoing(this.state.confirmationData)
                if (result === 0) {
                    this.handleConfirmModal('', '', '')
                }
                break
            case 'DELETE_HOLIDAY' :
                result = await apiHaa.deleteHoliday(this.state.confirmationData)
                if (result === 0) {
                    this.handleConfirmModal('', '', '')
                    this.props.loadFunction(null, 0)
                }
                break
            case 'DELETE_CONFIG' :
                result = await apiHaa.deleteConfig({type: this.props.type, id: this.state.confirmationData})
                if (result === 0) {
                    this.handleConfirmModal('', '', '')
                    this.props.loadFunction()
                }
                break
            case 'DELETE_BRANCH' :
                result = await apiItAdmin.deleteBranch(this.state.confirmationData)
                if (result === 0) {
                    this.handleConfirmModal('', '', '')
                    this.props.loadFunction()
                }
                break
            case 'DELETE_SCHOOL' :
                result = await apiHaa.deleteSchool(this.state.confirmationData)
                if (result === 0) {
                    this.handleConfirmModal('', '', '')
                    this.props.loadFunction()
                }
                break
        }
    }

    changeVisibility = async (item) => {
        const result = await apiHaa.createEditConfig({
            ...item,
            type: 'BANK',
            name: item.bankName,
            code: item.bankCode,
            visibility: !item.visibility
        })
        if (result === 0) this.props.loadFunction()
    }

    render() {
        const {
            headerLbl,
            btnLbl,
            tblHeader,
            tblData,
            type,
            currentPage,
            numberOfElements,
            totalElements,
            totalPages,
            offset
        } = this.props
        const {sidebar, sidebarData, confirmModal, confirmationData, modalMsg} = this.state
        const tableData = []
        const aaRole = getCookieUserData().role === config.aaRole

        if (tblData.length !== 0) {
            tblData.map((item, i) => {
                let courses = ''
                let holidayType = 'N/A'
                if (type === 'PROVIDE') {
                    if (item.assignedCourses.length !== undefined && item.assignedCourses.length !== 0) {
                        let temp = ''
                        item.assignedCourses.map(course => {
                            temp = `${temp}, ${course.courseName}`
                        })
                        courses = <>
                            <div id={`positionBottom${i}`}
                                 className={temp.length > 30 ? 'cursor-pointer' : ''}>{temp.length > 30 ? `${temp.substring(1, 30)}...` : temp.substring(1)}</div>
                            {
                                temp.length > 30 &&
                                <UncontrolledTooltip placement='bottom' target={`positionBottom${i}`}>
                                    <div>{temp.substring(1)}</div>
                                </UncontrolledTooltip>
                            }
                        </>
                    }
                }

                if (item.holidayType && item.holidayType !== null && item.holidayType !== '') {
                    holidayType = findObject(HOLIDAY_TYPES, item.holidayType).label
                }


                tableData.push({
                    code: item.intakeCode ? item.intakeCode : 'N/A',
                    name: item.intakeName ? item.intakeName : 'N/A',
                    bankName: item.bankName ? item.bankName : 'N/A',
                    bankCode: item.bankCode ? item.bankCode : 'N/A',
                    swiftCode: item.swiftCode ? item.swiftCode : 'N/A',
                    accountType: item.accountType ? item.accountType : 'N/A',
                    accountNumber: item.accountNumber ? item.accountNumber : 'N/A',
                    noOfStudents: item.noOfStudents !== null ? item.noOfStudents : `N/A`,
                    createdDate: item.createdDate ? moment(item.createdDate).format('DD/MM/YYYY') : `N/A`,
                    assessmentType: item.assessmentTypeName,
                    pCode: item.providerCode ? item.providerCode : 'N/A',
                    pName: item.providerName ? item.providerName : 'N/A',
                    levelType: item.label ? item.label : `N/A`,
                    semesterName: item.semesterName ? item.semesterName : `N/A`,
                    venueName: item.venueName ? item.venueName : `N/A`,
                    branchAddress: item.branchAddress ? item.branchAddress : `N/A`,
                    capacity: item.capacity ? item.capacity : `N/A`,
                    branch: item.branchName ? item.branchName : item.branch ? item.branch : `N/A`,
                    course: courses === '' ? 'N/A' : courses,
                    creationDate: item.creationDate ? moment(item.creationDate).format('DD/MM/YYYY') : `N/A`,
                    action: <>
                        <Button color='primary' outline size='sm'
                                onClick={() => this.editRemoveAction(item, type, true)}><Edit size={13}/> Edit</Button>
                        {
                            type === 'BANK' &&
                            <Button className="ms-1" color={item.visibility ? 'danger' : 'primary'} outline size='sm'
                                    onClick={() => this.changeVisibility(item)}><Eye
                                size={13}/> {item.visibility ? 'Hide' : "Show"}</Button>
                        }
                    </>,
                    data: item,
                    intakeStatus: <Switch checked={item.ongoing}
                                          onChangeAction={() => this.handleConfirmModal(item, 'INTAKE_STATUS', `Are you sure, you want to change the status of ${item.intakeName !== null ? `${item.intakeName} - ` : ``}${item.intakeCode}`)}/>,
                    holidayName: item.holidayName ? item.holidayName : `N/A`,
                    holidayType,
                    year: item.year ? item.year : `N/A`,
                    from: item.dates && item.dates.length !== 0 ? item.dates[0] : `N/A`,
                    to: item.dates && item.dates.length !== 0 ? item.dates[item.dates.length - 1] : `N/A`,
                    /*remove: <MinusCircle className={'remove-icon'}
                                         onClick={() => this.editRemoveAction(item, type, false)}/>,*/
                    schoolName: item.label ? item.label : `N/A`,
                    schoolDesc: item.desc === undefined || item.desc === '' || item.desc === null ? `N/A` : <>
                        <div id={`positionBottom${i}`}
                             className={item.desc.length > 45 ? 'cursor-pointer' : ''}>{item.desc.length > 45 ? `${item.desc.substring(0, 45)}...` : item.desc}</div>
                        {
                            item.desc.length > 45 &&
                            <UncontrolledTooltip placement='bottom' target={`positionBottom${i}`}>
                                <div>{item.desc}</div>
                            </UncontrolledTooltip>
                        }
                    </>
                })
            })
        }

        const ExpandableTable = ({data}) => {

            let batches = ''
            let courses = ''
            if (type === 'INTAKE' && data.data.assignedBatched.length !== 0) {
                data.data.assignedBatched.map(batch => {
                    batches = `${batches}/${batch}`
                })
            }

            if (type === 'INTAKE') {
                data.data.courseName.length !== 0 && data.data.courseName.map(course => {
                    courses = `${courses}, ${course}`
                })
            }

            return (
                <div className='expandable-content p-2'>
                    <Row>
                        {
                            type === 'INTAKE' && <>
                                <Col lg={5}>
                                    <p>
                                        <span
                                            className='fw-bold'>Courses: </span> {courses ? courses.substring(1) : 'N/A'}
                                    </p>
                                </Col>
                                <Col lg={6}>
                                    <p>
                                        <span
                                            className='fw-bold'>Assigned Batches: </span> {batches !== '' ? batches.substring(1) : `N/A`}
                                    </p>
                                </Col>
                            </>
                        }
                        {
                            type === 'HOLIDAY' && <>
                                <Col lg={12}>
                                    <p>
                                        <span
                                            className='fw-bold'>Description: </span> {data.data.description ? data.data.description : 'N/A'}
                                    </p>
                                </Col>
                            </>
                        }
                    </Row>
                </div>
            )
        }

        return (
            <div>
                <Card className={'configuration-div'}>
                    <CardHeader className='border-bottom'>
                        <Row>
                            <Col xs={3} className='m-auto'><h4 className='m-0 title-header-data'>{headerLbl}</h4></Col>
                            <Col xs={3}>
                                {
                                    type === 'HOLIDAY' && <>
                                        <span>Year</span>
                                        <DatePicker
                                            picker="year"
                                            onChange={this.props.handleDatepicker}
                                            value={this.props?.year ? moment(this.props.year) : null}
                                        />
                                    </>
                                }
                            </Col>
                            <Col xs={6} className='text-align-right'>
                                <div className={'add-div'}>
                                    {
                                        !aaRole &&
                                        <Button color='primary' size='sm' style={{height: 'auto'}}
                                                onClick={() => this.addAction(type)}>{btnLbl}</Button>
                                    }
                                    {
                                        type === 'HOLIDAY' &&
                                        <>
                                            <div className="ms-1 height-auto">
                                            <ExportMenu
                                                headers={HOLIDAY_CSV_HEADER}
                                                filename={'Holidays'}
                                                data={this.props.exportData}
                                                onClick={this.props.exportAction}
                                                btnText={'Export'}
                                                outline
                                            />
                                            </div>
                                            {/*<Button outline color='primary' size='sm' className="ms-1 height-auto"*/}
                                            {/*        onClick={() => this.props.exportAction()}>*/}
                                            {/*    <Upload size={15}/>*/}
                                            {/*    <span className='align-middle m-0'*/}
                                            {/*          style={{color: themeConfig.color.primary}}> Export</span>*/}
                                            {/*</Button>*/}
                                        </>
                                    }
                                    {/*<X onClick={() => this.props.props.history.goBack()} id={'close-icon'}/>*/}
                                </div>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <br/>
                        <div className='react-dataTable' id={type === 'INTAKE' ? 'tbl-height' : null}>
                            <DataTable
                                noHeader
                                columns={tblHeader}
                                className='react-dataTable'
                                pagination={type === 'HOLIDAY'}
                                paginationDefaultPage={currentPage + 1}
                                paginationComponent={() => CustomPagination({
                                    currentPage,
                                    numberOfElements,
                                    totalElements,
                                    totalPages,
                                    offset,
                                    handlePagination: page => this.props.handlePagination(page)
                                })}
                                data={tableData}
                                expandableRows={type === 'INTAKE'}
                                expandOnRowClicked={type === 'INTAKE'}
                                expandableRowsComponent={ExpandableTable}
                            />
                        </div>
                    </CardBody>
                </Card>
                {
                    sidebar && <SideBar open={sidebar} onClose={this.closeAction} data={sidebarData}/>
                }
                {
                    confirmModal &&
                    <ConfirmBox
                        isOpen={true}
                        toggleModal={() => this.handleConfirmModal('', '', '')}
                        yesBtnClick={() => this.handleConfirmYes()}
                        noBtnClick={() => this.handleConfirmModal('', '', '')}
                        title={`Confirmation`}
                        message={modalMsg}
                        yesBtn="Yes"
                        noBtn="No"
                        icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
                    />
                }
            </div>
        )
    }

}

export default Configurations
