import React, {useEffect, useState} from 'react'
import {Button, Card, CardBody, Col, Input, Label, InputGroup, Row} from 'reactstrap'
import {User, AlertTriangle} from "react-feather"

import './scss/_manageProfile.scss'
import Select from 'react-select'
import {selectThemeColors, showError} from '@utils'
import {ROLES, LECTURER_TYPES, DEFAULT_AVATAR, LOGIN_TYPES} from '@const'
import avatarImg from '../../../assets/images/itAdmin/no-image.png'
import {manageProfileErrors} from '@formError/common'
import {
    manageProfileValidation,
    Name_REGEX,
    EMAIL_REGEX,
    Number_REGEX,
    NEW_NIC_REGEX,
    OLD_NIC_REGEX,
    NO_SPACE_REGEX,
    Password_REGEX
} from '@validations/common'
import PhoneInput, {isPossiblePhoneNumber} from "react-phone-number-input"
import {WarningToast} from "@toast"
import rs from '@routes'
import Required from "@components/required"

// ** Store & Actions
import {handleProfile} from '@store/profile'
import {useDispatch, useSelector} from 'react-redux'

// service
import * as userDetailApi from '@api/common'

import Cookies from "js-cookie"
import config from '@storage'
import classnames from "classnames"
import ConfirmBox from "@components/confirm-box"
import cookie from "react-cookies"
import InputPasswordToggle from "@components/input-password-toggle"
import UpdatePassword from "@components/update-password-modal"
import {toast} from "react-toastify"
import {userProfile} from '@strings'
import {loginView} from "../../../configs/authConfig"
import themeConfig from '@configs/themeConfig'

const Index = (props) => {

    const [role, setRole] = useState([])
    const [roleString, setRoleString] = useState('')
    const [avatar, setAvatar] = useState(DEFAULT_AVATAR)
    const [gender, setGender] = useState('MALE')
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
    const [error, setError] = useState(manageProfileErrors)
    const [userData] = useState(JSON.parse(Cookies.get(config.user)))
    const [user, setUser] = useState(null)
    const [lecturerType, setLecturerType] = useState([])
    const [lecturerCost, setLecturerCost] = useState('')
    const [isConfirm, setIsConfirm] = useState(false)
    const dispatch = useDispatch()
    const [password, setPassword] = useState('')
    const [isUpdatePassword, setIsUpdatePassword] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    useEffect(async () => {
        await loadUser()
    }, [])

    const loadUser = async () => {
        const user = await userDetailApi.getUser(userData.userId)
        if (user !== undefined) {
            setName(user.name !== '' ? user.name : 'N/A')
            setEmail(user.email !== '' ? user.email : 'N/A')
            setNic(user.nic !== '' ? user.nic : '')
            setEmloyeNo(user.employeeNo !== '' ? user.employeeNo : 'N/A')
            setMobile(user.mobile)
            setLandline(user.landline)
            setSchool(user.school)
            setGender(user.gender)
            setAvatar(user.img !== null ? user.img : DEFAULT_AVATAR)
            setBranch(user.branch)
            setProgram(user.program)
            setDepartment(user.department !== '' ? user.department : 'N/A')
            setRole(user.userRole)
            setUser(user)
            setLecturerType(user.lecturerType !== '' ? user.lecturerType : 'N/A')
            setLecturerCost(user.lecturerCost)
            setDesignation(user.designation !== '' ? user.designation : 'N/A')
            setRoleString(user.userRoleString)

            updateProfileRedux({role: userData.role, name: user.name, profileImage: user.img})

        }
    }

    const updateProfileRedux = (data) => {
        dispatch(handleProfile(data))
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
        const res = manageProfileValidation(gender, name, mobile, nic, landline, role, lecturerType, lecturerCost)
        setError(res)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        updateProfileRedux({role: userData.role, name: userData.firstName, profileImage: DEFAULT_AVATAR})


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
        const result = await userDetailApi.editUser(data, userData.userId)
        if (result !== null) {
            // await loadUser()
            userData.firstName = result.firstName
            userData.profileImage = result.profileImageUrl
            cookie.save(config.user, JSON.stringify(userData), {path: '/'})
            cookie.save(config.username, `${result.firstName} ${result.lastName}`, {path: '/'})
            updateProfileRedux({
                role: userData.role,
                name: `${result.firstName} ${result.lastName}`,
                profileImage: avatar === null ? DEFAULT_AVATAR : avatar
            })
        }
    }

    const onCancel = () => {
        setName(user.name)
        setEmail(user.email)
        setNic(user.nic)
        setEmloyeNo(user.employeeNo)
        setMobile(user.mobile)
        setLandline(user.landline)
        setSchool(user.school)
        setGender(user.gender)
        setAvatar(user.img)
        setBranch(user.branch)
        setProgram(user.program)
        setDepartment(user.department)
        setRole(user.userRole)
        setError(manageProfileErrors)
        setDesignation(user.designation)
        // setLecturerCost(user.lecturerCost)
        // setLecturerType(user.lecturerType)
    }

    const removeImg = () => {
        setAvatar(DEFAULT_AVATAR)
    }

    const validatePassword = () => {
        if (password.trim() === '') {
            setPasswordError(true)

        } else {
            if (!Password_REGEX.test(password)) {
                toast.warning(userProfile.passwordWarning, {
                    icon: true,
                    hideProgressBar: true
                })
            } else {
                setIsUpdatePassword(true)
            }
        }
    }


    return (<>
        <Card className={'manage-profile'}>
            <CardBody>
                <div className={'heading'}>
                    <User id={'icon'}/> Personal Information
                </div>
                <br/>
                <Row>
                    <Col xs={6}>
                        <div className='d-flex'>
                            <div className='me-15'>
                                <img className='rounded me-50' alt='' height='100' width='100' src={avatar}/>
                            </div>
                            <div className='d-flex align-items-end mt-75 ms-1'>
                                <div>
                                    <div className={'heading'}>
                                        {name}
                                    </div>
                                    <Button tag={Label} className='mb-75 me-75' color='primary'>
                                        Change
                                        <Input type='file' hidden accept='image/*' onChange={(e) => onImageChange(e)}/>
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
                            <Col xs={3}><Label>Full Name<Required/></Label></Col>
                            <Col xs={9}><Input placeholder='Kasun Fernando' name='name' value={name}
                                               invalid={error.name && !Name_REGEX.test(name)} autoComplete={'off'}
                                               onChange={(e) => setName(e.target.value)}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Email</Label></Col>
                            <Col xs={9}> <Input type='email' placeholder='kasunfernando@email.com'
                                                readOnly={true} value={'chami123@gmail.com'}/>
                            </Col>
                        </Row>
                    </Col>
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
                            <Col xs={3}> <Label>Employee No.</Label></Col>
                            <Col xs={9}> <Input value={employeNo} readOnly={true}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}><Label>Designation</Label></Col>
                            <Col xs={9}><Input value={'Academic Admin'} readOnly={true}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}><Label>User Role</Label></Col>
                            <Col xs={9}><Input value={'Academic Admin'} readOnly={true}/></Col>
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
                                    className={error.mobile && !isPossiblePhoneNumber(mobile) ? 'validation-error' : ''}
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
                                    placeholder="0331234562"
                                    name="landline"
                                    value={landline}
                                    className={error.landline && !isPossiblePhoneNumber(landline) ? 'validation-error' : ''}
                                    onChange={value => setLandline(value)}
                                    autoComplete={'off'}
                                />
                            </Col>
                        </Row>
                    </Col>
                    {loginView.type === LOGIN_TYPES.default && <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Password</Label></Col>
                            <Col xs={9}>
                                <div className="input-group" style={{flexWrap: 'inherit'}}>
                                    <InputPasswordToggle className='input-group-merge' id='login-password'
                                                         value={password}
                                                         onChange={(e) => {
                                                             setPassword(e.target.value)
                                                             setPasswordError(false)
                                                         }}
                                                         invalid={passwordError} placeholder={'New Password'}/>
                                    <button className="btn btn-primary" style={{height: 39}}
                                            onClick={validatePassword}>Update
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </Col>}

                    {role.value === 'LECTURER' && <Col xs={6}>
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
                    </Col>}
                    {role.value === 'LECTURER' && lecturerType === LECTURER_TYPES[2] && <Col xs={6}>
                        <Row className={'field-row'}>
                            <Col xs={3}> <Label>Lecturer Cost</Label></Col>
                            <Col xs={9}>
                                <Input placeholder='' name='lecturerCost' value={lecturerCost}
                                       onChange={(e) => setLecturerCost(e.target.value)} type='number'
                                       invalid={error.lecturerCost && !Number_REGEX.test(lecturerCost)}
                                       autoComplete={'off'}/>
                            </Col>
                        </Row>
                    </Col>}
                </Row>
                {
                    userData.role === ROLES.fe.value && <>
                        <br/>
                        <br/>
                        <div className={'heading'}>
                            <User id={'icon'}/> Allowed Areas
                        </div>
                        <Row>
                            <Col xs={6}>
                                <Row className={'field-row'}>
                                    <Col xs={3}> <Label>Branch</Label></Col>
                                    <Col xs={9}>
                                        <Select
                                            isClearable={false}
                                            theme={selectThemeColors}
                                            value={branch}
                                            isMulti
                                            name='colors'
                                            classNamePrefix='select'
                                            placeholder={'Not Given'}
                                            isDisabled={true}
                                        />
                                    </Col>
                                </Row>
                                <Row className={'field-row'}>
                                    <Col xs={3}> <Label>Program</Label></Col>
                                    <Col xs={9}>
                                        <Select
                                            isClearable={false}
                                            theme={selectThemeColors}
                                            value={program}
                                            name='colors'
                                            isMulti
                                            classNamePrefix='select'
                                            placeholder={'Not Given'}
                                            isDisabled={true}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={6}>
                                <Row className={'field-row'}>
                                    <Col xs={3}> <Label>School</Label></Col>
                                    <Col xs={9}>
                                        <Select
                                            isClearable={false}
                                            theme={selectThemeColors}
                                            value={school}
                                            isMulti
                                            name='colors'
                                            classNamePrefix='select'
                                            placeholder={'Not Given'}
                                            isDisabled={true}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                }
                <br/>
                <div align="right">
                    <Button className='me-1' color='primary' outline onClick={() => setIsConfirm(true)}>Close</Button>
                    <Button type='submit' color='primary' onClick={onUserAction}>Update</Button>
                </div>
            </CardBody>

            <ConfirmBox
                isOpen={isConfirm}
                toggleModal={() => setIsConfirm(false)}
                yesBtnClick={() => props.history.push(rs.dashboard)}
                noBtnClick={() => setIsConfirm(false)}
                title={'Confirmation'}
                message={'If you close, changes you made may not be saved.'}
                yesBtn="Close Anyway"
                noBtn="Stay in Page"
                icon={<AlertTriangle size={40} color={themeConfig.color.primary}/>}
            />
        </Card>
        {isUpdatePassword && <UpdatePassword
            isOpen={isUpdatePassword}
            title={'Update the Password'}
            modalHandler={() => {
                setIsUpdatePassword(false)
                setPassword('')
            }}
            currentValue={password}
        />}

    </>)

}

export default Index
