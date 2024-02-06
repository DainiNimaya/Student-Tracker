import React, {Component} from "react"
import {Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Row} from "reactstrap"
import AssessmentScheme from './assessmentScheme'
import SchemeInformation from './schemeInformation'
import {Plus} from "react-feather"
import AssessmentSchemeEditor from "@components/assessment-scheme-editor"
import {schemeEditorErrors, gradingTableErrors} from '@formError/headOfAcademicAdmin'
import {assessmentSchemeEditorValidation, assessmentTableValidation} from '@validations/headOfAcademicAdmin'
import * as Api from '@api/haa_'
import {toast} from "react-toastify"
import {errorMessage} from '@strings'
import {showError, getCookieUserData} from '@utils'
import config from '@storage'

const gradingRow = {
    assessmentType: '',
    percentage: '',
    name: '',
    assessmentTypeId: 0
}

const initialState = {
    schemeCode: '',
    desc: '',
    gradingScheme: null
}

class index extends Component {

    state = {
        gradingSchemeData: [],
        schemeInfoData: {
            schemeId: '',
            markCalculation: '',
            schemeDesc: '',
            previousGradingScheme: ''
        },
        schemeEditorModal: false,
        tab: 1,
        form: initialState,
        error: schemeEditorErrors,
        gradingTableData: [gradingRow],
        gradingError: gradingTableErrors,
        selectedGradingScheme: null,
        assessmentTableData: [],
        gradingSchemeList: [],
        selectedSchemeId: 0,
        selectedId: 0,
        timer: null,
        nextButtonDisable: false,
        schemaCodeCopy : ''
    }

    componentWillMount() {
        this.loadAllAssessments()
        const {schemeCode} = this.state.form
        this.setState({schemaCodeCopy: schemeCode})
    }
    setStateInvalidFalse = () => {
        this.setState({assessmentCodeInvalid : false})
    }

    loadAllGradingSchemes = async () => {
        const res = await Api.getAllGradingSchemes('TOTAL_GRADING_POINT')
        const data = res.map(item => {
            return {
                label: item.gradingSchemeIdCode,
                value: item.gradingSchemeId
            }
        })

        await this.setState({gradingSchemeList: data})
    }

    loadAllAssessments = async () => {
        const res = await Api.getAllAssessmentSchemes()
        await this.setState({gradingSchemeData: res})
    }

    onSchemeSelect = async (data, id) => {
        await this.setState({
            selectedGradingScheme: null,
            assessmentTableData: [],
            selectedSchemeId: 0,
            selectedId: 0
        })
        await this.setState({
            selectedGradingScheme: data,
            assessmentTableData: data.schemeTypeList,
            selectedSchemeId: data.schemeId,
            selectedId: id
        })
        await this.forceUpdate()
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

    schemeEditorModalHandler = async (data) => {
        if (data) {
            await this.setState({schemeEditorModal: data})
        } else {
            await this.setState({
                ...this.state,
                schemeEditorModal: data,
                gradingTableData: [{assessmentType: '', percentage: ''}],
                form: initialState,
                tab: 1,
                error: schemeEditorErrors
            })
        }
    }

    formValidate = async () => {

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
        this.state.gradingTableData.length === 1 ? this.setState({
                gradingTableData: [{assessmentType: '', percentage: '',name: ''}]
            })
            : this.state.gradingTableData.splice(id, 1)
        this.forceUpdate()
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

    onTabHandler = (tab) => {
        this.setState({tab})
    }

    onSave = async () => {
        const res = await Api.saveAssessmentSchemes(this.state.form, this.state.gradingTableData)
        if (res) {
            await this.schemeEditorModalHandler(false)
            await this.loadAllAssessments()
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

    onDropDownHandler = (id, e) => {
        if (id.substring(2) === 'tbl') {
            const temp = this.state.gradingTableData
            temp[id.substring(0, 1)].passFail = e
            this.setState({gradingTableData: temp})
        }
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

    updateData = async () => {
        await this.setState({
            selectedGradingScheme: this.state.gradingSchemeData[this.state.selectedId],
            assessmentTableData: this.state.gradingSchemeData[this.state.selectedId].schemeTypeList,
            tab: 1
        })
    }

    resetAssesmentTableErrorForm = () => {
        this.setState({gradingError : gradingTableErrors})
        this.setState({schemaCodeCopy: undefined})
        this.setStateInvalidFalse()
    }

    onRowDropDownHandler = async (e, i) => {
        const rows = [...this.state.gradingTableData]
        rows[i].assessmentType = e
        await this.setState({gradingTableData: rows})
    }

    assessmentModalHandler = async (state) => {
        if (state) {
            await this.loadAllGradingSchemes()
        }
        await this.setState({
                schemeEditorModal: state,
                gradingTableData: [
                    {
                        assessmentType: '',
                        percentage: '',
                        name: '',
                        assessmentTypeId: 0
                    }
                ]
            }
        )
    }

    render() {
        return (
            <>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Assessment Scheme </CardTitle>
                        {
                            getCookieUserData().role !== config.aaRole &&
                            <Button onClick={() => this.assessmentModalHandler(true)} color={`primary`}><Plus
                                size={15}/> Add Assessment Scheme</Button>
                        }
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={3}>
                                {
                                    this.state.gradingSchemeData.length > 0 && <AssessmentScheme
                                        title={'Assessment Scheme'}
                                        isSearch={true}
                                        searchPlaceholder={'Search by Assessment Scheme Name'}
                                        data={this.state.gradingSchemeData}
                                        onSelect={this.onSchemeSelect}
                                    />
                                }
                            </Col>
                            <Col md={9}>
                                {
                                    this.state.selectedGradingScheme && <SchemeInformation
                                        state={this.state}
                                        title={'Assessment Scheme Information'}
                                        refresh={this.loadAllAssessments}
                                        updateData={this.updateData}
                                    />
                                }
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

                {this.state.schemeEditorModal && <AssessmentSchemeEditor
                    onInputHandler={this.onInputHandler}
                    setStateInvalidFalse={this.setStateInvalidFalse}
                    nextButtonIsDisable={this.state.nextButtonDisable}
                    isModal={this.state.schemeEditorModal}
                    modalHandler={this.schemeEditorModalHandler}
                    formValidate={this.formValidate}
                    state={this.state}
                    resetErrorForm = {this.resetAssesmentTableErrorForm}
                    onGradingTableRemoveRow={this.onGradingTableRemoveRow}
                    onGradingTableAddRow={this.onGradingTableAddRow}
                    onTabHandler={this.onTabHandler}
                    onSave={this.onSave}
                    onRowInputHandler={this.onRowInputHandler}
                    onRowDropDownHandler={this.onRowDropDownHandler}
                    onDropDownHandler={this.onDropDownHandler}
                    onGradingSchemeDropDown={this.onGradingSchemeDropDown}
                    title={'Create Assessment Scheme'}
                />}
            </>
        )
    }
}

export default index
