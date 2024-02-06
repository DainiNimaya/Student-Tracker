import React, {Component} from "react"
import './scss/_gradingScheme.scss'
import {FormGroup, Input, Label, Row, Col, Button} from "reactstrap"
import {Edit} from "react-feather"
import {ASSESSMENT_TABLE_COLUMN} from "./tableData"
import DataTable from "react-data-table-component"
import AssessmentSchemeEditor from "@components/assessment-scheme-editor"
import {schemeEditorErrors, assessmentTableErrors, gradingTableErrors} from '@formError/headOfAcademicAdmin'
import {
    assessmentSchemeEditorValidation,
    gradingTableValidation,
    assessmentTableValidation

} from '@validations/headOfAcademicAdmin'
import * as Api from '@api/haa_'
import {toast} from "react-toastify"
import {errorMessage} from '@strings'
import {capitalize} from '@commonFunc'
import {showError, findObject} from '@utils'

const initialState = {
    schemeCode: '',
    desc: '',
    gradingScheme: null
}

const gradingRow = {
    markFrom: '',
    markTo: '',
    grade: '',
    desc: '',
    passFail: '',
    gradePoint: ''
}

class SchemeInformation extends Component {
    state = {
        isDisabled: false,
        schemeEditorModal: false,
        schemeInfoData: {
            schemeId: '',
            markCalculation: '',
            schemeDesc: '',
            previousGradingScheme: '',
            previousGradingSchemeCheck: false,
            compensatableFail: false,
            forceMinPassing: false,
            roundUp: false
        },
        tab: 1,
        form: initialState,
        error: schemeEditorErrors,
        gradingTableData: [],
        gradingError: gradingTableErrors,
        dupError: [],
        gradingSchemeList: [],
        selectedSchemeId: 0,
        assessmentTypeList: [],
        schemaCodeCopy: '',
        initialSchemaCode: '',
        assessmentCodeInvalid: false
    }

    async componentWillMount() {
        await this.getAllGradingSchemes()
        await this.loadAllAssessmentTypes()
        await this.setData(this.props.state.selectedGradingScheme, this.props.state.selectedSchemeId)

        const {schemeCode} = this.state.form
        this.setState({schemaCodeCopy: schemeCode})
        this.setState({initialSchemaCode: schemeCode})

        this.setState({tempForm: this.state.form})
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setData(nextProps.state.selectedGradingScheme, nextProps.state.selectedSchemeId)
    }

    loadAllAssessmentTypes = async () => {
        const res = await Api.getAllAssessmentTypes()
        const data = res.map(item => {
            return {
                label: item.assessmentTypeName,
                value: item.configAssessmentTypeId
            }
        })

        await this.setState({assessmentTypeList: data})
    }

    getAllGradingSchemes = async () => {
        const res = await Api.getAllGradingSchemes('TOTAL_GRADING_POINT')
        const data = res.map(item => {
            return {label: item.gradingSchemeIdCode, value: item.gradingSchemeId}
        })
        this.setState({gradingSchemeList: data})
    }

    setData = async (data, id) => {
        await this.setState({
            ...this.state,
            selectedSchemeId: id,
            form: {
                desc: data.description,
                schemeCode: data.schemeCode.toString(),
                gradingScheme: await findObject(this.state.gradingSchemeList, data.gradingSchemeId)
            },
            gradingTableData: data.schemeTypeList.map(item => {
                const assType = findObject(this.state.assessmentTypeList, item.configAssessmentTypeId)
                return {
                    assessmentType: assType ? assType : null,
                    percentage: item.percentage,
                    name: item.assessmentTypeName,
                    assessmentTypeId: item.assessmentTypeId
                }
            })
        })

        this.forceUpdate()
    }

    resetAssesmentTableErrorForm = () => {
        this.setState({gradingError : gradingTableErrors})
        this.setState({assessmentCodeInvalid : false})
    }

    schemeEditorModalHandler = async (data) => {
        // if (data) {
        //     await this.setState({schemeEditorModal: data})
        // } else {
        //     await this.setState({
        //         ...this.state,
        //         schemeEditorModal: data,
        //         gradingTableData: [{assessmentType: '', percentage: ''}],
        //         form: initialState,
        //         tab: 1
        //     })
        // }
        if (data) {
            await this.setState({schemeEditorModal: data})
        } else {
            await this.props.updateData()
            await this.setState({schemeEditorModal: data, tab: 1})
        }
    }

    onInputHandler = (e) => {
        if (e.target.type === 'checkbox') {
            this.setState({
                ...this.state,
                form: {...this.state.form, [e.target.name]: e.target.checked}
            })
        } else {
            this.setState({...this.state, form: {...this.state.form, [e.target.name]: e.target.value}})
        }
    }

    onGradingTableAddRow = async () => {
        this.state.gradingTableData.push({
            assessmentType: '',
            percentage: '',
            name: '',
            assessmentTypeId: 0
        })
        this.forceUpdate()
    }


    formValidate = async (action) => {

        if (this.state.tab === 1) {
            const {schemeCode, gradingScheme} = this.state.form
            const res = assessmentSchemeEditorValidation(schemeCode, gradingScheme)
            this.setState({error: res})
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }

            this.setState({tab: 2})

        } else {
            const res = await assessmentTableValidation(this.state.gradingTableData)
            this.setState({gradingError: res})
                for (const key in res) {
                    
                    if (key !== 'duplicates' && res[key]) {
                          //console.log(key)
                        //showError()
                        return
                    }
                }
            let totalPercentage = 0
            this.state.gradingTableData.map(item => {
                totalPercentage = totalPercentage + Number.parseInt(item.percentage)
            })
            if (totalPercentage === 100) {
                this.onSave()
            } else {
                toast.warning(errorMessage.totalPercentageError, {icon: true, hideProgressBar: true})
            }
        }
    }

    onGradingTableRemoveRow = (id) => {
        // this.state.gradingTableData.length === 1 ? this.setState({
        //         gradingTableData: [{markFrom: '', markTo: '', grade: '', desc: '', passFail: '', gradePoint: ''}]
        //     })
        //     : this.state.gradingTableData.splice(id, 1)
        if (this.state.gradingTableData.length === 1) {

        } else {
            this.state.gradingTableData.splice(id, 1)
        }

        this.forceUpdate()
    }

    onTabHandler = (tab) => {
        this.setState({tab})
    }

    onDropDownHandler = (id, e) => {
        if (id.substring(2) === 'tbl') {
            const temp = this.state.gradingTableData
            temp[id.substring(0, 1)].passFail = e
            this.setState({gradingTableData: temp})
        }
    }

    onSave = async () => {
        const res = await Api.updateAssessmentSchemes(this.state.selectedSchemeId, this.state.form, this.state.gradingTableData)
        if (res && res.status === 0) {
            await this.schemeEditorModalHandler(false)
            await this.props.refresh()
            await this.props.updateData()
        }
    }

    onRowInputHandler = (e) => {
        const temp = this.state.gradingTableData
        const name = [e.target.name].toString()

        switch (name.split('-')[1]) {
            case 'assessmentType':
                temp[Number(name.split('-')[0])].assessmentType = e.target.value
                break

            case 'percentage':
                temp[Number(name.split('-')[0])].percentage = e.target.value
                break

            case 'name':
                temp[Number(name.split('-')[0])].name = e.target.value
                break
        }

        this.setState({
            gradingTableData: temp
        })
    }

    onGradingSchemeDropDown = (e) => {
        this.setState({
            ...this.state,
            form: {
                ...this.state.form,
                gradingScheme: e
            }
        })
    }

    onRowDropDownHandler = async (e, i) => {
        const rows = [...this.state.gradingTableData]
        rows[i].assessmentType = e
        await this.setState({gradingTableData: rows})
    }

    assessmentModalHandler = async (state) => {
        if (state) {
            await this.getAllGradingSchemes()
        }
        await this.setState({schemeEditorModal: state})
    }

    render() {
        const {isDisabled} = this.state
        const {schemeInfoData, selectedGradingScheme, assessmentTableData} = this.props.state

        const data = []
        let totalPercentage = 0
        assessmentTableData.map(item => {
            totalPercentage = item.percentage + totalPercentage
            data.push({
                assessmentType: <Input readOnly className={'table-input'} disabled={isDisabled}
                                       value={item.configTypeName}/>,
                name: <Input readOnly className={'table-input'} disabled={isDisabled}
                             value={item.assessmentTypeName ? capitalize(item.assessmentTypeName.replaceAll('_', ' ').toLowerCase()) : ''}/>,
                precentage: <Input readOnly className={'table-input'} disabled={isDisabled} value={item.percentage}/>
            })
        })

        let schemeList = ''
        this.state.gradingSchemeList.filter(item => {
            if (selectedGradingScheme.gradingSchemeId === item.value) {
                schemeList = item
            }
        })

        return (
            <>
                {this.props.state.selectedScheme !== 0 && <div className={'scheme-container'}>
                    <div className={'title-top'}>
                        <label className={'scheme-title'}>{this.props.title}</label>
                        <Button onClick={() => this.assessmentModalHandler(true)} className={'btn-edit'} outline
                                color='primary' size={'sm'}><Edit
                            size={15}/> Edit</Button>
                    </div>
                    <div className={'hr'}></div>

                    <div className={'scheme-form'}>
                        <Row>
                            <Col md={6}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Assessment Scheme ID</Label>
                                    <Input
                                        readOnly
                                        id='name'
                                        placeholder={'Scheme ID'}
                                        disabled={isDisabled}
                                        value={selectedGradingScheme.schemeCode}
                                    />
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Grading Scheme</Label>
                                    <Input
                                        readOnly
                                        id='name'
                                        placeholder={'Grading Scheme'}
                                        disabled={isDisabled}
                                        value={schemeList.label}
                                    />
                                </div>
                            </Col>

                            <Col md={12}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Assessment Description</Label>
                                    <Input
                                        readOnly
                                        type={'textarea'}
                                        id='name'
                                        placeholder={'Assessment Description'}
                                        style={{height: '120px'}}
                                        disabled={isDisabled}
                                        value={selectedGradingScheme.description}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {
                        data.length > 0 && <>
                            <div className='react-dataTable'>
                                <DataTable
                                    noHeader
                                    columns={ASSESSMENT_TABLE_COLUMN}
                                    paginationPerPage={10}
                                    className='react-dataTable'
                                    pagination={false}
                                    data={data}
                                />
                            </div>

                            <div align={'right'} className={'total-percentage-container'}>
                                <label>TOTAL PERCENTAGE: {totalPercentage}%</label>
                            </div>
                        </>
                    }
                </div>}

                {this.state.schemeEditorModal && <AssessmentSchemeEditor
                    onInputHandler={this.onInputHandler}
                    isModal={this.state.schemeEditorModal}
                    modalHandler={this.schemeEditorModalHandler}
                    formValidate={this.formValidate}
                    isInvalid={this.state.assessmentCodeInvalid}
                    state={this.state}
                    resetErrorForm = {this.resetAssesmentTableErrorForm}
                    onGradingTableRemoveRow={this.onGradingTableRemoveRow}
                    onGradingTableAddRow={this.onGradingTableAddRow}
                    onTabHandler={this.onTabHandler}
                    onSave={this.onSave}
                    onRowInputHandler={this.onRowInputHandler}
                    onRowDropDownHandler={this.onRowDropDownHandler}
                    onDropDownHandler={this.onDropDownHandler}
                    isUpdate={true}
                    onGradingSchemeDropDown={this.onGradingSchemeDropDown}
                    title={'Assessment Scheme Editor'}
                />}
            </>
        )
    }
}

export default SchemeInformation
