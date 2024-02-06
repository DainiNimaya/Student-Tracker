import React, {Component} from "react"
import {Button, Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Row} from "reactstrap"
import GradingScheme from './gradingScheme'
import SchemeInformation from './schemeInformation'
import {Plus, X} from "react-feather"
import GradeSchemeEditor from "@components/scheme-editor"
import {schemeEditorErrors, gradingTableErrors} from '@formError/headOfAcademicAdmin'
import {schemeEditorValidation, gradingTableValidation} from '@validations/headOfAcademicAdmin'
import * as Api from '@api/haa_'
import {showError, getCookieUserData} from '@utils'
import config from '@storage'

const gradingRow = {
    markFrom: '',
    markTo: '',
    grade: '',
    desc: '',
    passFail: '',
    gradePoint: ''
}

const initialState = {
    schemeId: '',
    overallCalculation: null,
    schemeDescription: '',
    previousGradingScheme: null,
    passAllRequired: false,
    forceMinPassing: false,
    compensatableFail: false,
    roundUp: false
}

class index extends Component {

    state = {
        gradingSchemeData: [],
        selectedGradingScheme: null,
        schemeInfoData: null,
        schemeEditorModal: false,
        tab: 1,
        form: initialState,
        error: schemeEditorErrors,
        gradingTableData: [gradingRow],
        gradingError: gradingTableErrors,
        selectedId: 0
    }

    componentWillMount() {
        this.getAllGradingSchemes()
    }

    getAllGradingSchemes = async (isNewAdded) => {
        const res = await Api.getAllGradingSchemes()
        await this.setState({gradingSchemeData: res})
        if (isNewAdded) {
            await this.onSchemeSelect(res[(res.length - 1)], res.length - 1)
        }
    }

    onSchemeSelect = async (data, i) => {
        await this.setState({selectedGradingScheme: null, selectedId: 0})
        await this.setState({selectedGradingScheme: data, selectedId: i})
        await this.forceUpdate()
    }

    onInputHandler = async (e) => {
        if (e.target.type === 'checkbox') {
            await this.setState({
                ...this.state,
                form: {...this.state.form, [e.target.name]: e.target.checked}
            })
        } else {
            await this.setState({...this.state, form: {...this.state.form, [e.target.name]: e.target.value}})
        }
    }

    schemeEditorModalHandler = async (data) => {
        if (!data) {
            await this.setState({
                form: initialState,
                schemeEditorModal: data,
                error: schemeEditorErrors,
                gradingTableData: [
                    {
                        markFrom: '',
                        markTo: '',
                        grade: '',
                        desc: '',
                        passFail: '',
                        gradePoint: ''
                    }
                ],
                gradingError: gradingTableErrors,
                tab: 1
            })
        } else {
            await this.setState({schemeEditorModal: data})
        }
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
                    //showError()
                    return
                }
            }

            this.onSave()
        }
    }

    onGradingTableRemoveRow = (id) => {
        this.state.gradingTableData.length === 1 ? this.setState({
                gradingTableData: [{markFrom: '', markTo: '', grade: '', desc: '', passFail: '', gradePoint: ''}]
            })
            : this.state.gradingTableData.splice(id, 1)
        this.forceUpdate()
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

    onTabHandler = (tab) => {
        this.setState({tab})
    }

    onSave = async () => {
        const {form, gradingTableData} = this.state
        await Api.saveGradingSchemes(form, gradingTableData)
        await this.schemeEditorModalHandler(false)
        await this.getAllGradingSchemes(true)
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

    onDropDownHandler = (id, e) => {
        const temp = this.state.gradingTableData
        temp[id].passFail = e
        this.setState({gradingTableData: temp})
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

    updateGradingData = () => {
        this.setState({selectedGradingScheme: this.state.gradingSchemeData[this.state.selectedId]})
    }

    render() {
        const userRole = getCookieUserData().role
        return (
            <>
                <Card>
                    <CardHeader className='border-bottom'>
                        <CardTitle tag='h4'>Grading Scheme</CardTitle>

                        {
                            (userRole !== config.lecturer && userRole !== config.aaRole) ?
                                <Button onClick={() => this.setState({
                                    schemeEditorModal: true,
                                    gradingTableData: [
                                        {
                                            markFrom: '',
                                            markTo: '',
                                            grade: '',
                                            desc: '',
                                            passFail: '',
                                            gradePoint: ''
                                        }
                                    ]
                                })} color={`primary`}><Plus
                                    size={15}/> Add Grading Scheme</Button> :
                                <X onClick={() => this.props.history.goBack()} style={{cursor: 'pointer'}}/>
                        }
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={4}>
                                {
                                    this.state.gradingSchemeData.length > 0 && <GradingScheme
                                        title={'Grading Scheme'}
                                        isSearch={true}
                                        searchPlaceholder={'Search by Scheme Name'}
                                        data={this.state.gradingSchemeData}
                                        onSelect={this.onSchemeSelect}
                                    />
                                }
                            </Col>
                            <Col md={8}>
                                {this.state.selectedGradingScheme && <SchemeInformation
                                    state={this.state}
                                    title={'Grading Scheme Information'}
                                    getAllGradingSchemes={this.getAllGradingSchemes}
                                    updateGradingData={this.updateGradingData}
                                />}
                            </Col>
                        </Row>
                    </CardBody>
                </Card>

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
                    overallMarkHandler={this.overallMarkHandler}
                    title={'Create Grading Scheme'}
                />}
            </>
        )
    }
}

export default index
