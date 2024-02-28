import React from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row} from "reactstrap"
import './scss/_add-fee-scheme.scss'
import {selectThemeColors, showError, findObject, createPaymentPlanDataObj,
    createDiscountDataObj, createRepeatDataObj, createFeeSchemeDataObj, makeLevelAssessmentList} from '@utils'
import {X, Info, CreditCard, DollarSign, Divide, PlusCircle, Edit} from 'react-feather'
import PaymentPlans from './paymentPlans'
import {assignCourseValidation} from '@validations/headOfFinance'
import {assignCourseErrors} from '@formError/headOfFinance'

// service
import * as hofApi from '@api/hof'
import * as haaApi from '@api/haa'

import rs from '@routes'
import CourseSideBar from "./side-bar/assignIntakes"
import Required from "@components/required"
import {capitalize} from "@commonFunc"
import {FEE_TYPE} from '@const'
import cloneDeep from "lodash/cloneDeep"
import {PAYMENT_INTERVALS} from '@configs/authConfig'
import {toast} from "react-toastify"

class AddFeeScheme extends React.Component {

    state = {
        schemeName: '',
        schemeCode: '',
        schemeId: '',
        desc: '',
        paymentPlanList: [],
        courseOption: [],
        intakeOption: [],
        courseModal: false,
        confirmModal: false,
        error: assignCourseErrors,
        editMode: false
    }

    componentWillMount() {
        this.loadInitialData()
    }

    loadInitialData = async () => {
        if (this.props.props.location.state !== undefined && this.props.props.location.state.viewData !== null) {
            const data = await createFeeSchemeDataObj('VIEW', this.props.props.location.state.viewData, assessmentTypes, level)
            this.setState({
                schemeId:data.schemeId,
                schemeName: data.schemeName,
                schemeCode: data.schemeCode,
                desc: data.description,
                paymentPlanList: data.paymentStructures
            })
        }
    }


    onChangeAction = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    updateDataList = (type, data) => {
        switch (type) {
            case 'plan':
                this.setState({paymentPlanList: data})
                break
            case 'course':
                this.setState({ activatedCourse: data, viewactivatedCourse: data })
                break
            case 'intake':
                this.setState({ assignIntakes:data })
                break
        }

    }

    onDropDownHandler = async (type, e) => {
        switch (type) {
        }

    }

    handlePaymentPlan = () => {
        const {schemeName, schemeCode, desc, paymentPlanList} = this.state
        const res = assignCourseValidation(schemeName, schemeCode, awarding, desc, paymentPlanList)
        this.setState({error: res})
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }
        this.handleAssignCourse()
    }

    handleAssignCourse = () => {
        this.setState({courseModal: true})
    }

    handleConfirmModal = () => {
        this.setState({confirmModal: !this.state.confirmModal, courseModal: !this.state.courseModal})
    }

    closeModal = () => {
        this.setState({confirmModal: false, courseModal: false})
    }

    publishScheme = async () => {
        
    }

    handleEdit = () => {
       this.setState({ editMode: true })
    }

    removeLevelOrPlan = async (id, levelId, paymentPlanId) => {

        const validateDeleteCall = this.props.props.location.state === undefined ? true :
            await hofApi.deleteSchemeLevelOrPlan(levelId,paymentPlanId,this.state.schemeId)
        
        if (validateDeleteCall) {
            if (levelId === 0) {
                this.state.paymentPlanList.splice(id, 1)
                this.updateDataList('plan', this.state.paymentPlanList)
            } else {
                this.state.paymentPlanList.map((item,index) => {
                    if (item.levelId === levelId) this.state.paymentPlanList.splice(index)
                })
                this.updateDataList('plan', this.state.paymentPlanList)

                this.state.discountList.map((item,index) => {
                    if (item.levelId === levelId) this.state.discountList.splice(index)
                })
                this.updateDataList('discount', this.state.discountList)

                this.state.repeatList.map((item,index) => {
                    if (item.id === levelId) this.state.repeatList.splice(index)
                })
                this.updateDataList('repeat', this.state.repeatList)

                const tempLevel = this.state.levelList
                tempLevel.splice(id, 1)
                this.updateDataList('removeLevel', tempLevel)
            }
        }

        this.forceUpdate()
    }

    closeAction = () => {
        this.props.props.location.state === undefined ? this.props.history.push(rs.feeSchemes) :
            this.state.paymentPlanList.length !== 0 ? this.props.history.push(rs.feeSchemes) :
            toast.error(`Please add atleast one payment plan before closing.`, {icon: true, hideProgressBar: true})
    }

    render() {

        const {
            schemeName, schemeCode, awarding, desc, awardingOption, schemeOption, courseOption, intakeOption, error,
            paymentPlanList, editMode, studEnrollCondi, schemeId
        } = this.state

        const temp = this.state.paymentPlanList

        return (
            <Card className={'hof-add-fee-scheme'}>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4' className={'heading-feeScheme'}>
                        {
                            this.props.props.location.state === undefined ? `Create Fee Scheme` :
                                !editMode ? `View Fee Scheme` : `Edit Fee Scheme`
                        }
                    </CardTitle>
                    <div className={'copy-div'}>
                        {
                            (!editMode && this.props.props.location.state !== undefined) &&
                            <Button outline color='primary' size='sm' onClick={() => this.handleEdit()}>
                                <Edit size={14}/> Edit
                            </Button>
                        }
                        <X onClick={() => this.closeAction()} id={'close-icon'}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className={'heading'}>
                        <Info id={'icon'}/>General Information
                    </div>
                    <Row id={'general-div'} style={{marginLeft: '0'}}>
                        <Col lg={6}>
                            <Row className={'field-row'}>
                                <Col xs={2} style={{paddingLeft: '0'}}><Label>Scheme Name<Required/></Label></Col>
                                <Col xs={10}><Input placeholder='Scheme name' name='schemeName' value={schemeName}
                                                    invalid={error.schemeName && schemeName === ''}
                                                    readOnly={!editMode}
                                                    onChange={(e) => this.onChangeAction(e)} autoComplete={'off'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            <Row className={'field-row'}>
                                <Col xs={4} style={{paddingLeft: '0'}}><Label>Scheme Code<Required/></Label></Col>
                                <Col xs={8}><Input placeholder='Scheme code' name='schemeCode' value={schemeCode}
                                                   invalid={error.schemeCode && schemeCode === ''}
                                                   readOnly={!editMode}
                                                   onChange={(e) => this.onChangeAction(e)} autoComplete={'off'}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row className={'field-row'}>
                                <Col xs={1} style={{paddingLeft: '0'}}><Label>Description</Label></Col>
                                <Col xs={11}>
                                    <Input placeholder='Enter the fee scheme description here' name='desc' value={desc}
                                           onChange={(e) => this.onChangeAction(e)} autoComplete={'off'}
                                           invalid={error.desc && desc === ''}
                                           maxLength={250} type='textarea'
                                           readOnly={!editMode}
                                    />
                                    <span className="wordCount"><span>{desc.length}</span>/250</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className={'heading'}>
                        <CreditCard id={'icon'}/>Fee Scheme
                    </div>
                    <PaymentPlans nextAction={this.handlePaymentPlan} discount={this.state.discountList}
                                  changeList={this.updateDataList} levels={this.state.levelList}
                                  data={temp} edit={editMode} studEnrollCondi={studEnrollCondi} schemeId={schemeId}
                                  isNewScheme={this.props.props.location.state === undefined}
                                  removeLevel={this.removeLevelOrPlan} />


                </CardBody>
                {
                    this.state.courseModal &&
                    <CourseSideBar
                        toggleSidebar={() => this.closeModal()} open={this.state.courseModal} openConfirm={this.handleConfirmModal}
                        intakeList={intakeOption} changeList={this.updateDataList} data={this.state.assignIntakes}
                        editSchemeId={this.props.props.location.state} edit={editMode} publishAction={this.publishScheme}
                        isNewScheme={this.props.props.location.state === undefined}
                    />
                }
            </Card>
        )
    }

}

export default AddFeeScheme
