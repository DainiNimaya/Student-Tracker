import React, {Fragment, useEffect, useState, forceRender} from 'react'
import {Button, Modal, ModalBody, Row, Col, Label, Input} from 'reactstrap'
import './scss/_courseModal.scss'
import {selectThemeColors, showError, findObject} from '@utils'
import {X, Edit} from 'react-feather'
import * as apiHaa from "@api/haa"
import {DEGREE_STATUS} from '@const'
import {addCourseErrors, courseLevelErrors} from '@formError/headOfAcademicAdmin'
import {addCourseValidation, courseLevelValidation, Amount_REGEX, Number_REGEX} from '@validations/headOfAcademicAdmin'
import {accessList} from '@configs/basicInfomationConfig'

class CourseModal extends React.Component {

    state = {
        programmeName: '',
        description: '',
        allowEdit: false
    }

    componentDidMount() {
        this.loadSelectData()
    }

    loadSelectData = async () => {
        if (this.props.programmeId) {
            this.setState({
                courseName: course.courseName === null ? '' : course.courseName,
                description: course.courseDescription === null ? '' : course.courseDescription,
            })
        }
    }

    toggleModal = () => {
        this.props.modalFunction({type: 'close'})
    }

    handleProgramme = async () => {

        const { programmeName, description} = this.state
        if (programmeName.trim() !== '' && description.trim() !== '') {
            const data = {
                programmeId: this.props.programmeId ?? null,
                programmeName,
                description
            }
            const result = await apiHaa.createEditProgramme(data)
            if (result === 0) {
                this.props.callback()
            }
        } else {

        }
    }

    onChangeAction = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {

        const { programmeName, description,allowEdit } = this.state
        const reacOnlyCondition = this.props.manageType === 'edit' && !this.state.allowEdit

        return (<>
            <Modal
                isOpen={this.props.visible}
                // toggle={() => this.toggleModal()}
                className={`modal-dialog-centered modal-lg`}
                style={{maxWidth: '1000px'}}
            >
                <ModalBody className={'course-modal'}>
                    <Row className={'heading-div'}>
                        <Col
                            xs={10}><Label>{this.props.manageType !== 'edit' ? 'Add Programme' : !allowEdit ? 'Programme Information' : 'Edit Programme Information'}</Label></Col>
                        <Col xs={2}>
                            {
                                this.props.manageType === 'edit' && !allowEdit &&
                                <Button className='me-1' outline color='primary'
                                        onClick={() => this.handleAllowEdit(true)}>
                                    <Edit size={13} id={'edit-icon'}/>Edit</Button>
                            }
                            <X id={'close-icon'} onClick={() => this.toggleModal()}/>
                        </Col>
                    </Row>
                    <Fragment>
                        <div className={'course-form'}>
                            <>
                                <Row>
                                    <Col xs={6}>
                                        <Row className={'field-row'}>
                                            <Col xs={4}><Label>Programme Name<span>*</span></Label></Col>
                                            <Col xs={8}><Input value={programmeName} name='courseName'
                                                               readOnly={reacOnlyCondition}
                                                               onChange={(e) => this.onChangeAction(e)}
                                                               placeholder={'Programme name'}
                                                               // invalid={error.courseName && courseName === ''}
                                            />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12}>
                                        <Row className={'field-row'}>
                                            <Col xs={2}><Label>Description<span>*</span></Label></Col>
                                            <Col xs={10}><Input type='textarea' value={description}
                                                                name='description'
                                                                maxLength={250}
                                                                readOnly={reacOnlyCondition}
                                                                placeholder={'Programme description'}
                                                                onChange={(e) => this.onChangeAction(e)}/>
                                                <span className='wordCount'>{`${description.length}/250`}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        </div>
                        <div className={'btn-div'}>
                            <Button outline color='primary' size={'md'} className='me-1' onClick={() => this.toggleModal()}>Cancel</Button>
                            {this.props.manageType === 'add' &&
                                <Button color='primary' size={'md'} onClick={() => this.handleProgramme()}>Save</Button>}
                            {this.props.manageType === 'edit' && this.state.allowEdit &&
                                <Button color='primary' size={'md'} onClick={() => this.handleProgramme()}>Save Changes</Button>}
                        </div>
                    </Fragment>
                </ModalBody>
            </Modal>
        </>)
    }
}

export default CourseModal
