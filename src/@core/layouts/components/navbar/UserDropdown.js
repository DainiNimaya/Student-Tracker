// ** React Imports
import {Link} from 'react-router-dom'
import React, {useEffect, useState} from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils
// import { isUserLoggedIn } from '@utils'
// ** Third Party Components
import {CheckSquare, CreditCard, HelpCircle, Mail, MessageSquare, Power, Settings, User} from 'react-feather'

// ** Reactstrap Imports
import {DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, UncontrolledButtonDropdown} from 'reactstrap'

// ** Store & Actions
import {handleProfile} from '@store/profile'
import {useDispatch, useSelector} from 'react-redux'

import {DEFAULT_AVATAR, ROLES, LOGIN_TYPES} from '@const'
import config from '@storage'
import Cookies from "js-cookie"
import {findObject, selectThemeColors} from '@utils'
import {useMsal} from "@azure/msal-react"
import rs from '@routes'
import ConfirmBox from "@components/confirm-box"
import cookie from "react-cookies"
import {loginView, msalConfig, msalConfigStudent} from "../../../../configs/authConfig"
import {isMobile} from "react-device-detect"
import themeConfig from '@configs/themeConfig'
import {PublicClientApplication} from "@azure/msal-browser"

const msalInstance = new PublicClientApplication(msalConfig)
const msalInstanceStudent = new PublicClientApplication(msalConfigStudent)

const UserDropdown = (props) => {
    // ** State
    const [userData] = useState(JSON.parse(Cookies.get(config.user)))
    // const {instance} = useMsal()
    const [name] = useState(Cookies.get(config.username))
    const [modal, setModal] = useState(false)
    const [reqRole, setReqRole] = useState('')
    const [modalMsg, setModalMsg] = useState('')
    const {instance} = useMsal()
    const dispatch = useDispatch()
    const store = useSelector(state => state.profile)

    //** Vars
    const profile = store.details === null ? userData : store.details
    const userAvatar = profile.profileImage || DEFAULT_AVATAR

    const mobile = 290 <= window.innerWidth && window.innerWidth <= 600

    const logoutAction = async () => {
        if (loginView.type === LOGIN_TYPES.microsoft) {
            const loginType = sessionStorage.getItem('LOGIN_TYPE')
            if (loginType && loginType === 'STAFF') {
                await msalInstance.logoutPopup().then(response => {
                    removeCookies()
                }).catch(e => {
                    console.error(e)
                })
            } else if (loginType && loginType === 'STUDENT') {
                await msalInstanceStudent.logoutPopup().then(response => {
                    removeCookies()
                }).catch(e => {
                    console.error(e)
                })
            }
        } else {
            removeCookies()
        }
    }

    const removeCookies = () => {
        Cookies.remove(config.accessTokenKeyName)
        Cookies.remove(config.refreshTokenKeyName)
        Cookies.remove(config.role)
        Cookies.remove(config.username)
        sessionStorage.removeItem('LOGIN_TYPE')
        window.open('/', '_self')
    }

    const profileAction = () => {
        profile.role !== 'STUDENT' ? props.props.history.push(rs.manageProfile)
            : props.props.history.push(rs.studentMyProfile)
    }

    const handleModal = (data) => {
        setModal(true)
        setModalMsg(`Are you sure to change the role to ${data.label}`)
        setReqRole(data.value)
    }

    const changeRoleAction = () => {
        cookie.save(config.role, reqRole, {path: '/'})
        userData.role = reqRole
        cookie.save(config.user, JSON.stringify(userData), {path: '/'})
        window.open(rs.dashboard, '_self')
    }

    const dropdownToggle = () => <>
        <DropdownToggle color='flat-secondary' caret>
            {findObject(Object.values(ROLES), profile.role).label || 'Admin'}
        </DropdownToggle>
        {
            userData.userRoles.length > 1 &&
            <DropdownMenu>
                {
                    userData.userRoles.map(item => {
                        return <DropdownItem tag='a'
                                             onClick={() => handleModal(item)}>{item.label}</DropdownItem>
                    })
                }
            </DropdownMenu>
        }
    </>

    return (
        <>
            <div className='user-nav d-sm-block d-none text-align-right'>
                <div>
                    <span className='user-name fw-bold'>
                        {store.details === null ? name : `${store.details.name}`}</span>
                </div>
                {
                    profile.role !== 'STUDENT' && userData.userRoles?.length > 1 ?
                        <UncontrolledButtonDropdown>
                            {dropdownToggle()}
                        </UncontrolledButtonDropdown> :
                        profile.role !== 'STUDENT' && userData.userRoles?.length === 1 ?
                            <span
                                className='user-status'>{findObject(Object.values(ROLES), profile.role).label || 'Admin'}</span> :
                            <span className='user-status'>{userData.cbNumber}</span>
                }
            </div>
            {
                mobile && <>
                    {
                        profile.role !== 'STUDENT' && userData.userRoles?.length > 1 ?
                            <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
                                {dropdownToggle()}
                            </UncontrolledDropdown> :
                            profile.role !== 'STUDENT' && userData.userRoles?.length === 1 ?
                                <span
                                    className='user-status'>{findObject(Object.values(ROLES), profile.role).label || 'Admin'}</span> :
                                <span
                                    className='user-status'>{store.details === null ? name : `${store.details.name}`}</span>
                    }
                </>

            }
            <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
                <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link'
                                onClick={e => e.preventDefault()}>
                    <Avatar img={userAvatar} imgHeight='40' imgWidth='40' status='online'/>
                </DropdownToggle>
                <DropdownMenu end>
                    <DropdownItem onClick={profileAction}>
                        <User size={14} className='me-75'/>
                        <span className='align-middle'>Profile</span>
                    </DropdownItem>
                    <DropdownItem divider/>
                    <DropdownItem onClick={logoutAction}>
                        <Power size={14} className='me-75'/>
                        <span className='align-middle'>Logout</span>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
            {
                modal &&
                <ConfirmBox
                    isOpen={true}
                    toggleModal={() => setModal(false)}
                    yesBtnClick={() => changeRoleAction()}
                    noBtnClick={() => setModal(false)}
                    title={'Confirmation'}
                    message={modalMsg}
                    yesBtn="Yes"
                    noBtn='No'
                    icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
                />
            }
        </>
    )
}

export default UserDropdown
