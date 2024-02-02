import React, {useEffect, useState} from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row} from 'reactstrap'
import {MessageCircle, User, X, HelpCircle} from "react-feather"

import './scss/_userCreate.scss'
import Select from 'react-select'
import {selectThemeColors, showError, findObject} from '@utils'
import {ROLES, LECTURER_TYPES, DEFAULT_AVATAR, LOGIN_TYPES} from '@const'
import config from '@storage'
import classnames from 'classnames'
import {employeeUserCreationErrors} from '@formError/itAdmin'
import {
    employeeUserCreationValidation,
    Name_REGEX,
    EMAIL_REGEX,
    Number_REGEX,
    NEW_NIC_REGEX,
    OLD_NIC_REGEX,
    NO_SPACE_REGEX
} from '@validations/itAdmin'
import PhoneInput, {isPossiblePhoneNumber} from "react-phone-number-input"
import rs from '@routes'
import ConfirmBox from "@components/confirm-box"
import {loginView} from "@configs/authConfig"
import {basicInfo} from '@configs/basicInfomationConfig'

// service
import * as userCreationApi from '@api/itAdmin'
import * as userHandleApi from '@api/common'
import {toast} from "react-toastify"
import themeConfig from '@configs/themeConfig'

const UserCreate = (props) => {

    const [schoolOption, setSchoolOption] = useState([])
    const [programOption, setProgramOption] = useState([])
    const [branchOption, setBranchOption] = useState([])
    const [roleOption, setRoleOption] = useState([])
    const [departmentOption, setDepartmentOption] = useState([])

    const [role, setRole] = useState([])
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
    const [gender, setGender] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [nic, setNic] = useState('')
    const [employeNo, setEmloyeNo] = useState('')
    const [mobile, setMobile] = useState('')
    const [landline, setLandline] = useState('')
    const [program, setProgram] = useState([])
    const [branch, setBranch] = useState([])
    const [school, setSchool] = useState([])
    const [department, setDepartment] = useState([])
    const [designation, setDesignation] = useState('')
    const [lecturerType, setLecturerType] = useState([])
    const [lecturerCost, setLecturerCost] = useState('')
    const [error, setError] = useState(employeeUserCreationErrors)
    const [modalStatus, setModalStatus] = useState(false)
    const [restrictCondi, setRestrictCondi] = useState(false)
    const [restrictModal, setRestrictModal] = useState(false)
    const [currentType, setCurrentType] = useState('')
    const [currentData, setCurrentData] = useState([])

    useEffect(async () => {
        await loadSelectionValues()
        if (props.location.state) {
            const editData = props.location.state

            LECTURER_TYPES.map(data => {
                if (data.value === editData.lecturerType.value) setLecturerType(data)
            })

            setRole(editData.roleList)
            setName(editData.name !== null ? editData.name : '')
            setEmail(editData.email !== null ? editData.email : '')
            setNic(editData.nic !== null ? editData.nic : '')
            setEmloyeNo(editData.employeeNo !== null ? editData.employeeNo : '')
            setMobile(editData.mobile !== null ? editData.mobile : '')
            setLandline(editData.landline !== null ? editData.landline : '')
            setSchool(editData.school)
            setGender(editData.gender !== null ? editData.gender : '')
            setAvatar(editData.img !== null ? editData.img : DEFAULT_AVATAR)
            setBranch(editData.branch)
            setProgram(editData.program)
            setLecturerCost(editData.lecturerCost !== null ? editData.lecturerCost : '')
            setDepartment(editData.department !== null ? {
                value: editData.department.departmentId,
                label: editData.department.departmentName
            } : [])
            setDesignation(editData.designation !== null ? editData.designation : '')
            loadUnassignedPrograms(editData.school, editData.branch)
            if (basicInfo.roleRestrictionInUserCreation) handleRoleOptions(editData.roleList)
        }

    }, [])

    const loadSelectionValues = async () => {
        const departmentList = await userCreationApi.getAllDepartments()
        const branchList = await userCreationApi.getAllBranches()
        const schoolList = await userCreationApi.getAllSchools()
        const programList = await userCreationApi.getAllPrograms()
        const tempRoles = []
        const rolesArray = Object.values(ROLES)
        rolesArray.map(item => {
            if (item.value !== config.studentRole &&
              item.value !== config.itExecutiveRole && item.value !== config.receptionistRole &&
            item.value !== config.financeAssistantManagerRole && item.value !== config.studentLifeManagerRole &&
            item.value !== config.studentSupportServiceManagerRole) {
                tempRoles.push(item)
            }
        })

        setDepartmentOption(departmentList)
        setBranchOption(branchList)
        setSchoolOption(schoolList)
        props.location.state === null && setProgramOption(programList)
        setRoleOption(tempRoles)
    }


    const onDropDownHandler = (e) => {
        if (props.location.state !== null && e.value !== props.location.state.userRole) {
            toast.warning("Changing role may effect the past records of the profile. Please consider",
                {icon: true, hideProgressBar: true})
            if (basicInfo.roleRestrictionInUserCreation) handleRoleOptions(e)
            setRole(e)
            setSchool([])
            setBranch([])
            setProgram([])
        } else {
            if (basicInfo.roleRestrictionInUserCreation) handleRoleOptions(e)
            setRole(e)
        }
    }

    const handleRoleOptions = (data) => {
        const rolesArray = Object.values(ROLES)
        if (data.length !== 0) {
            const temp = []
            const tempSelectedDprts = []
            data.map(item => {
                tempSelectedDprts.push(item.department)
            })

            rolesArray.map(allRole => {
                if (!tempSelectedDprts.includes(allRole.department)) {
                    temp.push(allRole)
                }
            })
            setRoleOption(temp)
        } else {
            setRoleOption(rolesArray)
        }
    }


    const onImageChange = e => {
        const reader = new FileReader(),
            files = e.target.files
        reader.onload = function () {
            setAvatar(reader.result)
        }
        if (files.length !== 0) reader.readAsDataURL(files[0])
        e.target.value = null
    }

    const onUserAction = async () => {

        const res = employeeUserCreationValidation(role, name, mobile, email, nic, employeNo, landline, lecturerType, lecturerCost, department, designation)
        setError(res)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        if (basicInfo.roleRestrictionInUserCreation) {
            let isValidDepartment = false
            role.map(item => {
                if (item.department === department.value) isValidDepartment = true
            })
            if (!isValidDepartment) {
                toast.error("Roles are not match with the department.", {icon: true, hideProgressBar: true})
                return
            }
        }

        const data = {
            role,
            avatar,
            gender,
            name,
            mobile,
            email,
            nic,
            employeNo,
            program,
            branch,
            school,
            landline,
            lecturerType,
            lecturerCost,
            department,
            designation
        }


        if (props.location.state === null) {
            const result = await userCreationApi.createUser(data)
            if (result === 0) {
                onCancel()
                props.history.push(rs.employeeInformation)
            }
        } else {
            const result = await userHandleApi.editUser(data, props.location.state.id)
            if (result !== null) {
                onCancel()
                props.history.push(rs.employeeInformation)
            }
        }
    }

    const onCancel = () => {
        setRole([])
        setAvatar(DEFAULT_AVATAR)
        setGender('')
        setName('')
        setNic('')
        setEmail('')
        setEmloyeNo('')
        setMobile('')
        setProgram([])
        setBranch([])
        setSchool([])
        setError(employeeUserCreationErrors)
        setLandline('')
        setDepartment([])
        setDesignation('')
    }

    const removeImg = () => {
        setAvatar(DEFAULT_AVATAR)
    }

    const handleProgram = async (type, e) => {
        let tempSchool = school
        let tempBranch = branch

        switch (type) {
            case 'school':
                setSchool(e)
                tempSchool = e
                break
            case 'branch':
                setBranch(e)
                tempBranch = e
                break
        }
        await loadUnassignedPrograms(tempSchool, tempBranch)
        setProgram([])
        setRestrictModal(false)
    }

    const validateEditRestriction = async (type, e) => {
        if (props.location.state !== null && !restrictCondi) {
            setRestrictCondi(true)
            setRestrictModal(true)
            setCurrentType(type)
            setCurrentData(e)
        } else {
            await handleProgram(type, e)
        }
    }

    const restrictModalNoAction = () => {
        setRestrictCondi(false)
        setRestrictModal(false)
        setCurrentType('')
        setCurrentData([])
    }

    const loadUnassignedPrograms = async (tempSchool, tempBranch) => {
        const result = await userCreationApi.getCoursesWithoutRestriction(tempSchool, tempBranch)
        setProgramOption(result)
    }

    const resendEmail = async () => {
        const result = await userCreationApi.resendUserPassword(props.location.state.id, email)
        setModalStatus(false)
    }

    return (
        <Card className={'create-user'}>
            {
                props.location.state !== null &&
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4' className={'heading'}>Edit User Details</CardTitle>
                    <X onClick={() => props.history.goBack()} id={'close-icon'}/>
                </CardHeader>
            }
            <CardBody>
                {props.location.state === null &&
                    <div className={'heading'} align="left">
                        <MessageCircle id={'icon'}/>Create a User
                    </div>
                }
                <Row>
                    <Col lg={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Role<span>*</span></Label></Col>
                            <Col xs={9}>
                                <Select
                                    theme={selectThemeColors}
                                    className={classnames('react-select', {'is-invalid': error.role})}
                                    classNamePrefix='select'
                                    value={role}
                                    options={roleOption}
                                    isMulti
                                    isClearable={false}
                                    onChange={(e) => onDropDownHandler(e)}
                                    placeholder={'Select a role'}
                                /></Col>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <br/>
                <div className={'heading'}>
                    <User id={'icon'}/> Personal Information
                </div>
                <br/>
                <Row>
                    <Col xs={6}>
                        <div className='d-flex'>
                            <div className='me-15'>
                                <img className='rounded me-50 objectFit' alt='' height='100' width='100' src={avatar}/>
                            </div>
                            <div className='d-flex align-items-end mt-75 ms-1'>
                                <div>
                                    <div className={'heading'}>
                                        {name}
                                    </div>
                                    <Button tag={Label} className='mb-75 me-75' color='primary'>
                                        {props.location.state === null ? 'Upload' : 'Change'}
                                        <Input type='file' hidden accept='image/*' onChange={onImageChange}/>
                                    </Button>
                                    <Button className='mb-75' color='primary' outline onClick={() => removeImg()}>
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={6} className={'gender-div'}>
                        <Row>
                            <Col xs={3}>
                                <div className='demo-inline-spacing'>
                                    <Label>Gender</Label>
                                </div>
                            </Col>
                            <Col xs={9}>
                                <div className='demo-inline-spacing'>
                                    <div className='form-check'>
                                        <Input type='radio' id='ex1-active' name='ex1' checked={gender === 'MALE'}
                                               onChange={() => setGender('MALE')}/>
                                        <Label className='form-check-label' for='ex1-active'>Male</Label>
                                    </div>
                                    <div className='form-check'>
                                        <Input type='radio' name='ex1' id='ex1-inactive' checked={gender === 'FEMALE'}
                                               onChange={() => setGender('FEMALE')}/>
                                        <Label className='form-check-label' for='ex1-inactive'>Female</Label>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br/>
                <br/>
                <Row>
                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}><Label>Full Name<span>*</span></Label></Col>
                            <Col xs={9}><Input placeholder='Kasun Fernando' name='name' value={name}
                                               invalid={error.name && !Name_REGEX.test(name.trim())}
                                               autoComplete={'off'}
                                               onChange={(e) => setName(e.target.value)}/>
                            </Col>
                        </Row>
                    </Col>

                    {loginView.type === LOGIN_TYPES.microsoft ? <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>APIIT Email<span>*</span></Label></Col>
                            <Col xs={9}> <Input type='email' placeholder='kasunfernando@email.com' name='email'
                                                readOnly={props.location.state !== null} autoComplete={'off'}
                                                value={email} onChange={(e) => setEmail(e.target.value)}
                                                invalid={error.email && !EMAIL_REGEX.test(email)}/>
                            </Col>
                        </Row>
                    </Col> : <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Email<span>*</span></Label></Col>
                            <Col xs={9} className={'email-resend-div'}>
                                <Input type='email' placeholder='kasunfernando@email.com' name='email'
                                       readOnly={props.location.state !== null && props.location.state.passwordExist}
                                       autoComplete={'off'} value={email} onChange={(e) => setEmail(e.target.value)}
                                       invalid={error.email && !EMAIL_REGEX.test(email)}/>
                                {
                                    props.location.state !== null && !props.location.state.passwordExist &&
                                    <Button color='primary' disabled={!EMAIL_REGEX.test(email)}
                                            onClick={() => setModalStatus(true)}>Resend</Button>
                                }
                            </Col>
                        </Row>
                    </Col>}

                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>NIC/Passport</Label></Col>
                            <Col xs={9}> <Input placeholder='199987654321' name='nic' value={nic}
                                                invalid={error.nic && (nic.trim().length < 4 || !NO_SPACE_REGEX.test(nic))}
                                                onChange={(e) => setNic(e.target.value.trim())} autoComplete={'off'}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Employee No<span>*</span></Label></Col>
                            <Col xs={9}> <Input placeholder='123456789' name='employeNo' value={employeNo}
                                                onChange={(e) => {
                                                    e.target.value === '' || Number_REGEX.test(e.target.value) ? setEmloyeNo(e.target.value) : null
                                                }} type='number'
                                                invalid={error.employeNo && !Number_REGEX.test(employeNo)}
                                                autoComplete={'off'}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Mobile Number</Label></Col>
                            <Col xs={9}>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={true}
                                    defaultCountry="LK"
                                    placeholder="073123456"
                                    name="mobile"
                                    value={mobile}
                                    className={error.mobile && mobile !== undefined && !isPossiblePhoneNumber(mobile) ? 'validation-error' : ''}
                                    onChange={value => setMobile(value)}
                                    autoComplete={'off'}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Landline Number</Label></Col>
                            <Col xs={9}>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={true}
                                    defaultCountry="LK"
                                    placeholder="0331234567"
                                    name="landline"
                                    value={landline}
                                    className={error.landline && landline !== undefined && !isPossiblePhoneNumber(landline) ? 'validation-error' : ''}
                                    onChange={value => setLandline(value)}
                                    autoComplete={'off'}
                                />
                            </Col>
                        </Row>
                    </Col>
                    {role.map(item => {
                        if (item.value === 'LECTURER') {
                            return <>
                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={3}> <Label>Lecturer Type</Label></Col>
                                        <Col xs={9}>
                                            <Select
                                                theme={selectThemeColors}
                                                className={classnames('react-select', {'is-invalid': error.lecturerType})}
                                                classNamePrefix='select'
                                                value={lecturerType}
                                                options={LECTURER_TYPES}
                                                isClearable={false}
                                                onChange={(e) => setLecturerType(e)}
                                                placeholder={'Select a type'}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                {
                                    lecturerType === LECTURER_TYPES[2] &&
                                    <Col xs={6}>
                                        <Row className={'field-row'}>
                                            <Col xs={3}> <Label>Lecturer Cost per Hour</Label></Col>
                                            <Col xs={9}>
                                                <Input placeholder='' name='lecturerCost' value={lecturerCost}
                                                       onChange={(e) => setLecturerCost(e.target.value)} type='number'
                                                       invalid={error.lecturerCost && !Number_REGEX.test(lecturerCost)}
                                                       autoComplete={'off'}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                }
                            </>
                        }
                    })}
                </Row>
                <br/>
                <div align="right">
                    <Button className='me-1' color='primary' outline
                            onClick={props.location.state === null ? onCancel : () => props.history.goBack()}>
                        {props.location.state === null ? "Clear" : "Cancel"}
                    </Button>
                    <Button type='submit' color='primary' onClick={() => onUserAction()}>
                        {props.location.state === null ? "Create" : "Save Changes"}</Button>
                </div>
                {
                    modalStatus &&
                    <ConfirmBox
                        isOpen={true}
                        toggleModal={() => setModalStatus(false)}
                        yesBtnClick={() => resendEmail()}
                        noBtnClick={() => setModalStatus(false)}
                        title={`Confirmation`}
                        message={`Are you sure you want to resend password change link via an email?`}
                        yesBtn="Yes"
                        noBtn='No'
                        icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
                    />
                }
                {
                    restrictModal &&
                    <ConfirmBox
                        isOpen={true}
                        toggleModal={() => restrictModalNoAction()}
                        yesBtnClick={() => handleProgram(currentType, currentData)}
                        noBtnClick={() => restrictModalNoAction()}
                        title={'Confirmation'}
                        message={'This will restricted the access to the selected areas and data will be not displayed to the user. Are you sure to continue?'}
                        yesBtn="Yes"
                        noBtn='No'
                        icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
                    />
                }
            </CardBody>
        </Card>
    )

}

export default UserCreate
