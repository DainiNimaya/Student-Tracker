import InputPasswordToggle from '@components/input-password-toggle'
import {Row, Col, CardText, Form, Label, Input, Button} from 'reactstrap'
import '@styles/base/pages/page-auth.scss'
import './style.scss'
import themeConfig from '@configs/themeConfig'
import React, {useState} from "react"
import {login} from '@strings'
import {loginValidation, forgotValidation, otpValidation, resetPasswordValidation} from "@validations/common"
import {showError, findObject, isNULL} from '@utils'
import {loginError, forgotError, resetPassword} from "@formError/common"
import {LOGIN_STEPS, OTP_LENGTH, OTP_TIME, ROLES} from '@const'
import {ChevronLeft} from "react-feather"
import OTPInput from "otp-input-react"
import * as Api from '@api/common'
import * as userLoginApi from '@api/login'
import rs from '@routes'
import WelcomeSection from "@components/login/welcomeSection"

const DefaultLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(loginError)

    const onLogin = async () => {
        const res = loginValidation(email, password)
        setError(res)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        await loginHandler()
    }

    const loginHandler = async () => {
        const result = await userLoginApi.userLogin(email, password)
        if (result) window.open(rs.dashboard, '_self')
    }

    return (
        <div className='auth-wrapper auth-v2'>
            <div className={'login-div'}>
                <div className={'login-div_'}>
                    <div className={'heading'} align={'center'}>
                        <img style={{width: "200px"}} src={themeConfig.app.appLogoImage} alt=""/><br/>
                        <Label>Student Tracker</Label>
                    </div>
                    <CardText className='mb-2 mt-3'>
                        <div><h4>Welcome!</h4></div>
                        <span>Please sign-in to your account and start the adventure</span>
                    </CardText>
                    <Form className='auth-login-form mt-2' onSubmit={e => e.preventDefault()}>
                        <div className={'mb-1'}>
                            <div className='d-flex justify-content-between'>
                                <Label className='form-label' for='login-password'>
                                    Email
                                </Label>
                            </div>
                            <Input type='email' id='login-email' placeholder='yourname@email.com' autoFocus
                                   invalid={error.email} onChange={(e) => setEmail(e.target.value)}
                                   value={email} name={'email'}/>
                        </div>
                        <div className={'mb-2'}>
                            <div className='d-flex justify-content-between'>
                                <Label className='form-label' for='login-password'>
                                    Password
                                </Label>
                                <span className={'lbl-forgot'}>
                                            <small
                                                onClick={() => {
                                                    setError(loginError)
                                                    setSteps(LOGIN_STEPS.forgotPassword)
                                                }}>Forgot Password?</small>
                                        </span>
                            </div>
                            <InputPasswordToggle className='input-group-merge' id='confirm-password'
                                                 placeholder={'*****'} value={password}
                                                 onChange={e => setPassword(e.target.value)}
                                                 invalid={error.password} name={'password'}
                                                 onKeyPress={(e) => (e.key === 'Enter') && onLogin()}/>
                        </div>
                        <Button.Ripple color='primary' block onClick={onLogin}>
                            Login
                        </Button.Ripple>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default DefaultLogin
