import {Button, Col, Input, Label, Modal, ModalBody, ModalHeader, Row} from "reactstrap"
import {Edit} from "react-feather"
import DataTable from "react-data-table-component"
import {GRADING_SCHEME_TABLE_COLUMN} from "../../../views/headOfAcademicAdmin/scheme/grading/tableData"
import React, {useState, useEffect} from "react"
import './scss/_viewGradingModal.scss'
import {findObject} from '@utils'
import {OVERALL_MARK_CALCULATION} from '@const'
import * as Api from '@api/lecturer'

const ViewGradingScheme = (props) => {
    useEffect(async () => {
        const res = await Api.getGradingSchemeBySchemeId(props.data)
        setRes(res)
    }, [])

    const [res, setRes] = useState(null)

    const data = res
    let foundMark = null
    if (data && data.markCalculation) {
        foundMark = findObject(OVERALL_MARK_CALCULATION, data.markCalculation)
    }

    const tblData = []
    data && data.gradingTable.map(item => {
        tblData.push({
            markFrom: <Input className={'table-input'} readOnly disabled={true} value={item.markFrom}/>,
            markTo: <Input className={'table-input'} readOnly disabled={true} value={item.markTo}/>,
            grade: <Input className={'table-input'} readOnly disabled={true} value={item.grade}/>,
            desc: <Input className={'table-input'} readOnly disabled={true} value={item.description}/>,
            passFail: <Input className={`table-input ${item.isPass ? 'pass' : 'fail'}`} readOnly
                             disabled={true}
                             value={item.isPass ? 'Pass' : 'Fail'}/>,
            gradePoint: <Input className={'table-input'} readOnly disabled={true} value={item.gradePoint}/>
        })
    })
    return (
        <Modal
            isOpen={props.isOpen}
            toggle={props.toggleModal}
            className={`modal-dialog-centered modal-md`}
            style={{maxWidth: '1000px'}}
        >
            <ModalHeader toggle={props.toggleModal}>
                {props.title}
            </ModalHeader>
            <ModalBody>
                <div className={'scheme-container'}>
                    <div className={'scheme-form'}>
                        <Row>
                            <Col md={6}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Grading Scheme ID</Label>
                                    <Input
                                        id='name'
                                        readOnly
                                        disabled={true}
                                        value={data && data.gradingSchemeIdCode}
                                    />
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Overall Mark Calculation</Label>
                                    <Input
                                        id='name'
                                        readOnly
                                        placeholder={'All'}
                                        disabled={true}
                                        value={foundMark && foundMark.label}
                                    />
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className={'mb-2'}>
                                    <Label for='name'>Grading Scheme Description</Label>
                                    <Input
                                        type={'textarea'}
                                        id='name'
                                        readOnly
                                        style={{height: '80px'}}
                                        disabled={true}
                                        value={data && data.gradingSchemeDecription}
                                    />
                                </div>
                            </Col>

                            <Col md={6}>
                                <div className={'mb-2'}>
                                    <div className={'mb-2'}>
                                        {/*<Label for='name'>Previous Grading Scheme</Label>*/}
                                        {/*<Input*/}
                                        {/*    id='name'*/}
                                        {/*    readOnly*/}
                                        {/*    disabled={isDisabled}*/}
                                        {/*    value={selectedGradingScheme.previousGradingPercentage}*/}
                                        {/*/>*/}
                                    </div>

                                    <Row>
                                        <Col md={6}>
                                            <div className={'checkbox-container'}>
                                                <Label for='name'>Pass All Required</Label>
                                                <Input
                                                    className={'scheme-checkbox'}
                                                    type={'checkbox'}
                                                    readOnly
                                                    disabled={true}
                                                    checked={data && data.passAllRequired}
                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className={'checkbox-container'}>
                                                <Label for='name'>Commensurable Fail</Label>
                                                <Input
                                                    className={'scheme-checkbox'}
                                                    type={'checkbox'}
                                                    readOnly
                                                    disabled={true}
                                                    checked={data && data.compensatableFail}
                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className={'checkbox-container'}>
                                                <Label for='name'>Force Min. Passing</Label>
                                                <Input
                                                    className={'scheme-checkbox'}
                                                    type={'checkbox'}
                                                    readOnly
                                                    disabled={true}
                                                    checked={data && data.forceMinPassing}
                                                />
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className={'checkbox-container'}>
                                                <Label for='name'>Round Up</Label>
                                                <Input
                                                    className={'scheme-checkbox'}
                                                    type={'checkbox'}
                                                    readOnly
                                                    disabled={true}
                                                    checked={data && data.roundUp}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    {
                        <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                columns={GRADING_SCHEME_TABLE_COLUMN}
                                paginationPerPage={10}
                                className='react-dataTable'
                                pagination={false}
                                data={tblData}
                            />
                        </div>
                    }
                </div>
            </ModalBody>
        </Modal>)
}

export default ViewGradingScheme
