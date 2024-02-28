import * as lecturerService from '@service/lecturerService'
import * as assessmentService from '@service/assessmentService'
import {API_RESPONSE_STATUS} from '@const'
import {toast} from "react-toastify"
import React from "react"

export const getDashboardStats = async (type, userId) => {
    let body = undefined
    // await lecturerService.getDashboardStats(type, userId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = {
                    totalClasses: 0,
                    noOfHours: 0,
                    submissionDeadlines: 2
                }
        //     }
        // })
    return body
}