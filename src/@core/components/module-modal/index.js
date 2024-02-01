// ** React Imports
import React, {Fragment, useEffect, useState} from 'react'

// ** Reactstrap Imports
import {Button, Modal, ModalBody, Row, Col, Label, Input, Card, CardBody, ListGroupItem} from 'reactstrap'
import './scss/_moduleModal.scss'
import classnames from "classnames"
import Select from 'react-select'
import {selectThemeColors, findObject, showError} from '@utils'
import {X, MessageCircle, File, Menu, Users, MinusCircle, Plus, Info} from 'react-feather'
import * as apiHaa from "@api/haa"
import {MODULE_TYPE, MODULE_CATEGORY, LECTURER_TYPES} from '@const'
import {addModuleErrors, moduleLecturerErrors} from '@formError/headOfAcademicAdmin'
import {addModuleValidation, moduleLecturerValidation} from '@validations/headOfAcademicAdmin'
import DataTable from "react-data-table-component"
import {ASSESSMENT_DETAILS_TABLE_COLUMN, ASSIGN_LECTURER_TABLE_COLUMN} from "./tableData"
import {toast} from "react-toastify"
import ConfirmBox from "@components/confirm-box"
import {manageSetup} from '@strings'

const array = {
    list1: []
}


class ModuleModal extends React.Component {

    state = {
        moduleName: '',
        moduleCode: '',
        description: '',
        credits: '',
        category: null,
        gpaType: null,
        moduleType: null,
        moduleLevel: null,
        lecturers: null,
        schemeId: null,
        tabType: 1,
        error: addModuleErrors,
        list: array.list1,
        schemeOption: [],
        levelOption: [],
        lecturerOption: [],
        lecturerList: [{name: '', type: '', cost: ''}],
        mlErrors: moduleLecturerErrors,
        schemeError: false,
        showWarningMsg: true,
        isModuleAssigned: false,
        showEditConfirm: false
    }


    componentDidMount() {
        this.loadSelectData()
    }


    loadSelectData = async () => {
        const assessment = await apiHaa.getAllAssessment()
        const moduleLevel = await apiHaa.getLevels()
        const lecturers = await apiHaa.getLecturers()

        if (this.props.moduleId !== '') {
            const module = await apiHaa.getSelectedModule(this.props.moduleId)
            if (module !== null) {

                let scheme = null
                let categoryList = null
                let type = null
                const lecturersList = []
                let level = null

                if (assessment.length !== 0) {
                    assessment.map(item => {
                        if (item.value === module.assessmentSchemeId) {
                            scheme = item
                            this.loadSchemeType(item, 'start')
                        }
                    })
                }

                if (MODULE_CATEGORY.length !== 0) {
                    MODULE_CATEGORY.map(item => {
                        if (item.value === module.moduleCategory) categoryList = item
                    })
                }

                if (MODULE_TYPE.length !== 0) {
                    MODULE_TYPE.map(item => {
                        if (item.value === module.moduleType) type = item
                    })
                }

                if (lecturers.length !== 0 && module.lecturers !== undefined && module.lecturers.length !== 0) {
                    module.lecturers.map(item => {
                        lecturers.map((lecturer, index) => {
                            if (item.lecturerId === lecturer.value) {
                                lecturersList.push({
                                    name: lecturer,
                                    type: lecturer.type !== null ? findObject(LECTURER_TYPES, lecturer.type).label : 'N/A',
                                    cost: item.cost === null ? '' : item.cost
                                })
                                lecturers.splice(index, 1)
                            }
                        })
                    })
                }

                if (module.levelId !== undefined && module.levelId !== null) {
                    level = {value: module.levelId, label: module.levelName}
                }


                this.setState({
                    schemeOption: assessment,
                    // levelOption: moduleLevel,
                    lecturerOption: lecturers,
                    moduleName: module.moduleName,
                    moduleCode: module.moduleCode,
                    description: module.description,
                    credits: module.noOfCredits,
                    category: categoryList,
                    // gpaType: module.gpaCalculate ? GPA_TYPE[0] : GPA_TYPE[1],
                    moduleType: type,
                    moduleLevel: level,
                    // lecturers: lecturerList,
                    lecturerList: lecturersList,
                    schemeId: scheme,
                    isModuleAssigned: module.moduleUsed ? module.moduleUsed : false
                })
            }
        } else {
            this.setState({
                schemeOption: assessment,
                // levelOption: moduleLevel,
                lecturerOption: lecturers
            })
        }
    }

    toggleModal = () => {
        this.props.modalFunction({type: 'close'})
    }

    onChangeText = (type, e) => {
        if (type === 'tbl') {
            const temp = this.state.lecturerList
            const name = [e.target.name].toString()
            temp[Number(name.split('-')[0])].cost = e.target.value
            this.setState({lecturerList: temp})
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    onDropDownHandler = (type, id, e) => {
        switch (type) {
            case 'tbl' :
                this.state.lecturerOption.map((item, index) => {
                    if (item === e) {
                        this.state.lecturerOption.splice(index, 1)
                    }
                })

                const temp = this.state.lecturerList
                const tempType = e.type !== null ? findObject(LECTURER_TYPES, e.type).label : 'N/A'
                if (this.state.lecturerList[id].name !== '') this.state.lecturerOption.push(this.state.lecturerList[id].name)
                temp[id].name = e
                temp[id].type = tempType
                temp[id].cost = e.cost !== null ? e.cost : ''
                this.setState({lecturerList: temp})
                break
            case 'category' :
                this.setState({category: e})
                break
            case 'gpaType' :
                this.setState({gpaType: e})
                break
            case 'moduleLevel' :
                this.setState({moduleLevel: e})
                break
            case 'moduleType' :
                this.setState({moduleType: e})
                break
            case 'lecturers' :
                this.setState({lecturers: e})
                break
        }
    }

    loadData = () => {
        const tableData = []
        if (this.state.list.length !== 0) {
            this.state.list.map((item, i) => {
                tableData.push(
                    {
                        order: i + 1,
                        name: <Input value={item.assessmentTypeName} readOnly={true}/>,
                        type: <Input value={item.configTypeName} readOnly={true}/>,
                        percentage: item.percentage
                    }
                )
            })
        }
        return tableData
    }

    loadSchemeType = async (data, type) => {
        const typeList = await apiHaa.getAllAssessmentSchemeType(data.value)
        this.setState({
            schemeId: data,
            list: typeList.length !== 0 ? typeList : []
        })
    }

    handleModule = async () => {

        const {moduleName, moduleCode, description, credits, gpaType, category, moduleLevel, moduleType, lecturers, schemeId, lecturerList} = this.state

        const data = {
            moduleId: this.props.moduleId === '' ? null : this.props.moduleId,
            moduleName,
            moduleCode,
            description,
            credits,
            category,
            gpaType,
            moduleType,
            schemeId,
            // moduleLevel,
            lecturers,
            lecturerList: this.state.lecturerList
        }

        const result = await apiHaa.addEditModule(data)
        if (result === 0) this.props.onSave && this.props.onSave()

    }

    handleTab = (id, type) => {

        const {
            moduleName, moduleCode, description, credits, gpaType, category, moduleLevel, moduleType, lecturers,
            schemeId, lecturerList, isModuleAssigned
        } = this.state

        if (type === 'BACK') {
            this.setState({tabType: id})
        } else {
            let mlRes = false
            // let isEmptyLectures = false
            switch (id) {
                case 2 :
                    const res = addModuleValidation(moduleName, moduleCode, credits, gpaType, category, moduleLevel, moduleType, lecturers)
                    if (res.moduleName || res.moduleCode || res.credits || res.gpa || res.category || res.moduleLevel || res.moduleType) {
                        this.setState({error: res})
                        showError()
                    } else {
                        this.setState({tabType: id, error: res})
                    }
                    break
                case 3 :

                    mlRes = moduleLecturerValidation(lecturerList)

                    if (mlRes.dataValues) {
                        this.setState({mlErrors: mlRes})
                        showError()
                    } else {
                        this.setState({tabType: id, mlErrors: moduleLecturerErrors})
                    }
                    break
                case 4 :
                    if (schemeId === null || schemeId.length === 0) {
                        this.setState({schemeError: true})
                        this.forceUpdate()
                        showError()
                    } else {
                        this.setState({schemeError: false})
                        isModuleAssigned ? this.setState({showEditConfirm: true}) : this.handleModule()
                    }
                    break

            }
        }
    }

    addRowAction = () => {
        this.state.lecturerList.push({name: '', type: '', cost: ''})
        this.forceUpdate()
    }

    removeRowAction = (id) => {
        if (this.state.lecturerList[id].name !== '') this.state.lecturerOption.push(this.state.lecturerList[id].name)
        this.state.lecturerList.length === 1 ? this.setState({lecturerList: [{name: '', type: '', cost: ''}]})
            : this.state.lecturerList.splice(id, 1)
        this.forceUpdate()
    }

    render() {

        const tableData = []
        const {
            moduleName, moduleCode, credits, gpaType, category, moduleLevel, moduleType, lecturers, schemeId, mlErrors,
            tabType, error, description, lecturerOption, levelOption, schemeOption, lecturerList, schemeError, showEditConfirm
        } = this.state

        if (lecturerList.length !== 0) {
            lecturerList.map((item, i) => {
                tableData.push(
                    {
                        name: <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            theme={selectThemeColors}
                            className={classnames('react-select', {'is-invalid': mlErrors.dataValues && item.name === ''})}
                            classNamePrefix='select'
                            value={item.name}
                            options={lecturerOption}
                            isClearable={false}
                            onChange={(e) => this.onDropDownHandler('tbl', i, e)}
                            placeholder={'Select Lecturer'}
                        />,
                        type: <Input value={item.type} readOnly={true} placeholder={'Type'}/>,
                        cost: <Input name={`${i}-cost`} value={item.cost}
                                     invalid={mlErrors.dataValues && item.cost === '' && item.type === LECTURER_TYPES[2].label}
                                     disabled={item.type !== LECTURER_TYPES[2].label}
                                     onChange={(e) => this.onChangeText('tbl', e)} autoComplete={'off'}
                                     placeholder={'Cost'}/>,
                        remove: <MinusCircle className={'remove-icon'} onClick={() => this.removeRowAction(i)}/>
                    }
                )
            })
        }

        return (
            <Modal
                isOpen={this.props.visible}
                toggle={() => this.toggleModal()}
                className={`modal-dialog-centered modal-lg`}
                style={{maxWidth: '1000px'}}
            >
                <ModalBody className={'module-modal'}>
                    <Row className={'heading-div'}>
                        <Col
                            xs={10}><Label>{this.props.manageType === 'edit' ? 'Module Information' : 'Add New Module'}</Label></Col>
                        <Col xs={2}>
                            <X id={'close-icon'} onClick={() => this.toggleModal()}/>
                        </Col>
                    </Row>
                    <Fragment>
                        <div className={'module-form'}>
                            <>
                                <Row>
                                    <Col xs={6}>
                                        <Row className={'field-row'}>
                                            <Col xs={4}><Label>Module Name<span>*</span></Label></Col>
                                            <Col xs={8}><Input value={moduleName} name='moduleName'
                                                               invalid={error.moduleName}
                                                               onChange={(e) => this.onChangeText('', e)}
                                                               placeholder={'Module name'}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={6}>
                                        <Row className={'field-row'}>
                                            <Col xs={4}><Label>Module Code<span>*</span></Label></Col>
                                            <Col xs={8}><Input value={moduleCode} name='moduleCode'
                                                               invalid={error.moduleCode}
                                                               onChange={(e) => this.onChangeText('', e)}
                                                               placeholder={'Module code'}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12}>
                                        <Row className={'field-row'}>
                                            <Col xs={2}><Label>Module Description</Label></Col>
                                            <Col xs={10}><Input type='textarea' value={description} name='description'
                                                                maxLength={250}
                                                                onChange={(e) => this.onChangeText('', e)}
                                                                placeholder={'Module description'}/>
                                                <span className='wordCount'>{`${description.length}/250`}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col xs={6}>
                                        <Row className={'field-row'}>
                                            <Col xs={4}><Label>Number of Credits<span>*</span></Label></Col>
                                            <Col xs={8}><Input value={credits} invalid={error.credits} type='number'
                                                               name='credits'
                                                               onChange={(e) => this.onChangeText('', e)}
                                                               placeholder={'No.of credits'}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={6}>
                                        <Row className={'field-row'}>
                                            <Col xs={4}><Label>Module Type<span>*</span></Label></Col>
                                            <Col xs={8}>
                                                <Select
                                                    theme={selectThemeColors}
                                                    className={classnames('react-select', {'is-invalid': error.moduleType})}
                                                    classNamePrefix='select'
                                                    // defaultValue={programOptions[0]}
                                                    value={moduleType}
                                                    options={MODULE_TYPE}
                                                    isClearable={false}
                                                    onChange={(e) => this.onDropDownHandler('moduleType', 0, e)}
                                                    placeholder={'Select module type'}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={6}>
                                        <Row className={'field-row'}>
                                            <Col xs={4}><Label>Lecturers<span>*</span></Label></Col>
                                            <Col xs={8}>
                                                <Select
                                                    theme={selectThemeColors}
                                                    className={classnames('react-select', {'is-invalid': error.lecturers})}
                                                    classNamePrefix='select'
                                                    // defaultValue={programOptions[0]}
                                                    value={lecturers}
                                                    options={lecturerOption}
                                                    isClearable={false}
                                                    isMulti
                                                    onChange={(e) => this.onDropDownHandler('lecturers', 0, e)}
                                                    placeholder={'Select lecturers'}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    {/*<Col xs={6}>*/}
                                        {/*<Row className={'field-row'}>*/}
                                            {/*<Col xs={4}><Label>Assessment Scheme<span>*</span></Label></Col>*/}
                                            {/*<Col xs={8}>*/}
                                                {/*<Select*/}
                                                    {/*theme={selectThemeColors}*/}
                                                    {/*className={classnames('react-select', {'is-invalid': schemeError})}*/}
                                                    {/*classNamePrefix='select'*/}
                                                    {/*// defaultValue={programOptions[0]}*/}
                                                    {/*value={schemeId}*/}
                                                    {/*options={schemeOption}*/}
                                                    {/*isClearable={false}*/}
                                                    {/*onChange={(e) => this.loadSchemeType(e,'change')}*/}
                                                    {/*placeholder={'Select scheme'}*/}
                                                {/*/>*/}
                                            {/*</Col>*/}
                                        {/*</Row>*/}
                                    {/*</Col>*/}
                                </Row>
                                <div className={'btn-div'}>
                                    <Button outline color='primary' size={'md'} className='me-1'
                                            onClick={this.toggleModal}>Cancel</Button>
                                    <Button color='primary' size={'md'} className='me-1'
                                            onClick={() => this.handleTab(2, 'NEXT')}>Save</Button>
                                </div>
                            </>
                        </div>
                    </Fragment>
                </ModalBody>
            </Modal>
        )
    }
}

export default ModuleModal
