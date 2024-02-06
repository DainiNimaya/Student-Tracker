import React, {useEffect, useState} from 'react'
import {Alert, Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from 'reactstrap'
import Required from "@components/required"
import Select from "react-select"
import classnames from "classnames"
import {createBatchCreateRequestDataObject, findObject, selectThemeColors, showError} from '@utils'
// import {STUDY_MODES} from '@const'
import Flatpickr from "react-flatpickr"
import {addBatchErrors} from "@formError/headOfAcademicAdmin"
import {addBatchValidation} from "@validations/headOfAcademicAdmin"
import * as Api from "@api/haa_"
import moment from "moment"
import './style.scss'
import {componentsBatch} from '@strings'
import {accessList} from '@configs/basicInfomationConfig'

export default ({
                    visible,
                    toggleModal,
                    title,
                    onSave,
                    batchId
                }) => {

    const [state, setState] = useState({
        batchId: undefined,
        batchIndex: '',
        batchCode: '',
        displayName: '',
        intakeCode: undefined,
        startDate: undefined,
        endDate: undefined,
        orientationDate: undefined,
        duration: '',
        // studyMode: undefined,
        branch: undefined,
        feeScheme: undefined,
        studentLimit: ''
    })
    const [intakeList, setIntakeList] = useState([])
    const [branches, setBranches] = useState([])
    const [batches, setBatches] = useState([])
    const [copiedBatch, setCopiedBatch] = useState(null)
    const [schemes, setSchemes] = useState([])
    const [error, setError] = useState(addBatchErrors)
    const [isBatchAssigned, setIsBatchAssigned] = useState(false)
    const [isSchemeErrorShown, setIsSchemeErrorShown] = useState(false)

    useEffect(async () => {
        if (batchId !== undefined) {
            await getBatchDetails()
            await checkAssignedStatus()
        }
    }, [])

    const checkAssignedStatus = async () => {
        const res = await Api.checkBatchAssignedStatus(batchId)
        setIsBatchAssigned(res)
    }

    const getBatchDetails = async (branchList) => {
        const res = await Api.getSelectedBatch(batchId)
        await setFormData(res, branchList)
    }

    const setFormData = async (res, branchList) => {
        if (res) {
            const data = {...state}
            const schms = await loadFeeSchemes(res.intakeId)
            data.batchId = batchId
            data.batchCode = res.batchCode
            data.batchIndex = res.batchIndex
            data.displayName = res.displayName ? res.displayName : ''
            data.intakeCode = findObject(intakeList, res.intakeId)
            data.startDate = new Date(moment(res.startDate))
            data.endDate = new Date(moment(res.endDate))
            data.orientationDate = res.orientationDate !== null ? new Date(moment(res.orientationDate)) : undefined
            data.duration = res.duration === 0 ? '' : res.duration
            data.feeScheme = findObject(schms, res.feeScheme)
            data.branch = findObject(branchList, res.branch)
            data.studentLimit = res.studentLimit
            // if (accessList.allowStudyMode) data.studyMode = findObject(STUDY_MODES, res.studyMode)
            setState(data)
        }
    }

    const onChangeValue = async (e) => {
        const data = {...state}
        if (e.target.name === 'intakeCode') {
            await loadFeeSchemes(e.target.value.value)
            data.feeScheme = null
        }
        data[e.target.name] = e.target.value
        await setState({...data})
    }

    const onClickSave = async () => {
        const res = addBatchValidation(state)
        setError(res)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }
        const body = createBatchCreateRequestDataObject(state)
        const res2 = await Api.saveBatch(body)
        if (res2) {
            onSave()
        }
    }

    let duration = state.duration

    if (state.startDate && state.endDate) {
        const start = moment(state.startDate, "YYYY-MM-DD")
        const end = moment(state.endDate, "YYYY-MM-DD")
        duration = moment.duration(end.diff(start)).asMonths().toFixed(0)
        duration = duration <= 0 ? 1 : duration
    }

    const disableOrientation = batchId ? moment().isAfter(moment(state.startDate)) : false

    const copyBatch = async () => {
        await setFormData(copiedBatch.data, branches)
    }

    return <Modal
        isOpen={visible}
        toggle={toggleModal}
        className={`modal-dialog-centered modal-lg`}
        style={{maxWidth: '1000px'}}
    >
        <ModalHeader toggle={toggleModal}>
            {title}
        </ModalHeader>
        <ModalBody className={'create-batch-modal'}>
            <Row>
                <Col sm={6}>
                    <Row className='mb-1'>
                        <Label sm='3'>
                            Batch Code<Required/>
                        </Label>
                        <Col sm='9'>
                            <Input
                                type='text'
                                name='batchCode'
                                id='batchCode'
                                value={state.batchCode}
                                invalid={error.batchCode}
                                onChange={onChangeValue}
                                placeholder='Batch Code'/>
                        </Col>
                    </Row>
                </Col>

                <Col sm={6}>
                    <Row className='mb-1'>
                        <Label sm='3'>
                            Display Name<Required/>
                        </Label>
                        <Col sm='9'>
                            <Input
                                type='text'
                                name='displayName'
                                id='displayName'
                                value={state.displayName}
                                invalid={error.displayName}
                                onChange={onChangeValue}
                                placeholder='Display Name'/>
                        </Col>
                    </Row>
                </Col>

                {accessList.allowBatchIndex && <Col sm={6}>
                    <Row className='mb-1'>
                        <Label sm='3'>
                            Batch Index<Required/>
                        </Label>
                        <Col sm='9'>
                            <Input
                                type='text'
                                name='batchIndex'
                                id='batchIndex'
                                value={state.batchIndex}
                                invalid={error.batchIndex}
                                onChange={onChangeValue}
                                placeholder='Batch Index'
                                disabled={isBatchAssigned}
                            />
                        </Col>
                    </Row>
                </Col>}

                <Col sm='6'>
                    <Row className='mb-1'>
                        <Label sm='3'>
                            Intake Code<Required/>
                        </Label>
                        <Col sm='9'>
                            <Select
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                theme={selectThemeColors}
                                className={classnames('react-select', {'is-invalid': error.intakeCode})}
                                classNamePrefix='select'
                                value={state.intakeCode}
                                onChange={value => onChangeValue({target: {name: 'intakeCode', value}})}
                                options={intakeList}
                                isClearable={false}
                                placeholder="Intake Code"
                                isDisabled={isBatchAssigned}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col sm='6'>
                    <Row className='mb-2'>
                        <Label sm='3' for='dateOfBirth'>
                            Start Date<Required/>
                        </Label>
                        <Col sm='9'>
                            <Flatpickr
                                className={`form-control ${error.startDate ? 'validation-error-date-picker' : 'validation-ok-dp'}`}
                                value={state.startDate}
                                placeholder="Select Start Date"
                                options={{
                                    minDate: undefined,
                                    maxDate: batchId || state.endDate ? state.endDate : undefined
                                }}
                                readOnly={false}
                                onChange={value => onChangeValue({target: {name: 'startDate', value: value[0]}})}
                                id='startDate'/>
                        </Col>
                    </Row>
                </Col>

                <Col sm='6'>
                    <Row className='mb-2'>
                        <Label sm='3' for='dateOfBirth'>
                            End Date<Required/>
                        </Label>
                        <Col sm='9'>
                            <Flatpickr
                                className={`form-control ${error.endDate ? 'validation-error-date-picker' : 'validation-ok-dp'}`}
                                value={state.endDate}
                                placeholder="Select End Date"
                                options={{
                                    minDate: batchId ? state.startDate : state.startDate ?? 'today'
                                }}
                                readOnly={false}
                                onChange={value => onChangeValue({target: {name: 'endDate', value: value[0]}})}
                                id='endDate'/>
                        </Col>
                    </Row>
                </Col>

                <Col sm={6}>
                    <Row className='mb-1'>
                        <Label sm='3'>
                            Orientation Date
                        </Label>
                        <Col sm='9'>
                            <Flatpickr
                                className={`form-control 
                                    ${error.orientationDate
                                    ? 'validation-error-date-picker'
                                    : 'validation-ok-dp'}
                                        ${disableOrientation && 'disabled'}`}
                                value={state.orientationDate}
                                placeholder="Select Orientation Date"
                                options={{minDate: '2000/01/01'}}
                                readOnly={false}
                                onChange={value => onChangeValue({
                                    target: {
                                        name: 'orientationDate',
                                        value: value[0]
                                    }
                                })}
                                id='orientationDate'
                                disabled={disableOrientation}
                            />
                        </Col>
                    </Row>
                </Col>
                {accessList.allowStudentLimit && <Col sm='6'>
                    <Row className='mb-1'>
                        <Label sm='3'>
                            Batch Capacity<Required/>
                        </Label>
                        <Col sm='9'>
                            <Input
                                type='number'
                                name='studentLimit'
                                onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190) && e.preventDefault()}
                                id='studentLimit'
                                value={state.studentLimit}
                                invalid={error.studentLimit}
                                onChange={onChangeValue}
                                placeholder='Batch Capacity'/>
                        </Col>
                    </Row>
                </Col>}
            </Row>
        </ModalBody>
        <ModalFooter>
            <Button className='me-1' outline color='primary' type='button'
                    onClick={toggleModal}>
                Cancel
            </Button>
            <Button color='primary' type='button' onClick={onClickSave}>
                Save
            </Button>
        </ModalFooter>
    </Modal>
}
