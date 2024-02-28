import React from 'react'
import DataTable from 'react-data-table-component'
import {Button, Label, Row, Col, Input, UncontrolledTooltip, Collapse} from "reactstrap"
import {PAYMENT_PLANS_TABLE_COLUMN, EDITOR_TABLE_COLUMN} from "./tableData"
import {Edit, MinusCircle, Info, Plus, HelpCircle, Eye} from 'react-feather'
import './scss/_payment-plan.scss'
import Select from 'react-select'
import {selectThemeColors, showError, validatePaymentIntervalCourseCount} from '@utils'
import {FEE_TYPE, LEVEL_EXPAND_TYPE} from '@const'
import {Number_REGEX, paymentPlanSaveValidation, Amount_REGEX} from '@validations/headOfFinance'
import classnames from "classnames"
import {paymentPlanSaveErrors} from '@formError/headOfFinance'
import ConfirmBox from "@components/confirm-box"
import commaNumber from "comma-number"
import {toast} from "react-toastify"
import {CommonToast} from "@toast"
import Required from "@components/required"
import {PAYMENT_INTERVALS} from '@configs/authConfig'
import {basicInfo} from '@configs/basicInfomationConfig'
import LevelExpand from '@components/commonLevelExpand'
import EditorModal from './editorModal'
import LevelSidebar from './addLevelSidebar'

// {name:'Full payment for LLB 2021',installments:'03',local:5000,foreign:5000},
// {name:'Full payment for LLB 2021',installments:'03',local:5000,foreign:5000},
// {name:'Full payment for LLB 2021',installments:'03',local:5000,foreign:5000}

class PaymentPlans extends React.Component {

    state = {
        data: [],
        modalStatus: false,
        editorModal: false,
        modalType: '',
        edit: false,
        selectedLevel: '',
        openLevelBar: false,
        editData: null,
        removeObj: null
    }

    componentDidMount() {
        this.setState({
            data: this.props.data
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            data:nextProps.data,
            edit:nextProps.edit
        })
    }

    saveBtnAction = (editorData) => {

        this.props.levels.map(item => {
            if (item.value === editorData.levelId) item.isPlanAdded = true
        })

        let tempSaved = this.state.data
        if (editorData.listId !== '') {
            this.state.data.map((item, index) => {
                if (index === editorData.listId) {
                    this.state.data[index] = editorData
                }
            })
            tempSaved = this.state.data
            this.props.changeList('plan', this.state.data)
        } else {
            tempSaved.push(editorData)
            this.props.changeList('plan', tempSaved)
        }

        this.setState({
            data: tempSaved,
            editorModal: false,
            editData: null
        })
    }

    editAction = (id, data) => {
        this.setState({
            editData: {data, id},
            editorModal: true
        })
    }

    modalAction = (data) => {
        this.setState({removeObj: data, modalStatus: true})
    }

    removeSavedPlan = async () => {
        const {removeObj} = this.state
        await this.props.removeLevel(removeObj.id, removeObj.levelId, removeObj.planId)
        await this.setState({modalStatus: false})
    }

    moveToDiscount = () => {

        let showWarning = null
        this.props.levels.map(item => {
            if (!item.isPlanAdded) showWarning = item
        })

        if (showWarning === null) {
            if (this.props.levels.length !== 0 && this.props.discount.length === 0) {
                const discountList = []
                this.props.levels.map(item => {
                    discountList.push({
                        levelId: item.value,
                        discountId: 0,
                        discount: '',
                        type: '',
                        localType: '',
                        local: '',
                        foreignType: '',
                        foreign: '',
                        isValid: true,
                        isNew: true
                    })
                })
                this.props.changeList('discount', discountList)
            }
            this.props.nextAction()
        } else {
            toast.error(`Please add a payment plan to ${showWarning.label}`, {icon: true, hideProgressBar: true})
        }
    }

    handleEditor = () => {
        this.setState({editorModal: true})
    }

    selectedLevel = (levelId) => {
        this.setState({selectedLevel: levelId})
    }

    handleEditorModal = (type, data) => {
        switch (type) {
            case 'open':
                this.setState({editorModal: true})
                break
            case 'close':
                this.setState({editorModal: false, editData: null})
                break
            case 'save':
                this.saveBtnAction(data)
        }
    }

    addNewLevel = () => {
        this.setState({
            openLevelBar: !this.state.openLevelBar
        })
    }

    assignCourse = async () => {
        // if (this.props.edit && !this.props.isNewScheme && this.state.madeChange) {
        //     const temp = createRepeatDataObj(this.state.data, this.props.schemeId)
        //     const result = await apiHof.updateFeeSchemeRepeat(temp,this.state.data)
        //     if (result && result.state) {
        //         this.props.changeList('repeat',result.body)
        //         this.props.handleAssign()
        //     }
        // } else {
            this.props.changeList('repeat',this.state.data)
            this.props.handleAssign()
        // }
    }


    render() {

        const {removeObj, edit, openLevelBar, editData} = this.state
        const tableData = []

        if (this.state.data && this.state.data.length !== 0) {
            this.state.data.map((item, i) => {
                if (this.state.selectedLevel === item.levelId) {
                    tableData.push({
                        name: <p>{item.planName}</p>,
                        installment: <p>{item.installments}</p>,
                        local: <Label>{commaNumber(Number(item.lkr).toFixed(2))}</Label>,
                        foreign: <Label>{commaNumber(Number(item.usd).toFixed(2))}</Label>,
                        action: <Button outline color='primary' size={'sm'} id={'edit-btn'}
                                        onClick={() => this.editAction(i, item)}>
                            {
                                !this.props.edit ? <>
                                    <Eye className={'edit-icon'}/><span>View</span>
                                </> : <>
                                    <Edit className={'edit-icon'}/><span>Edit</span>
                                </>
                            }
                        </Button>,
                        remove: <MinusCircle className={'remove-icon'}
                                             onClick={!this.props.edit ? null : () => this.modalAction({id:i, name:item.planName, levelId:0, planId:item.paymentPlanId})}/>
                    })
                }
            })
        }

        const paymentPlanTbl = <div className='react-dataTable'>
            <DataTable
                noHeader
                columns={PAYMENT_PLANS_TABLE_COLUMN}
                paginationPerPage={10}
                className='react-dataTable'
                paginationDefaultPage={this.state.currentPage + 1}
                data={tableData}
            />
        </div>

        return (
            <div className={'hof-payment-plans'}>
                <div>{paymentPlanTbl}</div>
                {/*{*/}
                    {/*!this.state.editorModal && !this.props.edit && !basicInfo.paymentPlanLevel &&*/}
                    <div className={'add-btn-div'}>
                        <Button outline color='primary' size={'sm'} id={'edit-btn'} onClick={() => this.handleEditor()}>
                            <Plus size={13}/><span>Add Payment Plan</span></Button>
                    </div>
                {/*}*/}
                {
                    this.state.editorModal &&
                        <EditorModal visible={this.state.editorModal}
                                     modalHandler={this.handleEditorModal}
                                     edit={this.props.edit}
                                     studEnrollCondi={this.props.studEnrollCondi}
                                     levelId={this.state.selectedLevel}
                                     data={editData}
                                     isNewScheme={this.props.isNewScheme}
                                     schemeId={this.props.schemeId}
                        />
                }
                <div className={'save-div'}>
                    <Button className={'me-1'} outline color='primary' id={'next-btn'}
                            onClick={() => this.moveToDiscount()}>Cancel</Button>
                    <Button color='primary' id={'next-btn'} onClick={() => this.props.nextAction()}>Assign</Button>
                </div>
                {
                    this.state.modalStatus &&
                    <ConfirmBox
                        isOpen={true}
                        toggleModal={() => this.setState({modalStatus: false})}
                        yesBtnClick={() => this.removeSavedPlan()}
                        noBtnClick={() => this.setState({modalStatus: false})}
                        title={`Remove ${removeObj.name}`}
                        message={`Are you sure to remove this ${removeObj.levelId === 0 ? `payment plan` : `level`}?`}
                        yesBtn="Yes"
                        noBtn="No"
                        icon={<HelpCircle size={40} color="#EA5455"/>}
                    />
                }
            </div>
        )
    }

}

export default PaymentPlans
