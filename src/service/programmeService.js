import ApiService from "./apiHandler"

export async function getAllProgramme(name, page, size) {
    const url = `programmes?page=${page}&size=${size}${name === '' ? `` : `&name=${name}`}`
    const apiObject = {}
    apiObject.method = 'GET'
    apiObject.authentication = true
    apiObject.endpoint = url
    return await ApiService.callApi(apiObject)
}


export async function createEditProgramme(data, id) {
    const url = `programme`
    const apiObject = {}
    apiObject.method = id === null ? 'POST' : 'PATCH'
    apiObject.authentication = true
    apiObject.endpoint = url
    apiObject.body = data
    return await ApiService.callApi(apiObject)

}