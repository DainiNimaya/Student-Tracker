import React, {createRef, useEffect, useLayoutEffect, useRef, useState} from 'react'
import {Button, CardHeader, CardTitle, Col, Form, Input, InputGroup, Label, Row} from "reactstrap"
import classnames from "classnames"
import {CountryDropdown} from 'react-country-region-selector'
import {Briefcase, Home, X} from "react-feather"
import Select from "react-select"
import Required from "@components/required"
import {
    findFileDataUrl,
    appendPlusToMobile,
    findObject,
    isNULL,
    selectThemeColors,
    viewResume,
    showError
} from '@utils'
import {EXPERIENCE, FILE_TYPES, CURRENCY} from "@const"
import PhoneInput from "react-phone-number-input"
import * as apiHaa from "@api/haa"
import Cookies from "js-cookie"
import config from '@storage'
import {studentMasterProfileEmployErrors} from "@formError/counsellor"
import {studentMasterProfileEmployValidation} from "@validations/counsellor"
import {employmentInfo} from '@configs/studentMasterProfileConfig'

const EmploymentInformation = (props) => {

    const [jobTitle, setJobTitle] = useState('')
    const [natureOfJob, setNatureOfJob] = useState('')
    const [department, setDepartment] = useState('')
    const [joinedDate, setJoinedDate] = useState(undefined)
    const [jobReference, setJobReference] = useState('')
    const [income, setIncome] = useState(null)
    const [experience, setExperience] = useState(null)
    const [companyName, setCompanyName] = useState('')
    const [mainBusiness, setMainBusiness] = useState('')
    const [orgType, setOrgType] = useState('')
    const [contactPerson, setContactPerson] = useState('')
    const [address, setAddress] = useState('')
    const [country, setCountry] = useState('')
    const [province, setProvince] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [telephone, setTelephone] = useState('')
    const [email, setEmail] = useState('')
    const [noEmployment, setNoEmployment] = useState(false)
    const [editable, setEditable] = useState(false)
    const [role, setRole] = useState(JSON.parse(Cookies.get(config.user)).role)
    const [error, setError] = useState(studentMasterProfileEmployErrors)

    const natureOfJobWidth = useRef()
    const [njWidth, setNjWidth] = useState(undefined)

    useEffect(() => {
        setEditable(props.edit)
    }, [props.edit])

    useEffect(() => {
        loadEmploymentInfo()
        natureOfJobWidth.current.offsetWidth &&
        setNjWidth(natureOfJobWidth.current.offsetWidth)

    }, [])


    useLayoutEffect(() => {
        function handleResize() {
            natureOfJobWidth.current.offsetWidth &&
            setNjWidth(natureOfJobWidth.current.offsetWidth)
        }

        window.addEventListener('resize', handleResize)
    }, [])

    const loadEmploymentInfo = async () => {
        const studentId = props.isMasterProfile && JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const rslt = await apiHaa.getStudentEmploymentInfo(studentId)
        if (rslt.length !== 0) {
            setNoEmployment(!rslt.employeeRecordAvailable)
            if (rslt.workingInformation !== null) {
                setJobTitle(isNULL(rslt.workingInformation.jobTitle))
                setNatureOfJob(isNULL(rslt.workingInformation.natureOfJob))
                setDepartment(isNULL(rslt.workingInformation.department))
                setJoinedDate(isNULL(rslt.workingInformation.joinedDate))
                setJobReference(isNULL(rslt.workingInformation.jobReference))
                setServiceLetterBlob(isNULL(rslt.workingInformation.serviceLetter))

                // setIncome(rslt.workingInformation.income !== null ? findObject(INCOME, rslt.workingInformation.income) : undefined)
                setExperience(rslt.workingInformation.experience !== null ? findObject(EXPERIENCE, rslt.workingInformation.experience) : undefined)

            }
            if (rslt.companyInfo !== null) {
                setCompanyName(isNULL(rslt.companyInfo.companyName))
                setMainBusiness(isNULL(rslt.companyInfo.mainBusiness))
                setOrgType(isNULL(rslt.companyInfo.orgType))
                setContactPerson(isNULL(rslt.companyInfo.contactPerson))
                setAddress(isNULL(rslt.companyInfo.address))
                setCountry(isNULL(rslt.companyInfo.country))
                setProvince(isNULL(rslt.companyInfo.province))
                setCity(isNULL(rslt.companyInfo.city))
                setPostalCode(isNULL(rslt.companyInfo.postalCode))
                setTelephone(appendPlusToMobile(isNULL(rslt.companyInfo.telephone)))
                setEmail(isNULL(rslt.companyInfo.email))
            }
        }
    }

    const onSaveChange = async () => {

        const res = studentMasterProfileEmployValidation(telephone, email)
        setError(res)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        const data = {
            noEmployment,
            workingInformation: {
                jobTitle,
                natureOfJob,
                department,
                joinedDate,
                jobReference,
                income: income ? income.value : null,
                experience: experience ? experience.value : null
            },
            companyInfo: {
                companyName,
                mainBusiness,
                orgType,
                contactPerson,
                address,
                country,
                province,
                city,
                postalCode,
                telephone,
                email
            }
        }

        const studentId = props.isMasterProfile && JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const rslt = await apiHaa.updateStudentEmploymentInfo(studentId, data)
        if (rslt === 0) setError(studentMasterProfileEmployErrors)
        if (res && serviceLetterFile) {
            await apiHaa.uploadFile(studentId, [{type: FILE_TYPES[3], file: serviceLetterFile}])
        }

    }

    const onChangeLetter = async (e) => {
        setServiceLetter(e.target.value)
        const result = await findFileDataUrl(e.target.files)
        setServiceLetterFile(result.files[0])
        setServiceLetterBlob(result.data[0])
    }

    const checkAccessLevel = (data) => {
        return data.users.includes(role)
    }

    const mobile = window.innerWidth <= 991
    return (
        <Form>
            <CardHeader className="p-0 mb-1">
                <h4><Home size={20}/> {mobile ? "Working Info" : "Working Information"}</h4>
                {
                    mobile ?
                        <X onClick={() => props.onClose()} id={'close-icon'}/> :
                        <div className='demo-inline-spacing' style={{display: 'inline-flex'}}>
                            <div className='form-check mt-0 me-0' style={{width: `${njWidth}px`}}>
                                <Input
                                    disabled={!(editable && checkAccessLevel(employmentInfo.isEmplRecord))}
                                    type='checkbox'
                                    id='noEmployment'
                                    checked={noEmployment}
                                    onChange={() => setNoEmployment(!noEmployment)}
                                    name='ex3'/>
                                <Label for='noEmployment' className='form-check-label'>No Employment Records</Label>
                            </div>
                        </div>
                }
            </CardHeader>

            <Row>
                {
                    mobile && <div className='demo-inline-spacing mb-2' style={{display: 'inline-flex'}}>
                        <div className='form-check mt-0 mr-0'>
                            <Input
                                disabled={!(editable && checkAccessLevel(employmentInfo.isEmplRecord))}
                                type='checkbox'
                                id='noEmployment'
                                checked={noEmployment}
                                onChange={() => setNoEmployment(!noEmployment)}
                                name='ex3'/>
                            <Label for='noEmployment' className='form-check-label'>No Employment Records</Label>
                        </div>
                    </div>
                }
                <Col sm='6'>
                    <Row className='mb-2'>
                        <Label sm='4'>Job Title</Label>
                        <Col sm='8'>
                            <Input
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder='Job Title'/>
                        </Col>
                    </Row>
                </Col>

                <Col sm='6'>
                    <Row className='mb-2'>
                        <Label sm='4'>Company Name</Label>
                        <Col sm='8'>
                            <div ref={natureOfJobWidth}>
                                <Input
                                    value={natureOfJob}
                                    onChange={(e) => setNatureOfJob(e.target.value)}
                                    placeholder='Nature of Job'/>
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col sm='6'>
                    <Row className='mb-2'>
                        <Label sm='4'>Date Join</Label>
                        <Col sm='8'>
                            <Input
                                value={joinedDate}
                                onChange={(e) => setJoinedDate(e.target.value)}
                                placeholder='Date Join'/>
                        </Col>
                    </Row>
                </Col>
                <Col sm='6'>
                    <Row className='mb-2'>
                        <Label sm='4'>Experience</Label>
                        <Col sm='8'>
                            <Select
                                isDisabled={!(editable && checkAccessLevel(employmentInfo.experience) && !noEmployment)}
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                theme={selectThemeColors}
                                className='react-select'
                                classNamePrefix='select'
                                options={EXPERIENCE}
                                isClearable={true}
                                value={experience}
                                onChange={value => setExperience(value)}
                                placeholder="Select Experience"/>
                        </Col>
                    </Row>
                </Col>
                <Col sm='12'>
                    <Row className='mb-2'>
                        <Label sm='2'>Address</Label>
                        <Col sm='10'>
                            <Input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder='Address'/>
                        </Col>
                    </Row>
                </Col>
                <Col sm='12'>
                    <Row className='mb-2'>
                        <Label sm='2'>Other</Label>
                        <Col sm='10'>
                            <Input
                                type='textarea'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder='Address'/>
                        </Col>
                    </Row>
                </Col>

                {
                    editable && role !== 'STUDENT' ?
                        <Col sm='12'>
                            <div className='d-flex mt-3 justify-content-end pb-3'>
                                <Button className='me-1' outline color='primary' type='button'
                                        onClick={() => props.history.goBack()}>Cancel
                                </Button>
                                <Button color='primary' type='button' onClick={() => onSaveChange()}>
                                    Save Changes
                                </Button>
                            </div>
                        </Col>
                        : null
                }
            </Row>
        </Form>
    )
}

export default EmploymentInformation
