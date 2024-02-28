import React, {useEffect, useState} from "react"
import Sidebar from '@components/sidebar'
import {Label, Row, Col, Input, Badge, Button, Alert} from "reactstrap"
import {configValidation} from '@validations/headOfAcademicAdmin'
import {configErrors} from '@formError/headOfAcademicAdmin'
import * as apiHaa from "@api/haa"
import * as apiItAdmin from '@api/itAdmin'
import classnames from "classnames"
import Select from 'react-select'
import {selectThemeColors, showError, getDaysFromRange, findObject} from '@utils'
import Required from "@components/required"
import {HOLIDAY_TYPES, ACCOUNT_TYPES} from '@const'
import {DatePicker} from "antd"
import moment from "moment"
import Flatpickr from "react-flatpickr"
import './scss/_configuration.scss'
import Switch from "@components/switch"

const ConfigSidebar = (props) => {

    const [id_, setId] = useState(null)
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [text3, setText3] = useState('')
    const [text4, setText4] = useState('')
    const [text5, setText5] = useState('')
    const [text6, setText6] = useState(undefined)
    const [isExam, setIsExam] = useState(false)
    const [error, setError] = useState(configErrors)
    const [branchOption, setBranchOption] = useState([])
    const [minDate, setMinDate] = useState('today')


    useEffect(() => {
        props.data.type === 'VENUE' && loadSelectionValues()
        if (props.data.editData !== undefined) {
            setId(props.data.editData.id)
            setText1(props.data.editData.text1 !== null ? props.data.editData.text1 : '')
            setText2(props.data.editData.text2 !== null ? props.data.editData.text2 : '')
            setText3(props.data.editData.text3 !== null ? props.data.editData.text3 : '')
            if (props?.data?.editData?.text3) {
                setMinDate(`${props?.data?.editData?.text3}-01-01`)
            }
            setText4(props.data.editData.text4 !== null ? props.data.editData.text4 : '')
            if (props.data.type === 'BANK') {
                setText5(props.data.editData.text5 !== null ? props.data.editData.text5 : '')
                setText6(props.data.editData.text6 !== null ? findObject(ACCOUNT_TYPES, props.data.editData.text6) : undefined)
            }
            props.data.editData.examType && setIsExam(props.data.editData.examType)
        }
    }, [])

    const loadSelectionValues = async () => {
        const branchList = await apiHaa.getAllBranches()
        setBranchOption(branchList)
        if (props.data.editData !== undefined) {

            setText3(props.data.editData.text3)
        }
    }

    const closeSidebar = () => {
        props.onClose({type: 'close'})
    }

    const manageConfiguration = async () => {
        const res = configValidation(text1, text2, text3, text4, text5, text6, props.data.type)
        setError(res)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        let data = {}

        switch (props.data.type) {
            case 'INTAKE':
                data = {
                    id: id_,
                    type: 'INTAKE',
                    name: text1,
                    code: text2,
                    ongoing: props.data.editData !== undefined ? props.data.editData.ongoing : false
                }
                break
            case 'PROVIDE':
                data = {id: id_, type: 'PROVIDER_CODE', name: text1, code: text2}
                break
            case 'ASSESSMENT':
                data = {id: id_, type: 'ASSESSMENT_TYPE', name: text1, examType: isExam}
                break
            case 'LEVEL':
                data = {id: id_, type: 'LEVEL', name: text1}
                break
            case 'SEMESTER':
                data = {id: id_, type: 'SEMESTER', name: text1}
                break
            case 'VENUE':
                data = {id: id_, type: 'VENUE', name: text1, capacity: text2, branchId: text3.value}
                break
            case 'HOLIDAY':
                data = {
                    holidayId: id_,
                    holidayName: text1,
                    holidayType: text2.value,
                    year: text3,
                    dates: getDaysFromRange(moment(text4[0]).format('YYYY-MM-DD'), moment(text4[1]).format('YYYY-MM-DD'))
                }
                break
            case 'SCHOOL':
                data = {id: id_, name: text1, description: text2}
                break
            case 'BRANCH':
                data = {branchId: id_, branchName: text1, branchAddress: text2}
                break
            case 'BANK':
                data = {
                    type: 'BANK',
                    id: id_,
                    name: text1,
                    accountNumber: text2,
                    branch: text3,
                    swiftCode: text4,
                    code: text5,
                    accountType: text6.value,
                    visibility: id_ === null ? true : undefined
                }
                break
        }

        if (props.data.type === 'HOLIDAY') {
            const result = await apiHaa.saveEditHoliday(data)
            if (result === 0) props.onClose({type: 'saved'})
        } else if (props.data.type === 'SCHOOL') {
            const result = await apiHaa.addEditSchool(data)
            if (result === 0) props.onClose({type: 'saved'})
        } else if (props.data.type === 'BRANCH') {
            const result = await apiItAdmin.createEditBranch(data)
            if (result === 0) props.onClose({type: 'saved'})
        } else {
            const result = await apiHaa.createEditConfig(data)
            if (result === 0) props.onClose({type: 'saved'})
        }

    }

    const handleYearPicker = (date, dateString) => {
        setText3(dateString)
        setText4('')
        if (dateString !== moment().year().toString()) {
            setMinDate(`${dateString}-01-01`)
        }
    }

    return (
        <Sidebar
            size='lg'
            open={props.open}
            title={props.data.title}
            headerClassName='mb-1'
            contentClassName='p-0'
            toggleSidebar={closeSidebar}
            className={'config-sidebar'}
        >

            <Row>
                <Col xs={12} className='mb-1'>
                    <Label>{props.data.text1}<Required/></Label>
                    <Input value={text1} invalid={error.text1 && text1.length === 0}
                           onChange={(e) => setText1(e.target.value)}
                           placeholder={props.data.type === 'INTAKE' ? 'Intake Name' :
                               props.data.type === 'PROVIDE' ? 'Provide Name' :
                                   props.data.type === 'ASSESSMENT' ? 'Assessment Type' :
                                       props.data.type === 'LEVEL' ? 'Level' :
                                           props.data.type === 'SEMESTER' ? 'Semester' :
                                               props.data.type === 'VENUE' ? 'Venue Name' :
                                                   props.data.type === 'BANK' ? 'Bank Name' :
                                                       props.data.type === 'HOLIDAY' ? 'Holiday Name' : 'Name'}
                    />
                </Col>
                {
                    props.data.type === 'ASSESSMENT' && <Col xs={12} className='mb-1' id='exam-toggle'>
                        <div className='d-flex flex-column '>
                            <div className='form-switch form-check-success align-items-center'><Label
                                className="me-1">Exam</Label>
                                <Switch checked={isExam} onChangeAction={() => setIsExam(!isExam)}/>
                            </div>
                        </div>
                    </Col>
                }
                {
                    props.data.text2 &&
                    <Col xs={12} className='mb-1'>
                        <Label>{props.data.text2}{props.data.type !== 'SCHOOL' && <Required/>}</Label>
                        {
                            props.data.type !== 'HOLIDAY' ? <>
                                    <Input maxLength="250" invalid={error.text2 && text2.length === 0} value={text2}
                                           onChange={(e) => setText2(e.target.value)}
                                           type={props.data.type === 'VENUE' || props.data.type === 'BANK' ? 'number' : props.data.type === 'SCHOOL' || props.data.type === 'BRANCH' ? 'textarea' : 'text'}
                                           style={props.data.type === 'SCHOOL' ? {height: '160px'} : null}
                                           placeholder={props.data.type === 'INTAKE' ? 'Intake Code' :
                                               props.data.type === 'PROVIDE' ? 'Provide Code' :
                                                   props.data.type === 'BANK' ? 'Account Number' :
                                                       props.data.type === 'VENUE' ? 'Capacity' :
                                                           props.data.type === 'SCHOOL' ? 'Description' :
                                                               props.data.type === 'BRANCH' ? 'Address' : ''}
                                    />
                                    {props.data.type === 'SCHOOL' &&
                                        <span className="wordCount"><span>{text2.length}</span>/250</span>}
                                </> :
                                <Select
                                    theme={selectThemeColors}
                                    className={classnames('react-select', {'is-invalid': error.text2 && text2.length === 0})}
                                    classNamePrefix='select'
                                    // defaultValue={programOptions[0]}
                                    value={text2}
                                    options={HOLIDAY_TYPES}
                                    isClearable={false}
                                    onChange={(e) => setText2(e)}
                                    placeholder={'Select holiday type'}
                                />
                        }
                    </Col>
                }
                {
                    props.data.text3 &&
                    <Col xs={12} className='mb-2'>
                        <Label>{props.data.text3}<Required/></Label>
                        {
                            props.data.type === 'BANK' ?
                                <Input invalid={error.text3 && text3.length === 0} value={text3}
                                       onChange={(e) => setText3(e.target.value)}
                                       type={'text'}
                                       placeholder={'Branch Name'}
                                /> : props.data.type !== 'HOLIDAY' ? <Select
                                        theme={selectThemeColors}
                                        className={classnames('react-select', {'is-invalid': error.text3 && text3.length === 0})}
                                        classNamePrefix='select'
                                        // defaultValue={programOptions[0]}
                                        value={text3}
                                        options={branchOption}
                                        isClearable={false}
                                        onChange={(e) => setText3(e)}
                                        placeholder={'Select branch'}
                                    /> :
                                    <DatePicker
                                        picker="year"
                                        options={{minYear: 'today'}}
                                        style={error.text3 && text3 === '' ? {border: '1px solid #ea5455'} : {}}
                                        onChange={handleYearPicker}
                                        value={text3 === "" ? text3 : moment(text3)}
                                    />
                        }
                    </Col>
                }
                {
                    props.data.text4 &&
                    <Col xs={12} className='mb-2'>
                        <Label>{props.data.text4}<Required/></Label>
                        {
                            props.data.type === 'BANK' ?
                                <Input invalid={error.text4 && text4.length === 0} value={text4}
                                       onChange={(e) => setText4(e.target.value)}
                                       type={'text'}
                                       placeholder={'SWIFT Code'}
                                /> : <Flatpickr
                                    className={`form-control ${error.text4 && text4.length === 0 ? 'validation-error-date-picker' : ''}`}
                                    value={text4}
                                    placeholder="Date"
                                    options={{minDate, mode: 'range', defaultDate: text4}}
                                    onChange={value => {
                                        value.length === 2 ? setText4(value) : setText4('')
                                    }}
                                    style={{cursor: 'pointer'}}
                                />
                        }
                    </Col>
                }
                {
                    props.data.text5 &&
                    <Col xs={12} className='mb-2'>
                        <Label>{props.data.text5}<Required/></Label>
                        {
                            props.data.type === 'BANK' &&
                            <Input invalid={error.text5 && text5.length === 0} value={text5}
                                   onChange={(e) => setText5(e.target.value)}
                                   type={'text'}
                                   placeholder={'SWIFT Code'}
                            />
                        }
                    </Col>
                }
                {
                    props.data.text6 &&
                    <Col xs={12} className='mb-2'>
                        <Label>{props.data.text6}<Required/></Label>
                        {
                            props.data.type === 'BANK' &&
                            <Select
                                theme={selectThemeColors}
                                className={classnames('react-select', {'is-invalid': error.text6 && text6 === undefined})}
                                classNamePrefix='select'
                                value={text6}
                                options={ACCOUNT_TYPES}
                                isClearable={false}
                                onChange={(e) => setText6(e)}
                                placeholder={'Select holiday type'}
                            />
                        }
                    </Col>
                }
            </Row>
            <div align="right">
                <Button className='me-1' outline color='primary' onClick={() => closeSidebar()}>Cancel</Button>
                <Button color='primary'
                        onClick={() => manageConfiguration()}>{props.data.editData !== undefined ? 'Save Changes' : 'Add'}</Button>
            </div>
        </Sidebar>
    )
}

export default ConfigSidebar