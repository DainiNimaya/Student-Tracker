import React, {useEffect, useState, useRef, useLayoutEffect} from 'react'
import {Button, CardTitle, Col, Form, Input, Label, Row} from "reactstrap"
import classnames from "classnames"
import {CountryDropdown} from 'react-country-region-selector'
import {User, Star} from "react-feather"
import Select from "react-select"
import Required from "@components/required"
import {selectThemeColors, isNULL, findObject, showError} from '@utils'
import {LOCALITY, MARITAL_STATUS} from "@const"
import * as apiHaa from "@api/haa"
import Flatpickr from "react-flatpickr"
import {inquiryProspectFIErrors} from "@formError/counsellor"
import {inquiryProspectFIValidation} from "@validations/counsellor"
import moment from 'moment'
import Cookies from "js-cookie"
import config from '@storage'
import './scss/_furtherInformation.scss'
import {furtherInfo} from '@configs/studentMasterProfileConfig'
import Switch from "@components/switch"


const FurtherInformation = (props) => {

    const [dateOfBirth, setDateOfBirth] = useState(undefined)
    const [maritalStatus, setMaritalStatus] = useState(MARITAL_STATUS[0])
    const [locality, setLocality] = useState(LOCALITY[0])
    const [country, setCountry] = useState(undefined)
    const [origin, setOrigin] = useState('')
    const [placeOfBirth, setPlaceOfBirth] = useState('')
    const [race, setRace] = useState('')
    const [religion, setReligion] = useState('')
    const [nationality, setNationality] = useState('')
    const [hobbies, setHobbies] = useState('')
    const [specialAbilities, setSpecialAbilities] = useState('')

    const [disabilities, setDisabilities] = useState(false)
    const [specialNeeds, setSpecialNeeds] = useState(false)
    const [otherConsider, setOtherConsider] = useState(false)
    const [disabilitiesReason, setDisabilitiesReason] = useState('')
    const [specialNeedsReason, setSpecialNeedsReason] = useState('')
    const [considerReason, setConsiderReason] = useState('')

    const [editable, setEditable] = useState(false)
    const [error, setError] = useState(inquiryProspectFIErrors)
    const [role, setRole] = useState(JSON.parse(Cookies.get(config.user)).role)


    useEffect(() => {
        setEditable(props.edit)
    },[props.edit])

    useEffect(() => {
        loadFurtherInfo()

    },[])


    const loadFurtherInfo = async () => {
        const studentId = props.isMasterProfile && JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const rslt =  await apiHaa.getStudentFurtherInfo(studentId)
        if (rslt.length !== 0) {

            const temp = []
            if (rslt.interest !== null && rslt.interest.socialMedia !== null && rslt.interest.socialMedia.length !== 0 && rslt.interest.socialMedia[0] !== "") {
                rslt.interest.socialMedia.map(item => {
                    // temp.push(findObject(SOCIAL_MEDIA, item))
                })
            }

            setDateOfBirth(isNULL(rslt.dateOfBirth))
            setMaritalStatus(isNULL(rslt.maritalStatus))
            setLocality(isNULL(rslt.locality))
            setCountry(isNULL(rslt.country))
            setOrigin(isNULL(rslt.origin))
            setPlaceOfBirth(isNULL(rslt.placeOfBirth))
            setRace(isNULL(rslt.race))
            setReligion(isNULL(rslt.religion))
            setNationality(isNULL(rslt.nationality))
            setHobbies(isNULL(rslt.hobbies))
            setSpecialAbilities(isNULL(rslt.specialAbilities))
            setSocialMedia(temp)
            if (rslt.studentSupport !== null) {
                setDisabilities(rslt.studentSupport.disabilities)
                setSpecialNeeds(rslt.studentSupport.specialNeeds)
                setOtherConsider(rslt.studentSupport.otherConsider)
                setDisabilitiesReason(isNULL(rslt.studentSupport.disabilitiesReason))
                setSpecialNeedsReason(isNULL(rslt.studentSupport.specialNeedsReason))
                setConsiderReason(isNULL(rslt.studentSupport.considerReason))
            }
        }
    }

    const onSaveChange = async () => {
        const res = inquiryProspectFIValidation('', disabilities, specialNeeds, otherConsider,
            disabilitiesReason, specialNeedsReason, considerReason, '')
        setError(res)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        const tempSM = []
        socialMedia.map(item => {
            tempSM.push(item.value)
        })

        const data = {
            maritalStatus: maritalStatus ? maritalStatus : null,
            dateOfBirth,
            locality: locality ? locality : null,
            country,
            origin,
            placeOfBirth,
            nationality,
            race,
            religion,
            hobbies,
            specialAbilities,
            studentSupport:{
                disabilities,
                specialNeeds,
                otherConsider,
                disabilitiesReason,
                specialNeedsReason,
                considerReason
            }
        }

        const studentId = props.isMasterProfile && JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        const rslt = await apiHaa.updateStudentFurtherInfo(studentId,data)
        if (rslt === 0) setError(inquiryProspectFIErrors)

    }

    const checkAccessLevel = (data) => {
        return data.users.includes(role)
    }


    return (
        <Form className={'further-info'}>
            <Row >
                <CardTitle tag='h4'><User size={20}/> &nbsp;Personal Information</CardTitle>

                <Row className="align-items-center rowContainerStepper" >
                    <Col sm='6' >
                    <Row className="mb-2 align-items-center">
                        <Label sm='4' >Full Name</Label>
                        <Col sm='8'>
                            <Input
                                type='input'
                                value={'Dilshani Perera'}
                                onChange={(e) => setNationality(e.target.value)}
                                placeholder='Nationality'/>
                        </Col>
                    </Row>
                </Col>
                    <Col sm='6' >
                        <Row className="mb-2 align-items-center">
                            <Label sm='4' >Email</Label>
                            <Col sm='8'>
                                <Input
                                    type='input'
                                    value={'dilshani@gmail.com'}
                                    onChange={(e) => setNationality(e.target.value)}
                                    placeholder='Nationality'/>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='6' >
                        <Row className='mb-2 align-items-center'>
                            <Label sm='4' >Telephone</Label>
                            <Col sm='8'>
                                <Input
                                    type='input'
                                    value={'0765545665'}
                                    onChange={(e) => setNationality(e.target.value)}
                                    placeholder='Nationality'/>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='6' >
                        <Row className="mb-2 align-items-center">
                            <Label sm='4' >Date of Birth</Label>
                            <Col sm='8'>
                                <Flatpickr
                                    disabled={!(editable && checkAccessLevel(furtherInfo.dateOfBirth))}
                                    className='form-control'
                                    value={dateOfBirth}
                                    placeholder="Date of Birth"
                                    options={{maxDate: 'today'}}
                                    onChange={value => setDateOfBirth(moment(value[0]).format('YYYY-MM-DD'))}
                                    id='dateOfBirth'/>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='6'>
                        <Row className='mb-2 align-items-center'>
                            <Label sm='4' >Nationality</Label>
                            <Col sm='8'>
                                <Input
                                    type='input'
                                    value={nationality}
                                    onChange={(e) => setNationality(e.target.value)}
                                    placeholder='Nationality'/>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='6'>
                        <Row className='mb-2 align-items-center'>
                            <Label sm='4' >Payment Done By</Label>
                            <Col sm='8'>
                                <Select
                                    theme={selectThemeColors}
                                    className={classnames('react-select', {'is-invalid': false})}
                                    classNamePrefix='select'
                                    // value={gender_ === '' ? '' : gender_ === GENDER[0] ? Gender[0] : Gender[1]}
                                    // options={Gender}
                                    isClearable={false}
                                    // onChange={(e) => setGender(e.value)}
                                    placeholder={'Select'}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='6'>
                        <Row className='mb-2 align-items-center'>
                            <Label sm='4' >Country of Origin</Label>
                            <Col sm='8'>
                                <CountryDropdown
                                    className="country-name-picker"
                                    value={country}
                                    defaultOptionLabel='Select country'
                                    onChange={value => setCountry(value)}
                                    disabled={!(editable && checkAccessLevel(furtherInfo.countryOfOrigin))}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='12'>
                        <Row className='mb-2 align-items-center'>
                            <Label sm='2' >Address</Label>
                            <Col sm='10'>
                                <Input
                                    type='textarea'
                                    name='address'
                                    placeholder='Residential Address'
                                    // value={address}
                                    // readOnly={!editable}
                                    // onChange={(e) => setAddress(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col sm='12'>
                        <Row className='mb-2 align-items-center'>
                            <Label sm='2' >Statement</Label>
                            <Col sm='10'>
                                <Input
                                    type='textarea'
                                    name='address'
                                    placeholder='Residential Address'
                                    // value={address}
                                    // readOnly={!editable}
                                    // onChange={(e) => setAddress(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <CardTitle tag='h4' className="mt-3"><Star size={20}/> &nbsp;Student Support</CardTitle>
                <Col sm='12'>

                    <div className='form-check form-switch mb-05'>
                        <Label for='disabilities' className='form-check-label me-1'>
                            Do you have any disabilities?
                        </Label>
                        <Switch checked={disabilities}
                                // disabled={!(editable && checkAccessLevel(furtherInfo.disabilities))}
                                onChangeAction={() => setDisabilities(!disabilities)}/>
                    </div>
                    { disabilities ?
                        <>
                            <Row className='mb-2'>
                                <Label sm='2'>
                                    Reason
                                </Label>
                                <Col sm='10'>
                                    <Input
                                        readOnly={!(editable && checkAccessLevel(furtherInfo.disabilities))}
                                        type='input'
                                        name='disabilitiesReason'
                                        id='disabilities'
                                        invalid={error.disabilities}
                                        value={disabilitiesReason}
                                        onChange={(e) => setDisabilitiesReason(e.target.value)}
                                        maxLength="250"
                                        placeholder='Enter more details about the reason'/>
                                </Col>
                            </Row>
                            <div className='form-check form-switch mb-05'>
                                <Label for='specialNeeds' className='form-check-label me-1'>
                                    Do you have any special need?
                                </Label>
                                <Switch onChangeAction={() => setSpecialNeeds(!specialNeeds)}
                                        checked={specialNeeds}
                                        // disabled={!(editable && checkAccessLevel(furtherInfo.specialNeed))}
                                />
                            </div>
                        </>
                         : null
                    }
                    { specialNeeds ?
                        <>
                            <Row className='mb-2'>
                            <Label sm='2'>Reason</Label>
                            <Col sm='10'>
                                <Input
                                    readOnly={!(editable && checkAccessLevel(furtherInfo.specialNeed))}
                                    type='input'
                                    invalid={error.specialNeeds}
                                    value={specialNeedsReason}
                                    onChange={(e) => setSpecialNeedsReason(e.target.value)}
                                    maxLength="250"
                                    placeholder='Enter more details about the reason'/>
                            </Col>
                        </Row>
                        </> : null
                    }
                </Col>
                {
                   editable ?
                       <Col sm='12'>
                           <div className='d-flex mt-3 justify-content-end pb-3'>
                               <Button className='me-1' outline color='primary' type='button'
                                       onClick={() => props.history.goBack()}>Cancel
                               </Button>
                               <Button color='primary' type='button' onClick={() => onSaveChange()}>
                                   Save Changes
                               </Button>
                           </div>
                       </Col> : null
                }
            </Row>
        </Form>
    )
}

export default FurtherInformation
