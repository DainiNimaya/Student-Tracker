import React, {Component} from "react"
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Row, Col} from 'reactstrap'
import {Info, Layout, MinusCircle, Plus} from "react-feather"
import Select from "react-select"
import {ASSESSMENT_TYPES} from '@const'
import {selectThemeColors} from '@utils'
import './scss/_generalInformation.scss'
import DataTable from "react-data-table-component"
import {ASSESSMENT_TABLE_COLUMN} from "./tableData"
import './scss/_gradingTable.scss'
import * as Api from '@api/haa'
import classnames from "classnames"
import Required from "@components/required"


class GradeSchemeEditor extends Component {

    state = {
        assessmentTypeList: [],
        schemaCodeCopy: '',

        idError: false,
        tempId: this.props.state.form.schemeCode.trim()
    }

    componentWillMount() {
        this.loadAllAssessmentTypes()
        this.props.resetErrorForm()

    }

    checkSchemeIdDuplicate = async () => {
        const id = this.props.state.form.schemeCode.trim()

        if (this.props.isUpdate && id !== this.state.tempId) {
            await this.validateSchemeId()
        } else {
            if (!this.props.isUpdate) {
                await this.validateSchemeId()
            } else {
                this.props.formValidate()
            }
        }
    }

    validateSchemeId = async () => {
        const id = this.props.state.form.schemeCode.trim()
        const res = await Api.checkDuplicateSchemeCode(id)
        if (res !== null) {
            this.setState({
                idError: true
            })
        } else {
            this.setState({
                idError: false
            })
            await this.props.formValidate()
        }
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

    checkTableDuplicateValidation = (gradingError, index, row) => {
        if (gradingError.duplicates) {
            if (gradingError.duplicates.length !== 0) {
                switch (row) {

                    case "name" :
                        if (gradingError.duplicates[index]) {
                            //alert(gradingError.duplicates[index].name)
                            if (gradingError.duplicates[index].name === true) {
                                return true
                            } else {
                                return false
                            }

                        }
                        break

                    case "assessmentType" :
                        if (gradingError.duplicates[index]) {
                            //alert(gradingError.duplicates[index].name)
                            if (gradingError.duplicates[index].assessmentType === true) {
                                return true
                            } else {
                                return false
                            }

                        }
                        break

                }

            }
        } else {
            return false
        }
    }

    render() {
        const {tab, form, error, gradingTableData, gradingError} = this.props.state
        const {isUpdate} = this.props
        let totalPercentage = 0


        const data = []
        gradingTableData.map((item, index) => {
            totalPercentage = Number.parseInt(item.percentage !== '' ? item.percentage : 0) + totalPercentage
            data.push({
                assessmentType: <>
                    {/*<Input invalid={gradingError.assessmentType && item.assessmentType === ''}*/}
                    {/*       name={`${i}-assessmentType`}*/}
                    {/*       onChange={this.props.onRowInputHandler}*/}
                    {/*       className={'table-input'}*/}
                    {/*                   value={item.assessmentType}/>*/}
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        value={item.assessmentType}
                        onChange={(e) => this.props.onRowDropDownHandler(e, index)}
                        className={classnames(`react-select`, {'is-invalid': (gradingError.assessmentType && (item.assessmentType === '' || item.assessmentType === null)) || this.checkTableDuplicateValidation(gradingError, index, "assessmentType")})}
                        theme={selectThemeColors}
                        classNamePrefix='select'
                        options={this.state.assessmentTypeList}
                        placeholder="Assessment Type"
                    />
                </>,

                name: <Input
                    invalid={gradingError.name && item.name === '' ? true : this.checkTableDuplicateValidation(gradingError, index, "name")}
                    type={'text'}
                    name={`${index}-name`}
                    onChange={this.props.onRowInputHandler}
                    value={item.name}/>,
                percentage: <Input invalid={gradingError.percentage && item.percentage === ''} type={'number'}
                                   name={`${index}-percentage`}
                                   onChange={this.props.onRowInputHandler}
                                   className={'table-input'}
                                   value={item.percentage}/>,
                remove: <MinusCircle invalid={gradingError.remove}
                                     onClick={() => this.props.onGradingTableRemoveRow(index)}
                                     className={'btn-remove'} size={20}/>
            })
        })

        const schemeList = this.props.state.gradingSchemeList && this.props.state.gradingSchemeList.filter(item => {
            if (item.value === form.gradingScheme) {
                return item
            }
        })

        return (
            <>
                <Modal
                    isOpen={this.props.isModal}
                    // toggle={() => this.props.modalHandler(false)}
                    className={`modal-dialog-centered modal-lg`}
                    scrollable
                >
                    <ModalHeader toggle={() => this.props.modalHandler(false)}>
                        {this.props.title}
                    </ModalHeader>
                    <ModalBody>

                        <div className='general-information pb-0'>
                            <Row>
                                <Col md={6}>
                                    <div className={'input-container'}>
                                        <label className={'form-label'}>Assessment Scheme ID <Required/></label>
                                        <Input
                                            invalid={(error.schemeId && form.schemeCode === '') || this.state.idError}
                                            onChange={this.props.onInputHandler}
                                            name={'schemeCode'}
                                            value={form.schemeCode}
                                            placeholder={'Enter ID'}
                                            //onBlur={this.props.checkAssessmentCodeValidity}
                                        />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className={'input-container'}>
                                        <label className={'form-label'}>Grading Scheme <Required/></label>
                                        <Select

                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            theme={selectThemeColors}
                                            className={'react-select'}
                                            classNamePrefix='select'
                                            value={typeof (form.gradingScheme) === "number" ? schemeList : form.gradingScheme}
                                            options={this.props.state.gradingSchemeList}
                                            isClearable={false}
                                            placeholder={'Select Scheme'}
                                            onChange={(e) => {
                                                this.props.onGradingSchemeDropDown(e)
                                            }}
                                            className={classnames(`react-select`, {'is-invalid': error.gradingScheme && form.gradingScheme === null})}
                                        />
                                    </div>
                                </Col>

                                <Col md={12}>
                                    <div>
                                        <label className={'form-label'}>Assessment Description</label>
                                        <Input invalid={error.schemeDescription}
                                            // onFocus={() => this.props.formValidate("ON_FOCUS")}
                                               onChange={this.props.onInputHandler}
                                               name={'desc'} value={form.desc}
                                               type={'textarea'}
                                               placeholder={'Enter Description '}
                                               style={{height: 120}}
                                               maxLength={250}
                                        />
                                        <div align={'right'}>
                                                <span
                                                    style={{color: 'rgb(187, 191, 187)'}}>{form.desc.length}/250</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <>
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

                            <div align={'center'} className={'mt-2'}>
                                {totalPercentage < 100 &&
                                <Button onClick={this.props.onGradingTableAddRow} color={'primary'} outline><Plus
                                    size={15}/> Add More Row</Button>}
                            </div>

                            <div align={'right'} className={'total-percentage-container'}>
                                <label>TOTAL PERCENTAGE: {totalPercentage}%</label>
                            </div>
                        </>

                    </ModalBody>
                    <ModalFooter>
                        <Button outline onClick={() => this.props.onTabHandler(1)} color='primary'>Back</Button>
                        <Button onClick={this.props.formValidate}
                                color='primary'>{this.props.isUpdate ? 'Update' : 'Save'}</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default GradeSchemeEditor
