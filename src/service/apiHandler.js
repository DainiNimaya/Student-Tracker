import axios from 'axios'
import apiConfig from './apiConfig'
import Cookies from "js-cookie"
import qs from "qs"
import config from '@storage'
import * as authService from '@service/authService'
import $ from 'jquery'
import {toast} from "react-toastify"


export const callApi = async (apiObject) => {
    apiObject.loading === undefined && $(".loadingEffect").css("display", "block")
    let body = {}
    const method = apiObject.method?.toLowerCase() ?? 'get'
    // request headers
    const headers = {
        'Content-Type': apiObject.urlEncoded ? 'application/x-www-form-urlencoded' : apiObject.multipart ? 'multipart/form-data' : 'application/json'
    }

    // check request method and add request body
    if (method === 'post' || method === 'put' || method === 'patch') {
        body = apiObject.body ?? {}
    }

    // if api call require authentication, userToken add in here
    if (apiObject.authentication) {
        const access_token = Cookies.get(config.accessTokenKeyName)
        if (access_token) {
            headers.Authorization = `Bearer ${access_token}`
        }
    }

    if (apiObject.isBasicAuth) {
        headers.Authorization = `Basic ${config.basicAuthString}`
    }

    // if api call require authentication, but it use as guest user, generated link token add in here
    if (apiObject.studentAuthentication) {
        headers.email_token = apiObject.emailToken
        headers.auth_type = apiObject.loginType
    }

    // create final url before api calling
    let url = ''
    if (!apiObject.schoolTest) {
        url = `${apiConfig.serverUrl}/${apiConfig.basePath}/${(apiObject.state !== "renewToken" && apiObject.state !== "login") ? apiConfig.version : ""}${apiObject.endpoint}`
    } else {
        url = apiObject.endpoint
    }
    // const url = `${apiConfig.serverUrl}/${apiConfig.basePath}/${(apiObject.state !== "renewToken" && apiObject.state !== "login") ? apiConfig.version : "" }${apiObject.endpoint}`
    let result
    // axios function with final url and request data
    await axios[method](url, (method !== 'get' && method !== 'delete') ? body : {headers}, {headers})
        .then(response => {
            // hide loading animation when response data received
            $(".loadingEffect").css("display", "none")
            result = response.data
            if (result.status !== 0) {
                if (apiObject.toast === undefined) toast.error(result.message, {icon: true, hideProgressBar: true})
            }
        })
        .catch(async error => {
            // hide loading animation when response data received
            $(".loadingEffect").css("display", "none")

            // when error cant detect, show this error
            if (error?.response === undefined) {
                result = {success: false, msg: "Your connection was interrupted"}
            }

            if (error?.response?.status === 401) {
                // when token expired, show this error
                if (apiObject.state === "renewToken") {
                    result = {success: false, msg: "Your session has expired. Please sign in again ..."}
                    return
                }
                if (apiObject.state === "login") {
                    result = {
                        success: false,
                        msg: error?.response?.data?.msg ?? "Invalid login details please try again!"
                    }
                    return
                }

                // when user in inactive state
                if (error?.response?.data?.message && (error.response.data.message === 'User is not active')) {
                    result = {success: false, status: 1, message: "User is not active."}
                    return
                }
                result = await renewTokenHandler(apiObject)
            } else if (error?.response?.data) {
                // common response message
                result = {
                    success: false,
                    msg: error.response.data.message
                }
            } else {
                result = {
                    success: false,
                    msg: "Your connection was interrupted!"
                }
            }
            if (!result?.success) {
                if (apiObject.toast === undefined) toast.error(result.msg, {icon: true, hideProgressBar: true})
            }
        })
    return result

}

// token renew function
export const renewTokenHandler = async (apiObject) => {
    let result
    const obj = {refresh_token: Cookies.get(config.refreshTokenKeyName), grant_type: 'refresh_token'}
    await authService.renewToken(qs.stringify(obj))
        .then(async response => {
            if (response.access_token) {
                Cookies.set(config.accessTokenKeyName, response.access_token)
                Cookies.set(config.refreshTokenKeyName, response.refresh_token)
                result = await callApi(apiObject)
            } else {
                result = await response
            }
        })
    return result
}

export default {renewTokenHandler, callApi}
