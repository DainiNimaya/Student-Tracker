import React, {Component} from "react"
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Row, Col} from 'reactstrap'
import {Info, Layout, MinusCircle, Plus} from "react-feather"
import Select from "react-select"
import {GRADING_SCHEME_STATUS, OVERALL_MARK_CALCULATION} from '@const'
import {selectThemeColors} from '@utils'
import './scss/_generalInformation.scss'
import DataTable from "react-data-table-component"
import {GRADING_SCHEME_TABLE_COLUMN} from "./tableData"
import './scss/_gradingTable.scss'
import classnames from "classnames"
import Required from "@components/required"
import * as Api from '@api/haa'

class GradeSchemeEditor extends Component {

    state = {
        idError: false,
        tempId: this.props.state.form.schemeId
    }

    checkSchemeIdDuplicate = async () => {
        const id = this.props.state.form.schemeId.trim()
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
        const id = this.props.state.form.schemeId.trim()
        const res = await Api.checkGradingSchemeDuplicate(id)
        this.setState({
            idError: !res
        })
        if (res === true) this.props.formValidate()
    }

    render() {
        const {tab, form, error, gradingTableData, gradingError} = this.props.state

        const data = []
        gradingTableData.map((item, i) => {
            const passFail = item.passFail.value
            data.push({
                markFrom: <Input invalid={gradingError.markFrom && item.markFrom === ''} type={'number'}
                                 name={`${i}-markFrom`}
                                 onChange={this.props.onRowInputHandler}
                                 className={'table-input'}
                                 value={item.markFrom}/>,
                markTo: <Input invalid={gradingError.markTo && item.markTo === ''} type={'number'} name={`${i}-markTo`}
                               onChange={this.props.onRowInputHandler}
                               className={'table-input'}
                               value={item.markTo}/>,
                grade: <Input invalid={gradingError.grade && item.grade === ''} name={`${i}-grade`}
                              onChange={this.props.onRowInputHandler}
                              className={'table-input'}
                              value={item.grade}/>,
                desc: <Input invalid={gradingError.desc && item.desc === ''} name={`${i}-desc`}
                             onChange={this.props.onRowInputHandler}
                             value={item.desc}/>,
                passFail: (<Select
                    menuPortalTarget={document.body}
                    theme={selectThemeColors}
                    className={'react-select'}
                    classNamePrefix='select'
                    value={item.passFail}
                    options={GRADING_SCHEME_STATUS}
                    isClearable={false}
                    className={classnames(`react-select ${passFail === 'PASS' ? 'pass' : passFail === 'FAIL' ? 'is-invalid' : ''}`, {'is-invalid': gradingError.passFail && item.passFail === ''})}
                    placeholder={'Select Pass / Fail'}
                    onChange={(e) => this.props.onDropDownHandler(i, e)}
                    styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                />),
                gradePoint: <Input invalid={gradingError.gradePoint && item.gradePoint === ''} type={'number'}
                                   name={`${i}-gradePoint`}
                                   onChange={this.props.onRowInputHandler}
                                   className={'table-input'} value={item.gradePoint}/>,
                remove: <MinusCircle invalid={gradingError.remove} onClick={() => this.props.onGradingTableRemoveRow(i)}
                                     className={'btn-remove'} size={20}/>
            })
        })

        return (
            <>
                <Modal
                    isOpen={this.props.isModal}
                    // toggle={() => this.props.modalHandler(false)}
                    className={`modal-dialog-centered modal-lg`}
                    scrollable
                    style={{maxWidth: '1000px'}}
                >
                    <ModalHeader toggle={() => this.props.modalHandler(false)}>
                        {this.props.title}
                    </ModalHeader>
                    <ModalBody>

                        <div className={'general-information'}>
                            <Row>
                                <Col md={6}>
                                    <div className={'input-container'}>
                                        <label className={'form-label'}>Grading Scheme ID <Required/></label>
                                        <Input
                                            invalid={(error.schemeId && form.schemeId === '') || this.state.idError}
                                            onChange={this.props.onInputHandler}
                                            name={'schemeId'}
                                            value={form.schemeId}
                                            placeholder={'Enter ID'}
                                            // onBlur={this.checkSchemeIdDuplicate}
                                        />
                                    </div>
                                </Col>

                                <Col md={12}>
                                    <div className={'input-container'}>
                                        <label className={'form-label'}>Grading Scheme Description</label>
                                        <Input
                                            onChange={this.props.onInputHandler}
                                            name={'schemeDescription'} value={form.schemeDescription}
                                            type={'textarea'}
                                            maxLength={250}
                                            placeholder={'Enter Description '}/>
                                        <div align={'right'}>
                                                <span
                                                    style={{color: '#bbbfbb'}}>{form.schemeDescription.length}/250</span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <div className={'grading-table'}>
                            <div className='react-dataTable'>
                                <DataTable
                                    noHeader
                                    columns={GRADING_SCHEME_TABLE_COLUMN}
                                    paginationPerPage={10}
                                    className='react-dataTable'
                                    pagination={false}
                                    data={data}
                                />
                            </div>

                            <div align={'center'} className={'mt-2'}>
                                <Button onClick={this.props.onGradingTableAddRow} color={'primary'} outline><Plus
                                    size={15}/> Add
                                    More Row</Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button outline onClick={this.checkSchemeIdDuplicate} color='primary'>
                            Next
                        </Button>
                        <Button onClick={this.props.formValidate}
                                color='primary'>{this.props.isUpdate ? 'Update' : 'Save'}</Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

export default GradeSchemeEditor
