import ApiService from './apiHandler'

export async function loginUser(userCredentials) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = false
    apiObject.isBasicAuth = true
    apiObject.urlEncoded = true
    apiObject.endpoint = 'oauth/token'
    apiObject.body = userCredentials
    apiObject.state = "login"
    return await ApiService.callApi(apiObject)
}

export async function renewToken(token) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = false
    apiObject.isBasicAuth = true
    apiObject.urlEncoded = true
    apiObject.endpoint = 'oauth/token'
    apiObject.body = token
    apiObject.state = "renewToken"
    return await ApiService.callApi(apiObject)
}

export async function requestToken(msToken, msLoginType) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = false
    apiObject.isBasicAuth = true
    apiObject.msAuthentication = true
    apiObject.urlEncoded = true
    apiObject.endpoint = 'request/token'
    apiObject.msToken = msToken
    apiObject.loginType = msLoginType
    return await ApiService.callApi(apiObject)
}

export async function requestTokenStudent(emailToken, msLoginType) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.isBasicAuth = true
    apiObject.studentAuthentication = true
    apiObject.urlEncoded = true
    apiObject.endpoint = 'request/token'
    apiObject.emailToken = emailToken
    apiObject.loginType = msLoginType
    return await ApiService.callApi(apiObject)
}

export async function defaultLogin(userCredentials) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.isBasicAuth = true
    apiObject.urlEncoded = true
    apiObject.endpoint = 'v1/request/token'
    apiObject.body = userCredentials
    apiObject.state = "login"
    return await ApiService.callApi(apiObject)
}

export async function getOtp(email) {
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.isBasicAuth = true
    apiObject.urlEncoded = true
    apiObject.endpoint = `users/otp/request/${email}`
    // apiObject.state = "login"
    return await ApiService.callApi(apiObject)
}

export async function resetPassword(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.endpoint = `users/password/forgot`
    apiObject.body = body
    return await ApiService.callApi(apiObject)
}

export async function updateProfilePassword(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.endpoint = `users/password/update`
    apiObject.body = body
    return await ApiService.callApi(apiObject)
}

export async function resetPasswordToken(body) {
    const apiObject = {}
    apiObject.method = 'POST'
    apiObject.authentication = true
    apiObject.endpoint = `users/confirm/password`
    apiObject.body = body
    return await ApiService.callApi(apiObject)
}
