import * as loginService from '@service/authService'
import config from '@storage'
import cookie from 'react-cookies'
import {ErrorToast} from "@toast"
import {toast} from 'react-toastify'
import React from "react"
import {isNULL, findObject} from "@utils"
import {ROLES} from '@const'
import qs from "qs"
import * as Api from '@api/common'

const setCookies = (res) => {
    let result = false
    const tempRole = []
    let activeRole = ''

    if (res.userRoles !== undefined && res.userRoles.length !== 0) {
        const rolesArray = Object.values(ROLES)
        res.userRoles.map(item => {
            const role = findObject(rolesArray, item)
            if (role !== null) tempRole.push(role)

            if (res.department !== null) {
                switch (res.department.departmentId) {
                    case 1:
                        const temp_1 = ['']
                        if (temp_1.includes(item)) activeRole = item
                        break
                    case 2:
                        const temp_3 = ['HEAD_OF_ACADEMIC_ADMIN', 'LECTURER']
                        if (temp_3.includes(item)) activeRole = item
                        break
                    case 3:
                        const temp_4 = ['HEAD_OF_COUNSELLOR']
                        if (temp_4.includes(item)) activeRole = item
                        break
                    case 4:
                        const temp_5 = ['HEAD_OF_FINANCE']
                        if (temp_5.includes(item)) activeRole = item
                        break
                }
                // this use when role department restriction is ignored (ijse, unicloud)
                if (activeRole === '') {
                    activeRole = res.userRoles[0]
                }
            }

        })

        if (res.department === null && res.userRoles[0] === 'STUDENT') {
            activeRole = 'STUDENT'
        }
    }

    cookie.save(config.accessTokenKeyName, res.access_token, {path: '/'})
    cookie.save(config.refreshTokenKeyName, res.refresh_token, {path: '/'})
    cookie.save(config.role, activeRole, {path: '/'})
    cookie.save(config.username, `${res.firstName} ${res.lastName}`, {path: '/'})

    const user = {
        userId: res.userId ? isNULL(res.userId) : null,
        profileImage: res.profileImageUrl ? isNULL(res.profileImageUrl) : null,
        role: activeRole,
        email: res.email ? isNULL(res.email) : null,
        firstName: res.firstName ? isNULL(res.firstName) : null,
        lastName: res.lastName,
        cbNumber: res.cbNumber ? isNULL(res.cbNumber) : null,
        studentId: res.studentId ? isNULL(res.studentId) : null,
        userRoles: tempRole,
        mobile: res.mobileNumber
    }
    cookie.save(config.user, JSON.stringify(user), {path: '/'})
    result = true

    return result
}

export const defaultLogin = async (email, password) => {
    let result = false
    const body = {
        username: email,
        password,
        grant_type: 'password'
    }
    const res = await Api.defaultLogin(qs.stringify(body))
    if (!res?.success) {
        toast.error(res.msg, {icon: true, hideProgressBar: true})
    }

    if (typeof res === 'object' && res?.access_token) {
        result = await setCookies(res)
    }
    return result
}
