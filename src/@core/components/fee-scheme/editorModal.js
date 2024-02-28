// ** React Imports
import React, {Fragment, useEffect, useState, forceRender} from 'react'
import {Button, Modal, ModalBody, Row, Col, Label, Input, UncontrolledTooltip, ModalHeader} from 'reactstrap'
import './scss/_editorModal.scss'
import classnames from "classnames"
import Select from 'react-select'
import {selectThemeColors, showError, findObject, validatePaymentIntervalCourseCount, createPaymentPlanDataObj} from '@utils'
import {Info, HelpCircle, Download, AlertTriangle, Layers, MinusCircle, Plus} from 'react-feather'
import * as apiHof from "@api/hof"
import {FEE_TYPE, STUDENT_ENROLL_CSV_HEADER, CURRENCY} from '@const'
import {PAYMENT_INTERVALS} from '@configs/authConfig'
import DataTable from "react-data-table-component"
import {EDITOR_TABLE_COLUMN} from "./tableData"
import commaNumber from "comma-number"
import Required from "@components/required"
import {paymentPlanSaveErrors} from '@formError/headOfFinance'
import {Number_REGEX,paymentPlanSaveValidation,Amount_REGEX} from '@validations/headOfFinance'
import ConfirmBox from "@components/confirm-box"
import {toast} from "react-toastify"
import {CSVLink} from "react-csv"
import themeConfig from '@configs/themeConfig'


class EditorModal extends React.Component {

    csvLinkEl = React.createRef()
    state = {
        editData:[{select:false, structureId:0, type:'', desc:'', local:'', foreign:'', isNew:true}],
        planName:'',
        paymentInterval:'',
        intervalDays:'',
        error:paymentPlanSaveErrors,
        edit:false,
        modalStatus:false,
        modalCondi:'',
        csvData:[],
        saveObj:null
    }

    componentDidMount() {
        if (this.props.data !== null) {
            this.setState({
                edit: this.props.edit || this.props.studEnrollCondi,
                editData: this.props.data.data.scheme,
                planName: this.props.data.data.planName,
                paymentInterval:this.props.data.data.paymentInterval,
                intervalDays:this.props.data.data.intervalDays
            })
        } else {
            this.setState({
                edit: this.props.edit || this.props.studEnrollCondi
            })
        }
    }

    onChangeAction = (e) => {
        if (e.target.name === 'intervalDays') {
            if (Number_REGEX.test(e.target.value) || e.target.value === '') {
                const temp = this.state.error
                if (this.state.error.interval)temp.interval = false
                this.setState({[e.target.name]: e.target.value,paymentInterval:'',error:temp})
            }
        } else { this.setState({[e.target.name]: e.target.value}) }

    }

    onChangeActionForList = (e) => {
        const temp = this.state.editData
        const name = [e.target.name].toString()
        switch (name.split('-')[1]) {
            case 'desc':
                if (e.target.value.length === 0 || e.target.value.length < 45) {
                    temp[Number(name.split('-')[0])].desc = e.target.value
                }
                break
            case 'local':
                if (Amount_REGEX.test(e.target.value)) temp[Number(name.split('-')[0])].local = e.target.value
                break
            case 'foreign':
                if (Amount_REGEX.test(e.target.value)) temp[Number(name.split('-')[0])].foreign = e.target.value
                break
            case 'select':
                temp[Number(name.split('-')[0])].select = !(temp[Number(name.split('-')[0])].select)
                break
        }
        this.setState({
            editData:temp
        })
    }

    onDropDownHandler = (id,e) => {
        if (id.toString().split('-')[1] === "tbl") {
            const temp = this.state.editData
            if (e.value === 'REGISTRATION_FEE') {
                temp[id.toString().split('-')[0]].select = true
            } else { temp[id.toString().split('-')[0]].select = false }
            temp[id.toString().split('-')[0]].type = e
            this.setState({editData:temp})
        } else if (id === 'interval') {
            const temp = this.state.error
            if (this.state.error.interval)temp.interval = false
            this.setState({paymentInterval:e,intervalDays:'',error:temp})
        }
    }

    addRowAction = () => {
        this.state.editData.push({select:false, structureId:0, type:'', desc:'', local:'', foreign:'', isNew:true})
        this.forceUpdate()
    }

    removeRowAction = (id) => {
        this.state.editData.length === 1  ?
            this.setState({editData:[{select:false, structureId:0, type:'', desc:'', local:'', foreign:'', isNew:true}]})
            : this.state.editData.splice(id,1)
        this.forceUpdate()
    }

    saveBtnAction = async (type) => {

        const res = paymentPlanSaveValidation(this.state.planName,this.state.paymentInterval,this.state.intervalDays,this.state.editData)
        let saveCondi = false
        let cancelCondi = false
        for (const key in res) {
            if (res[key]) {
                saveCondi = true
            } else {
                cancelCondi = true
            }
        }

        if (type === 'save') {

            this.setState({error:res})
            if (saveCondi) {
                showError()
                return false
            }

            if (this.state.paymentInterval && this.state.paymentInterval !== '') {
                const feeTypeResult = validatePaymentIntervalCourseCount(this.state.paymentInterval, this.state.editData)
                if (!feeTypeResult) return false
            }

            const tempPlan = {}
            let installments = 0
            let lkrAmount = 0
            let usdAmount = 0
            this.state.editData.map(item => {
                if (item.type.value === 'COURSE_FEE') {
                    installments += 1
                }
                lkrAmount += Number(item.local)
                usdAmount += Number(item.foreign)
            })
            tempPlan.paymentSchemeId = this.props.schemeId,
            tempPlan.paymentPlanId = this.props.data && this.props.data.data.paymentPlanId ? this.props.data.data.paymentPlanId : 0
            tempPlan.planName = this.state.planName
            tempPlan.installments = installments
            tempPlan.paymentInterval = this.state.paymentInterval
            tempPlan.intervalDays = this.state.intervalDays
            tempPlan.lkr = lkrAmount
            tempPlan.usd = usdAmount
            tempPlan.scheme = this.state.editData
            tempPlan.levelId = this.props.levelId
            tempPlan.listId = this.props.data !== null ? this.props.data.id : ''


            if (!this.props.isNewScheme) {
                const studentsList = await this.getEnrolledStudentsInPaymentPlan()
                if (studentsList.length !== 0) {
                    this.setState({ csvData:studentsList, modalStatus:true, modalCodi:'ENROLLED', saveObj:tempPlan})
                } else {
                    this.updatePaymentPlanAction(tempPlan)
                }
            } else {
                this.props.modalHandler('save', tempPlan)
            }
        } else {
            (!cancelCondi && saveCondi) ? this.props.modalHandler('close', null) :
                this.setState({ modalStatus: true, modalCondi:'SAVE' })
        }
    }

    toggleModal = () => {
        this.props.modalHandler()
    }

    getEnrolledStudentsInPaymentPlan = async () => {
        let list = []
        if (this.props.data && this.props.data.data.paymentPlanId) {
            list =  await apiHof.getEnrolledStudentsInPaymentPlan(this.props.data.data.paymentPlanId)
        }
        return list
    }

    exportAction = async () => {
        this.csvLinkEl.current.link.click()
    }

    updatePaymentPlanAction = (data) => {
        const temp = createPaymentPlanDataObj([data])
        const result = apiHof.updateFeeSchemePaymentPlan(temp[0])
        if (result) this.props.modalHandler('save', data)
    }

    render() {

        const { planName, paymentInterval, intervalDays, error, edit, modalCondi, modalStatus, saveObj } = this.state
        const editData = []
        let lkrTotal = 0
        let usdTotal = 0

        const editFeeTypes = []

        if (this.state.editData.length !== 0) {
            let isRegAdded = false
            this.state.editData.map(item => {
                if (item.type.value === 'REGISTRATION_FEE') {
                    isRegAdded = true
                }
            })

            FEE_TYPE.map(item => {
                if (!(isRegAdded && item.value === 'REGISTRATION_FEE')) {
                    editFeeTypes.push(item)
                }
            })
        }


        if (this.state.editData.length !== 0) {
            this.state.editData.map((item, i) => {
                lkrTotal += Number(item.local)
                usdTotal += Number(item.foreign)
                editData.push({
                    // select:<div className='form-check form-check-inline'>
                    //     <Input type='checkbox'
                    //            name={`${i}-select`}
                    //            checked={item.select}
                    //            disabled={item.type.value === 'REGISTRATION_FEE' || this.props.edit} id='basic-cb-checked'
                    //            onChange={(e) => this.onChangeActionForList(e)}
                    //     />
                    // </div>,
                    type:<Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        theme={selectThemeColors}
                        className={classnames('react-select', {'is-invalid': error.dataValues && item.type === ''})}
                        classNamePrefix='select'
                        value={item.type}
                        options={editFeeTypes}
                        isClearable={false}
                        onChange={(e) => this.onDropDownHandler(`${i}-tbl`,e)}
                        placeholder={'Select fee type'}
                        isDisabled={!this.props.edit}
                    />,
                    desc:<Input value={item.desc} name={`${i}-desc`} invalid={error.dataValues && item.desc === '' }
                                onChange={(e) => this.onChangeActionForList(e)} autoComplete={'off'} readOnly={!this.props.edit}/>,
                    local:<Input value={item.local} name={`${i}-local`} readOnly={!this.props.edit}
                                 invalid={error.dataValues && item.local === '' }
                                 onChange={(e) => this.onChangeActionForList(e)} autoComplete={'off'}/>,
                    foreign:<Input value={item.foreign} name={`${i}-foreign`} readOnly={!this.props.edit}
                                   invalid={error.dataValues && item.foreign === '' }
                                   onChange={(e) => this.onChangeActionForList(e)} autoComplete={'off'}/>,
                    remove: <MinusCircle className={'remove-icon'}
                                         onClick={!this.props.edit ? null : () => this.removeRowAction(i)}/>
                })

            })
        }

        const confirmationDiv =  <div className={'pp-editor-confirmation'}>
            <Label>Below Students are already enrolled. Are you sure to save changes?</Label>
            <p onClick={() => this.exportAction()}><Download size={14}/> Download Student List (.csv)</p>
            <CSVLink data={this.state.csvData} filename={"daily transactions.csv"}
                     headers={STUDENT_ENROLL_CSV_HEADER} ref={this.csvLinkEl}>
            </CSVLink>
        </div>

        return (
            <Modal
                isOpen={this.props.visible}
                // toggle={() => this.toggleModal()}
                className={`modal-dialog-centered modal-lg`}
                style={{maxWidth: '1000px'}}
            >
                <ModalHeader toggle={() => this.props.modalHandler('close',null)}>Payment Plan Editor</ModalHeader>
                <ModalBody className={'payment-plan-editor'}>
                    <Row className={'editor-div'}>
                        <Col xs={4}>
                            <Row className={'field-row'}>
                                <Col xs={3}><Label>Plan Name<Required/></Label></Col>
                                <Col xs={9}><Input placeholder='Full payment for LLB 2021' name='planName' value={planName} readOnly={!this.props.edit}
                                                   onChange={(e) => this.onChangeAction(e)} autoComplete={'off'} invalid={error.planName && planName === ''}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={5}>
                            <Row className={'field-row'}>
                                <Col xs={4}><Label>Payment Interval<Required/></Label></Col>
                                <Col xs={8}>
                                    <Select
                                        className={classnames('react-select', {'is-invalid': error.interval})}
                                        theme={selectThemeColors}
                                        classNamePrefix='select'
                                        value={paymentInterval}
                                        options={PAYMENT_INTERVALS}
                                        isClearable={false}
                                        onChange={(e) => this.onDropDownHandler("interval",e)}
                                        placeholder={'Select payment interval'}
                                        isDisabled={!this.props.edit}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={3}>
                            <Row className={'field-row'}>
                                <Col xs={6}><Label>Interval by Days<Required/></Label></Col>
                                <Col xs={4}><Input name='intervalDays' value={intervalDays} autoComplete={'off'} invalid={error.interval}
                                                   onChange={(e) => this.onChangeAction(e)} readOnly={!this.props.edit}/></Col>
                                <Col xs={2}>
                                    <Info size={18} id='positionTop'/>
                                    <UncontrolledTooltip placement='top' target='positionTop'>Select either 'Payment Interval' field or 'Interval by
                                        Days' field.</UncontrolledTooltip></Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className='react-dataTable'>
                        <DataTable
                            noHeader
                            columns={EDITOR_TABLE_COLUMN}
                            paginationPerPage={100}
                            className='react-dataTable'
                            paginationDefaultPage={this.state.currentPage + 1}
                            data={editData}
                        />
                    </div>
                    <div className={'add-btn-div'} >
                        {
                            this.props.edit &&
                            <Button outline color='primary' size={'sm'} id={'edit-btn'} onClick={() => this.addRowAction()}>
                                <Plus size={13}/><span>Add More Row</span></Button>
                        }
                    </div>
                    <hr/>
                    <Row className={'total-div'}>
                        <Col xs={4}></Col>
                        <Col xs={2}>
                            <Label id={'title'}>Net Amount:</Label>
                        </Col>
                        <Col xs={3}>
                            <Label>{`${CURRENCY[0]} ${commaNumber(Number(lkrTotal).toFixed(2))}`}</Label>
                        </Col>
                        <Col xs={2}>
                            <Label>{`${CURRENCY[1]} ${commaNumber(Number(usdTotal).toFixed(2))}`}</Label>
                        </Col>
                    </Row>
                    <hr/>
                    <div className={'save-div'}>
                        <Button className='me-1' color='primary' disabled={!this.props.edit} outline onClick={() => this.saveBtnAction('cancel')}>Close</Button>
                        <Button color='primary' disabled={!this.props.edit}
                                onClick={() => this.saveBtnAction('save')}>{this.props.isNewScheme ? `Add` : `Save Changes`}</Button>
                    </div>
                    <hr/>
                </ModalBody>
                {
                    modalStatus &&
                    <ConfirmBox
                        className={`pp-editor-confirmation`}
                        isOpen={true}
                        toggleModal={() => this.setState({modalStatus:false})}
                        yesBtnClick={() => { modalCondi === 'SAVE' ? this.props.modalHandler('close',null) : this.updatePaymentPlanAction(saveObj) }}
                        noBtnClick={() => this.setState({modalStatus:false})}
                        title={modalCondi === 'SAVE' ? `Close Payment Plan Editor` : `Confirmation`}
                        message={modalCondi === 'SAVE' ?
                            "Data in the editor won't be saved. Are you sure to close the editor?" : confirmationDiv }
                        yesBtn="Yes"
                        noBtn="No"
                        icon={modalCondi === 'SAVE' ? <HelpCircle size={40} color="#EA5455"/> :
                            <AlertTriangle size={40} color={themeConfig.color.primary}/>
                        }
                    />
                }
            </Modal>
        )
    }
}

export default EditorModal
