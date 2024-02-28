import {Modal, ModalHeader, ModalBody, Button, ModalFooter, Input, Label} from "reactstrap"
import {AlertTriangle} from 'react-feather'
import './scss/_confirmBox.scss'
import React, {useState} from "react"
import * as feApi from '@api/fe'

const ConfirmModal = (props) => {

    const [mode, setMode] = useState('')


    const toggleModal = () => {
        props.close('')
    }

    const sendAction = async () => {
        const result = await feApi.sendRemind({id:props.id, type:mode})
        if (result === 0) props.close('')
    }

    return <Modal
        isOpen={props.isOpen}
        toggle={toggleModal}
        className={`modal-dialog-centered `}
        id={'pc-confirm'}
    >
        <ModalHeader toggle={toggleModal}>Reminder</ModalHeader>
        <ModalBody>
            <div className="d-flex flex-row align-items-center">
                <AlertTriangle id={'icon-alert'}/>
                <p className="confirm-msg">How do you like to send the remind?</p>
            </div>
            <div className={'checkbox-div'}>
                <div className='form-check form-check-inline'>
                    <Input type='checkbox'
                           value={'EMAIL'}
                           checked={mode === 'EMAIL'}
                           onChange={(e) => setMode(e.target.value)}
                    />
                    <Label>Email</Label>
                </div>
                {/*<div className='form-check form-check-inline'>*/}
                    {/*<Input type='checkbox'*/}
                           {/*value={'SMS'}*/}
                           {/*checked={mode === 'SMS'}*/}
                           {/*onChange={(e) => setMode(e.target.value)}*/}
                    {/*/>*/}
                    {/*<Label>SMS</Label>*/}
                {/*</div>*/}
            </div>
        </ModalBody>
        <ModalFooter>
            <Button color='primary' type='button' disabled={mode === ''} onClick={() => sendAction()}>
                Send
            </Button>
            <Button className='me-1' outline color='primary' type='button' onClick={() => toggleModal()} >
                Cancel
            </Button>

        </ModalFooter>
    </Modal>
}

export default ConfirmModal
