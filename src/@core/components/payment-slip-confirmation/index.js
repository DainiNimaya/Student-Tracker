import React, {Component, useEffect, useState} from 'react'
import {
    Button,
    Col,
    Input,
    Label,
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Row
} from "reactstrap"
import './scss/_paymentSlip.scss'
import slipImage from '../../../assets/images/financeExecutive/slip.png'
import Flatpickr from "react-flatpickr"
import {DATE_RANGE_FORMAT, DATE_FORMAT_TABLE, EMPTY_FILE} from '@const'
import moment from "moment"
import Select from "react-select"
import classnames from "classnames"
import {selectThemeColors, showError, getDaysFromRange, findObject, checkCurrencyType} from '@utils'
import * as Api from "@api/haa"
import FilePreview from "../file-preview"

const PaymentSlipConfirmation = ({title, data, isOpen, modalHandler, onInputHandler, dateRangeHandler, onSubmit, error, banks}) => {

    const currency = checkCurrencyType(data.enrollmentRequests)

    return <><Offcanvas
        scrollable={true}
        backdrop={true}
        direction='end'
        isOpen={isOpen}
        toggle={() => modalHandler(false)}
    >
        <OffcanvasHeader
            toggle={() => modalHandler(false)}
        >{title}</OffcanvasHeader>
        <OffcanvasBody className='mx-0 flex-grow-0 overflow-auto mt-1'>
            <Row>
                <Col md={12}>
                    <div className={'title'}>
                        <label className={'refno'}>Ref: {data.apiitRefNo}</label>
                        <label className={'name'}>{data.studentName}</label>
                    </div>

                    <div className={'payment-slip-section'}>
                        <label className={'name'}>Payment Slip</label>
                    </div>

                    <div className={'slip-form'}>
                        <div style={{display: 'grid', gridTemplateColumns: 'auto auto auto'}}>
                            {data.enrollmentRequests.map(item => {
                                    return item.bankSlip ?
                                        <FilePreview path={item.bankSlip}/> :
                                        <img src={EMPTY_FILE} width={100}/>
                                }
                            )}
                        </div>

                        <div className={'form'}>
                            <div className={'form-section'}>
                                <Label>{`Amount ${currency ? `(${currency})` : ''}`}</Label>
                                <Input
                                    invalid={error.amount && (data.amount === '' || Number.parseInt(data.amount) < 1)}
                                    placeholder={'Enter amount'}
                                    type={'number'}
                                    name={'amount'}
                                    onChange={onInputHandler} value={data.amount}/>
                            </div>

                            <div className={'form-section'}>
                                <Label>Deposited Date</Label>
                                <Flatpickr
                                    className={`form-control ${error.depositedDate && data.depositedDate === '' ? 'invalid' : 'valid'}`}
                                    value={data.depositedDate ? moment(data.depositedDate).format(DATE_FORMAT_TABLE) : null}
                                    onChange={dateRangeHandler}
                                    placeholder={'Select date'}
                                    options={{
                                        dateFormat: DATE_RANGE_FORMAT,
                                        maxDate: new Date()
                                    }}
                                />
                            </div>

                            <div className={'form-section'}>
                                <Label>Deposited Bank</Label>

                                <Select
                                    theme={selectThemeColors}
                                    className={classnames('react-select', {'is-invalid': error.bank && data.bank === undefined})}
                                    classNamePrefix='select'
                                    value={data.bank}
                                    options={banks}
                                    isClearable={false}
                                    onChange={(e) => onInputHandler({target: {value: e, name: 'bank'}})}
                                    placeholder={'Select bank'}
                                />
                            </div>

                            <div className={'form-section'}>
                                <Label>Remark</Label>
                                <Input invalid={error.remark && data.remark === ''} placeholder={'Enter remark'}
                                       name={'remark'}
                                       onChange={onInputHandler}
                                       value={data.remark}
                                       type={'textarea'}
                                       maxlength={250}
                                />
                                <div align={'right'}>
                                    <span
                                        style={data.remark.length === 250 ? {color: 'red'} : {}}>{data.remark.length}/250</span>
                                </div>
                            </div>

                            <div align={'center'}>
                                <Button onClick={() => onSubmit('APPROVED')} className={'btn-approve'}
                                        color={'primary'}>Approve</Button>
                                <p className={'lbl-or'}>or</p>
                                <Button onClick={() => onSubmit('REJECTED')} className={'btn-approve'} color={'danger'}
                                        outline>Reject</Button>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </OffcanvasBody>
    </Offcanvas></>
}

export default PaymentSlipConfirmation
