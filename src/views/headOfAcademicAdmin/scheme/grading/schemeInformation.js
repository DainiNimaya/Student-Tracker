import React, {Component} from "react"
import './scss/_gradingScheme.scss'
import {FormGroup, Input, Label, Row, Col, Button} from "reactstrap"
import {Edit} from "react-feather"
import {GRADING_SCHEME_TABLE_COLUMN} from "./tableData"
import DataTable from "react-data-table-component"
import GradeSchemeEditor from "@components/scheme-editor"
import {schemeEditorErrors, gradingTableErrors} from '@formError/headOfAcademicAdmin'
import {schemeEditorValidation, gradingTableValidation} from '@validations/headOfAcademicAdmin'
import * as Api from '@api/haa'
import {capitalize} from '@commonFunc'
import {OVERALL_MARK_CALCULATION} from '@const'
import {showError, getCookieUserData, findObject} from '@utils'
import config from '@storage'

const initialState = {
    schemeId: '',
    overallCalculation: null,
    schemeDescription: null,
    previousGradingScheme: null,
    passAllRequired: false,
    forceMinPassing: false,
    compensatableFail: false,
    roundUp: false
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
        isDisabled: true,
        schemeEditorModal: false,
        tab: 1,
        form: initialState,
        error: schemeEditorErrors,
        gradingTableData: [],
        gradingError: gradingTableErrors
    }

    componentWillMount() {
        this.setData(this.props.state.selectedGradingScheme)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setData(nextProps.state.selectedGradingScheme)
    }

    setData = async (data) => {
        // const mark = OVERALL_MARK_CALCULATION.filter(item => {
        //     if (item.value === data.markCalculation) return item
        //     return null
        // })
        await this.setState({
            ...this.state,
            form: {
                id: data.gradingSchemeId,
                schemeId: data.gradingSchemeIdCode ? data.gradingSchemeIdCode.toString() : '',
                desc: data.gradingSchemeDecription,
                overallCalculation: findObject(OVERALL_MARK_CALCULATION, data.markCalculation),
                schemeDescription: data.gradingSchemeDecription,
                previousGradingScheme: null,
                passAllRequired: data.passAllRequired,
                forceMinPassing: data.forceMinPassing,
                compensatableFail: data.compensatableFail,
                roundUp: data.roundUp
            },
            gradingTableData: data.gradingTable.map(item => {
                return {
                    markFrom: item.markFrom,
                    markTo: item.markTo,
                    grade: item.grade,
                    desc: item.description,
                    passFail: {label: item.isPass ? 'Pass' : 'Fail', value: item.isPass ? 'PASS' : 'FAIL'},
                    gradePoint: item.gradePoint
                }
            })
        })
    }

    schemeEditorModalHandler = async (data) => {
        if (data) {
            await this.setState({schemeEditorModal: data})
        } else {
            await this.props.updateGradingData()
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
            markFrom: '',
            markTo: '',
            grade: '',
            desc: '',
            passFail: '',
            gradePoint: ''
        })
        this.forceUpdate()
    }

    formValidate = async () => {
        if (this.state.tab === 1) {
            const {schemeId, overallCalculation} = this.state.form
            const res = schemeEditorValidation(schemeId, overallCalculation)
            this.setState({error: res})
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }

            this.setState({tab: 2})
        } else {
            const res = gradingTableValidation(this.state.gradingTableData)
            await this.setState({gradingError: res})
            for (const key in res) {
                if (res[key]) {
                    // showError()
                    return
                }
            }

            await this.onSave()
        }
    }

    onGradingTableRemoveRow = (id) => {
        this.state.gradingTableData.length === 1 ? this.setState({
                gradingTableData: [{markFrom: '', markTo: '', grade: '', desc: '', passFail: '', gradePoint: ''}]
            })
            : this.state.gradingTableData.splice(id, 1)
        this.forceUpdate()
    }

    onTabHandler = (tab) => {
        this.setState({tab})
    }

    onDropDownHandler = (id, e) => {
        const temp = this.state.gradingTableData
        temp[id].passFail = e
        this.setState({gradingTableData: temp})
    }

    onSave = async () => {
        const {form, gradingTableData} = this.state
        await Api.updateGradingSchemes(form, gradingTableData)
        this.schemeEditorModalHandler(false)
        await this.props.getAllGradingSchemes()
        await this.props.updateGradingData()
    }

    overallMarkHandler = (e) => {
        this.setState({
            ...this.state,
            form: {
                ...this.state.form,
                overallCalculation: e
            }
        })
    }

    onRowInputHandler = (e) => {
        const temp = this.state.gradingTableData
        const name = [e.target.name].toString()

        switch (name.split('-')[1]) {
            case 'markFrom':
                temp[Number(name.split('-')[0])].markFrom = e.target.value
                break

            case 'markTo':
                temp[Number(name.split('-')[0])].markTo = e.target.value
                break

            case 'grade':
                temp[Number(name.split('-')[0])].grade = e.target.value
                break

            case 'desc':
                temp[Number(name.split('-')[0])].desc = e.target.value
                break

            case 'gradePoint':
                temp[Number(name.split('-')[0])].gradePoint = e.target.value
                break
        }

        this.setState({
            gradingTableData: temp
        })
    }

    render() {
        const {isDisabled} = this.state
        const {schemeInfoData, selectedGradingScheme} = this.props.state

        const data = []
        selectedGradingScheme.gradingTable.map(item => {
            data.push({
                markFrom: <Input className={'table-input'} readOnly disabled={isDisabled} value={item.markFrom}/>,
                markTo: <Input className={'table-input'} readOnly disabled={isDisabled} value={item.markTo}/>,
                grade: <Input className={'table-input'} readOnly disabled={isDisabled} value={item.grade}/>,
                desc: <Input className={'table-input'} readOnly disabled={isDisabled} value={item.description}/>,
                passFail: <Input className={`table-input ${item.isPass ? 'pass' : 'fail'}`} readOnly
                                 disabled={isDisabled}
                                 value={item.isPass ? 'Pass' : 'Fail'}/>,
                gradePoint: <Input className={'table-input'} readOnly disabled={isDisabled} value={item.gradePoint}/>
            })
        })

        return (
            <>
                {this.props.state.selectedScheme !== 0 && <div className={'scheme-container'}>
                    <div className={'title-top'}>
                        <label className={'scheme-title'}>{this.props.title}</label>
                        {getCookieUserData().role !== config.lecturer &&
                        <Button onClick={() => this.setState({schemeEditorModal: true})} className={'btn-edit'} outline
                                color='primary' size={'sm'}><Edit
                            size={15}/> Edit</Button>}
                    </div>
                    <div className={'hr'}></div>

                    <div className={'scheme-form'}>
                        <Row>
                            <Col md={6}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Grading Scheme ID</Label>
                                    <Input
                                        id='name'
                                        readOnly
                                        disabled={isDisabled}
                                        value={selectedGradingScheme.gradingSchemeIdCode}
                                    />
                                </div>
                            </Col>

                            <Col md={12}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Grading Scheme Description</Label>
                                    <Input
                                        type={'textarea'}
                                        id='name'
                                        readOnly
                                        style={{height: '80px'}}
                                        disabled={isDisabled}
                                        value={selectedGradingScheme.gradingSchemeDecription}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {
                        selectedGradingScheme.gradingTable.length > 0 && <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                columns={GRADING_SCHEME_TABLE_COLUMN}
                                paginationPerPage={10}
                                className='react-dataTable'
                                pagination={false}
                                data={data}
                            />
                        </div>
                    }
                </div>}

                {this.state.schemeEditorModal && <GradeSchemeEditor
                    onInputHandler={this.onInputHandler}
                    isModal={this.state.schemeEditorModal}
                    modalHandler={this.schemeEditorModalHandler}
                    formValidate={this.formValidate}
                    state={this.state}
                    onGradingTableRemoveRow={this.onGradingTableRemoveRow}
                    onGradingTableAddRow={this.onGradingTableAddRow}
                    onTabHandler={this.onTabHandler}
                    onSave={this.onSave}
                    onRowInputHandler={this.onRowInputHandler}
                    onDropDownHandler={this.onDropDownHandler}
                    isUpdate={true}
                    overallMarkHandler={this.overallMarkHandler}
                    title={'Update Grading Scheme'}
                />}
            </>
        )
    }
}

export default SchemeInformation
