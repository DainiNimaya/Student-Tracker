import * as enrollmentService from '@service/enrollmentService'
import * as customDiscountService from '@service/customDiscountService'
import * as paymentPlanService from '@service/paymentPlanService'
import * as paymentService from '@service/paymentService'
import * as courseService from '@service/courseService'
import * as batchService from '@service/batchService'
import * as transactionService from '@service/transactionService'
import * as userService from '@service/userService'
import {API_RESPONSE_STATUS, DATE_FORMAT_TABLE, DATE_FORMAT, DATE_FORMAT_2} from '@const'
import moment from 'moment'
import {toast} from "react-toastify"
import React from "react"
import {removePhoneNumberFirstNumbers} from '@utils'

export const getInitialSeveralInvoiceDetails = async (data, type) => {
    let body = []
    // await transactionService.getInitialSeveralInvoiceDetails(data, type)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
                body = [
                    {
                        paymentPlanStructureId: 11144,
                        feeDescription: "Refundable",
                        amount: 30000.00,
                        discount: 0,
                        totalLateFee: 0,
                        totalOverPaid: 0,
                        totalDueAmount: 30000.00,
                        paidAmount: 0.00,
                        balanceType: "LOW_PAID",
                        taxPercentage: 0
                    }
                ]
        //     }
        // })
    return body
}

export const getDashboardStats = async (type, counsellorId) => {
    let body = undefined
    // await userService.getDashboardStats(type, counsellorId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = {
                    pendingEnrollments: 20,
                    enrolledStudents: 100,
                    collectionDues: 102
                }
        //     }
        // })
    return body
}