import {Fragment, useEffect, useState} from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {Bell, X, Check, AlertTriangle, Trash} from 'react-feather'
import {Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown} from 'reactstrap'
import {initializeApp} from "firebase/app"
import {getMessaging, getToken, onMessage} from "firebase/messaging"
import * as Api from "@api/common"
import Cookies from "js-cookie"
import config from '@storage'
import {FAVICON_ICON, DATE_FORMAT_H2} from '@const'
import {getDataFromAccessToken} from '@utils'
import moment from "moment"

const VAPID_KEY = 'BNcQhvyBXHwtug3beTh0YNay5XNCyjyTFHG3Lh8oLssx0xwUIMj4IWu3gBD8bCxhehZvJledgWuLOnVswqL0JFY'
const firebaseConfig = {
    apiKey: "AIzaSyCOP2vm4UzXv57TLn-DlkQ8olgDRPx3GBo",
    authDomain: "apiit-86bee.firebaseapp.com",
    projectId: "apiit-86bee",
    storageBucket: "apiit-86bee.appspot.com",
    messagingSenderId: "440672422662",
    appId: "1:440672422662:web:9e3a1c98558d8d4acfec87",
    measurementId: "G-2443KDQ3E7"
}

const NotificationDropdown = () => {

    // Initialize Firebase
    initializeApp(firebaseConfig)
    const messaging = getMessaging()

    const [open, isOpen] = useState(false)
    const [newNotifications, isNewNotifications] = useState(false)
    const [notifications, setNotifications] = useState([])

    useEffect(async () => {
        await requestBrowserNotification()
        await requestForToken()
        await onMessageListener()
    }, [])

    const requestForToken = () => {
        return getToken(messaging, {vapidKey: VAPID_KEY})
            .then(async (currentToken) => {
                if (currentToken) {
                    await Api.addFCMTokenToUser(JSON.parse(Cookies.get(config.user)).userId, {
                        token: currentToken,
                        deviceType: 'mobile'
                    })
                } else {
                    console.log('No registration token available. Request permission to generate one.')
                }
            })
            .catch((err) => {
                console.log('An error occurred while retrieving token. ', err)
            })
    }

    const onMessageListener = () => new Promise((resolve) => {
        onMessage(messaging, async (payload) => {
            isNewNotifications(true)
            await sendNotificationToBrowser()
            resolve(payload)
        })
    })

    const getUserNotifications = async () => {
        if (!open) {
            const res = await Api.getUserNotifications(JSON.parse(Cookies.get(config.user)).userId)
            setNotifications([...res])
            isNewNotifications(false)
        }
        //isOpen(!open)
    }

    const requestBrowserNotification = async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification")
        } else if (Notification.permission !== "granted") {
            await Notification.requestPermission()
        }
    }

    const sendNotificationToBrowser = () => {
        if (Notification.permission === "granted") {
            browserNotify()
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    browserNotify()
                }
            })
        }
    }

    const browserNotify = () => {
        const options = {
            body: 'New notification',
            icon: FAVICON_ICON
        }

        const notification = new Notification("Amrak - Student Management System", options)
        notification.onclick = () => {
            notification.close()
        }
    }

    const renderNotificationItems = () => {
        return (
            <PerfectScrollbar
                component='li'
                className='media-list scrollable-container'
                options={{
                    wheelPropagation: false
                }}
            >
                {notifications.map((item, index) => {
                    const splittedDate = item.createdAt ? item.createdAt.split('.')[0] : ''
                    const dateTime = splittedDate ? splittedDate.substr(0, splittedDate.length - 3) : 'N/A'
                    return (
                        <a key={index} className='d-flex align-items-center bb-1 hover-bg' href='/'
                           onClick={e => e.preventDefault()}>
                            <div
                                className="list-item d-flex flex-column"
                            >
                                <p className='media-heading mb-0 text-dark'>
                                    <span className='fw-bolder'>{item.title}</span>
                                </p>
                                <small className='' style={{color: 'grey', fontWeight: 500}}>{item.description}</small>
                                {/*<small*/}
                                {/*    className={'notification-text'}>{moment(`${item.createdAt}`).format(DATE_FORMAT_H2)}</small>*/}

                                <small
                                    className={'notification-text'}>{dateTime}</small>
                            </div>

                            <div className={'p-2'} onClick={() => onClear('SINGLE', item)}>
                                <X size={15} color={'grey'}/>
                            </div>
                        </a>
                    )
                })}

                {notifications.length === 0 &&
                    <div align={'center'} className={'p-2'}>No notifications are available</div>}
            </PerfectScrollbar>
        )
    }

    const onClear = async (type, data) => {
        const user = await getDataFromAccessToken()
        const res = await Api.clearNotifications(user.userId, (data ? data.notificationId : 0))
        if (res) await getUserNotifications()
    }

    return (<>
        <UncontrolledDropdown tag='li' className='dropdown-notification nav-item me-25'>
            <DropdownToggle tag='a' className='nav-link' href='/' onClick={async e => {
                e.preventDefault()
                await getUserNotifications()
            }}>
                <Bell size={21}/>
                {
                    newNotifications && <Badge pill color='danger' className='badge-up notification-indi'/>
                }
            </DropdownToggle>
            <DropdownMenu end tag='ul' className='dropdown-menu-media mt-0'>
                <li className='dropdown-menu-header'>
                    <DropdownItem className='d-flex align-items-center' tag='div' header>
                        <h4 className='notification-title mb-0 me-auto'>Notifications</h4>
                        {newNotifications &&
                            <Badge tag='div' color='light-primary' pill style={{marginRight: 20}}>
                                New Notifications!
                            </Badge>
                        }

                        {notifications.length !== 0 && <Trash size={15} color={'#ea5455'} style={{cursor: 'pointer'}}
                                                              onClick={() => onClear('ALL')}/>}
                    </DropdownItem>
                </li>
                {renderNotificationItems()}

            </DropdownMenu>
        </UncontrolledDropdown>
    </>)
}

export default NotificationDropdown
