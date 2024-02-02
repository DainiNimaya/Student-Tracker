import React, {Component} from "react"
import './scss/_studentProfile.scss'
import {Award, Plus, Edit, HelpCircle, Home, X} from "react-feather"
import {Badge, Button, CardHeader, Col, Row} from "reactstrap"
import DataTable from "react-data-table-component"
import {
    QUALIFICATION_TABLE_COLUMN,
    QUALIFICATION_EDIT_TABLE_COLUMN,
    STUDENT_QUALIFICATION_TABLE_COLUMN
} from './tableData'
import * as Api from '@api/haa'
import {STUDENT_QUALIFICATION_STATUS, COLOR_STATUS, EMPTY_FILE} from '@const'
import {capitalize} from '@commonFunc'
import resultSheet from '../../../assets/images/counsellor/resultSheet.png'
import otherAttachment from '../../../assets/images/student/other-attachment.png'
import Cookies from "js-cookie"
import config from '@storage'
import {toast} from "react-toastify"
import QualificationModal from '@components/inquiry-prospect/sideModels/addQualification'
import ConfirmBox from "@components/confirm-box"
import FilePreview from "../file-preview"
import {qualification} from '@configs/studentMasterProfileConfig'
import UpdateOfferModal from "./sideModals/updateOfferModal"
import {accessList} from '@configs/basicInfomationConfig'
import {getCookieUserData} from "@utils"
import {SMPSendOfferLetterButtonAccessRole} from "../../../configs/basicInfomationConfig"
import themeConfig from '@configs/themeConfig'

const role = JSON.parse(Cookies.get(config.user)).role

class Qualification extends Component {

    state = {
        qualifications: [],
        role: JSON.parse(Cookies.get(config.user)).role,
        isQualificationModal: false,
        selectedQualification: null,
        isQualConform: false,
        qualificationState: null,
        selectedQual: null,
        isOfferLetterModal: false,
        selectedOffer: null
    }

    componentWillMount() {
        this.getAllQualifications()
    }

    getAllQualifications = async () => {
        const studentId = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const res = await Api.getQualificationsByStudentId(studentId)
        if (res.length > 0) {
            await this.setState({qualifications: res})
        }
    }

    updateQualificationStatus = async (state, qual) => {
        const studentId = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const data = {status: state}
        const res = await Api.updateQualificationByStudentIdAndQualificationId(studentId, qual.qualificationId, data)
        if (res) {
            await this.setState({isQualConform: false})
            toast.success(res.message, {icon: true, hideProgressBar: true})
            await this.getAllQualifications()
        }
    }

    editQualification = (qual) => {
        const data = {
            school: qual.school,
            qualification: qual.qualification,
            indexNo: qual.indexNo,
            level: qual.level,
            year: qual.year,
            comment: qual.comment,
            results: qual.results,
            otherAttachment: qual.otherAttachment,
            transcript: qual.transcript,
            qualificationId: qual.qualificationId
        }
        this.setState({isQualificationModal: true, selectedQualification: data})
    }

    qualificationConfirm = (state, data) => {
        this.setState({isQualConform: true, qualificationState: state, selectedQual: data})
    }

    checkAccessLevel = (data) => {
        return data.users.includes(role)
    }

    updateOfferHandler = (state, data) => {
        this.setState({isOfferLetterModal: state, selectedOffer: data})
    }

    checkOfferLetterButtonShow = () => {
        let show = false
        if (this?.props?.props?.props?.location?.state?.isPendingQualification) {
            const user = getCookieUserData()
            if (SMPSendOfferLetterButtonAccessRole.includes(user.role)) show = true
        }
        return show
    }

    render() {
        const mobile = window.innerWidth <= 991
        const isAllowEdit = this.props.props.edit
        const qualifications = []
        let approvedCount = 0
        this.state.qualifications.map(item => {
            if (item.status === STUDENT_QUALIFICATION_STATUS.approved) approvedCount += 1
            const data = {
                ...item,
                item,
                institution: item.school,
                status: <Badge
                    color={`light-${item.status === STUDENT_QUALIFICATION_STATUS.pending ? COLOR_STATUS[2]
                        : item.status === STUDENT_QUALIFICATION_STATUS.approved ? COLOR_STATUS[0]
                            : item.status === STUDENT_QUALIFICATION_STATUS.rejected ? COLOR_STATUS[1]
                                : COLOR_STATUS[6]}`}
                    pill>{item.status ? capitalize(item.status.replaceAll('_', ' ').toLowerCase()) : 'N/A'}</Badge>,
                actions: <Button style={{width: 90}} size={'sm'} color={'primary'} outline
                                 onClick={() => this.editQualification(item)}
                                 disabled={!(isAllowEdit && this.checkAccessLevel(qualification.editQualification))}
                ><Edit
                    size={15}/> Edit</Button>
            }

            if (isAllowEdit) {
                data['grade'] = item.pass ? item.pass : 'N/A'
            }

            // if (item.status === STUDENT_QUALIFICATION_STATUS.approved && STATUS_ACCESS_LIST.includes(role)) {
            //     qualifications.push(data)
            // } else if (!STATUS_ACCESS_LIST.includes(role)) {
            //     qualifications.push(data)
            // }
            qualifications.push(data)
        })

        const student = JSON.parse(sessionStorage.getItem('STUDENT_DETAILS'))

        const ExpandableTable = ({data}) => {
            return (<div className={'expandable-content expand-qualification'}>
                <Row style={{width: '100%'}}>
                    <Col md={6}>
                        <div className={'lbl-container'}>
                            <span className={'lbl-title'}>Index No: </span>
                            <span>{data.indexNo}</span>
                        </div>

                        <div className={'lbl-container'}>
                            <span className={'lbl-title'}>{isAllowEdit ? 'Stream' : 'Level'}: </span>
                            <span>{capitalize(data.level.replaceAll('_', ' ').toLowerCase())}</span>
                        </div>

                        {/*{isAllowEdit && <div className={'lbl-container'}>*/}
                        {/*    <span className={'lbl-title'}>State/Province: </span>*/}
                        {/*    <span>{data.stateProvince ? data.stateProvince : 'N/A'}</span>*/}
                        {/*</div>}*/}

                        {/*<div className={'lbl-container'}>*/}
                        {/*    <span className={'lbl-title'}>State/Province: </span>*/}
                        {/*    <span>{data.stateProvince ? data.stateProvince : 'N/A'}</span>*/}
                        {/*</div>*/}

                        {/*{isAllowEdit && <div className={'lbl-container'}>*/}
                        {/*    <span className={'lbl-title'}>Z Score: </span>*/}
                        {/*    <span>{data.zScore ? data.zScore : 'N/A'}</span>*/}
                        {/*</div>}*/}

                        {/*<div className={'lbl-container'}>*/}
                        {/*    <span className={'lbl-title'}>Z Score: </span>*/}
                        {/*    <span>{data.zScore ? data.zScore : 'N/A'}</span>*/}
                        {/*</div>*/}

                        <div className={'lbl-container'}>
                            <span className={'lbl-title'}>Results: </span>
                            <Row>
                                {
                                    data.results.length > 0 ? data.results.map(item => <Col md={4}>
                                        <span className={'lbl-title-result'}>{item.subjectName}: </span>
                                        <span>{item.result}</span>
                                    </Col>) : <Col md={4}>N/A</Col>
                                }
                            </Row>
                        </div>

                        {/*{!isAllowEdit && <div className={'lbl-container-comment'}>*/}
                        {/*    <span className={'lbl-title'}>Special Comment: </span>*/}
                        {/*    <span>{data.comment ? data.comment : 'N/A'}</span>*/}
                        {/*</div>} */}

                        <div className={'lbl-container-comment'}>
                            <span className={'lbl-title'}>Special Comment: </span>
                            <span>{data.comment ? data.comment : 'N/A'}</span>
                        </div>
                    </Col>

                    <Col md={6} style={{paddingRight: 8}}>
                        {/*{isAllowEdit && <div className={'lbl-container'}>*/}
                        {/*    <span className={'lbl-title'}>School: </span>*/}
                        {/*    <span>{data.school ? data.school : 'N/A'}</span>*/}
                        {/*</div>}*/}

                        <div className={'lbl-container'}>
                            <span className={'lbl-title'}>School: </span>
                            <span>{data.school ? data.school : 'N/A'}</span>
                        </div>

                        <div className={'attachment-container'}>
                            <span className={'lbl-title'}>Certificate or Transcript:</span>
                            {data.transcript ? <FilePreview path={data.transcript}/> :
                                <img width={105} className={'img-attachment'}
                                     src={EMPTY_FILE}/>}

                            {this.state.role !== undefined && this.state.role !== config.studentRole && this.state.role !== config.haaRole && (!isAllowEdit && this.checkAccessLevel(qualification.approveReject)) &&
                                <div align={'right'} style={{width: '100%'}}>
                                    {data.item.status === 'PENDING' && <><Button style={{width: 90}} size={'sm'}
                                                                                 color={'primary'}
                                                                                 onClick={() => this.qualificationConfirm('APPROVED', data)}
                                    >Approve</Button>
                                        <br/>
                                        <Button style={{width: 90}} size={'sm'} className={'mt-1'} outline
                                                color={'danger'}
                                                onClick={() => this.qualificationConfirm('REJECTED', data)}
                                        >Reject</Button>
                                    </>}
                                </div>}
                        </div>

                        <div className={'attachment-container'}>
                            <span className={'lbl-title'}>Other Attachment:</span>
                            {data.otherAttachment ? <FilePreview path={data.otherAttachment}/> :
                                <img width={105}
                                     className={'img-attachment'}
                                     src={EMPTY_FILE}/>}
                        </div>
                    </Col>
                </Row>
            </div>)
        }

        return <>
            <div className={'qualifications'}>
                <CardHeader className="p-0 mb-1">
                    <h4><Award size={20}/> Qualifications</h4>
                    <div>
                        {this.checkOfferLetterButtonShow() &&
                            <Button className={mobile && "me-1"} style={{marginRight: 10}} size={'sm'} color={'primary'}
                                    onClick={() => this.setState({...this.state, isOfferLetterModal: true})}
                                    disabled={!((this?.props?.props?.props?.location?.state?.isPendingQualification) && approvedCount > 0)}
                            >
                                {mobile ? 'Send Offer' : 'Send Offer Letter'}
                            </Button>}

                        {this.checkAccessLevel(qualification.editQualification) &&
                            <Button className={mobile && "me-1"} size={'sm'} color={'primary'}
                                    onClick={() => this.setState({isQualificationModal: true})}>
                                {mobile ? '+ Add' : '+ Add Qualification'}
                            </Button>}
                        {
                            mobile &&
                            <X onClick={() => this.props.onClose()} id={'close-icon'}/>
                        }
                    </div>
                </CardHeader>

                <div className='react-dataTable'>
                    <DataTable
                        noHeader
                        // columns={this.state.role !== undefined && this.state.role === 'STUDENT' ? STUDENT_QUALIFICATION_TABLE_COLUMN :
                        //     this.state.role !== 'STUDENT' && !isAllowEdit ? QUALIFICATION_TABLE_COLUMN : QUALIFICATION_EDIT_TABLE_COLUMN}
                        columns={this.state.role !== undefined && this.state.role === 'STUDENT' ? STUDENT_QUALIFICATION_TABLE_COLUMN :
                            this.state.role !== 'STUDENT' && !isAllowEdit ? QUALIFICATION_TABLE_COLUMN : QUALIFICATION_TABLE_COLUMN}
                        paginationPerPage={10}
                        className='react-dataTable'
                        data={qualifications}
                        expandableRows
                        expandableRowsComponent={ExpandableTable}
                    />
                </div>
            </div>

            {this.state.isQualificationModal && <QualificationModal
                open={true}
                selectedQualification={this.state.selectedQualification}
                toggleOpen={() => this.setState({isQualificationModal: false, selectedQualification: null})}
                loadQualifications={this.getAllQualifications}
                inquiryId={student.inquiryId}
                isMasterProfile={true}
            />}

            <ConfirmBox
                isOpen={this.state.isQualConform}
                toggleModal={() => this.setState({isQualConform: false})}
                yesBtnClick={() => this.updateQualificationStatus(this.state.qualificationState, this.state.selectedQual)}
                noBtnClick={() => {
                    this.setState({isQualConform: false})
                }}
                title={'Confirmation'}
                message={'Are you sure do you want to change it?'}
                yesBtn="Yes"
                noBtn="No"
                icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
            />

            {
                this.state.isOfferLetterModal && <UpdateOfferModal
                    isOpen={this.state.isOfferLetterModal}
                    toggleOpen={this.updateOfferHandler}
                    props={this.props}
                    refresh={this.getAllQualifications}
                    selectedValue={this.state.selectedOffer}
                    disableType
                    smpQualification
                />
            }
        </>
    }
}

export default Qualification
