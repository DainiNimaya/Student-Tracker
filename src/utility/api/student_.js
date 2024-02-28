import {API_RESPONSE_STATUS, FEE_TYPE} from '@const'
import * as studentService from '@service/studentService'

import React from "react"
import {SuccessToast} from "@toast"
import {capitalize} from '@commonFunc'

export const getRegStudentDuePayments = async (Id) => {
    const body = {}
    // await studentService.getRegStudentDuePayments(Id)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             if (res.body !== null) {
                    let courseCount = 0
                    const temp = []

                    const tempData =  {
                        courseName: "Bio Science ",
                        currency: "LKR",
                        courseId: 2878,
                        inquiryId: 0,
                        studentDuePaymentPlanList: [
                            {
                               inquiryPaymentPlanStructure: 11143,
                               studentPaymentPlanStructure: 0,
                               mandatory: false,
                               feeDescription: "Non Refundable",
                               taxPercentage: null,
                               feetype: "REGISTRATION_FEE",
                               dueDate: null,
                               status: "TO_BE_PAID",
                               amount: 20000.00,
                               currency: "LKR",
                               discount: 0,
                               taxAmount: 0.00,
                               amountPayable: 20000.00
                            },
                            {
                                inquiryPaymentPlanStructure: 11144,
                                studentPaymentPlanStructure: 0,
                                mandatory: false,
                                feeDescription: "Refundable",
                                taxPercentage: null,
                                feetype: "LIBRARY_FEE",
                                dueDate: null,
                                status: "TO_BE_PAID",
                                amount: 30000.00,
                                currency: "LKR",
                                discount: 0,
                                taxAmount: 0.00,
                                amountPayable: 30000.00
                            },
                            {
                                inquiryPaymentPlanStructure: 11145,
                                studentPaymentPlanStructure: 0,
                                mandatory: false,
                                feeDescription: "Refundable",
                                taxPercentage: null,
                                feetype: "COURSE_FEE",
                                dueDate: "2023-08-01",
                                status: "TO_BE_PAID",
                                amount: 400000.00,
                                currency: "LKR",
                                discount: 0,
                                taxAmount: 0.00,
                                amountPayable: 419200.00
                            }
                        ]
                    }

                    if (tempData.studentDuePaymentPlanList.length !== 0) {
                        tempData.studentDuePaymentPlanList.map(item => {
                            item.feetype === "COURSE_FEE" ? courseCount += 1 : 0
                        })

                        tempData.studentDuePaymentPlanList.map(item => {

                            if (item.status === 'TO_BE_PAID' || item.status === 'PENDING ') {
                                // let feeLable = ''
                                // FEE_TYPE.map(fee => {
                                //     if (fee.value === item.feetype) feeLable = fee.label
                                // })

                                let tempFeeType = item.feetype ? item.feetype : item.feeType
                                let desc = item.feeDescription ? item.feeDescription : item.description
                                if (tempFeeType === 'REPEAT_FEE') {
                                    const codeStartIndex = desc.indexOf(desc.split(' ')[2])
                                    tempFeeType = `Repeat fee - ${desc.split(' ')[0]}`
                                    desc = desc.substring(codeStartIndex)
                                }

                                temp.push({
                                    id: item.inquiryPaymentPlanStructure,
                                    select: item.feetype === 'REGISTRATION_FEE',
                                    amount: item.amount,
                                    dueDate: item.dueDate,
                                    feetype:  capitalize(tempFeeType.replaceAll('_', ' ').toLowerCase()),
                                    feeDescription: desc,
                                    status: item.status,
                                    isInquiry: false,
                                    taxPercentage: item.taxPercentage
                                })
                            }
                        })
                    }
                    body.courseId = tempData.courseId
                    body.courseName = tempData.courseName
                    body.currency = tempData.currency
                    body.duePayments = temp
                    body.taxPercentage = temp[0] && temp[0].taxPercentage ? temp[0].taxPercentage : 0
                // }
        //     }
        // })
    return body
}

export const getRegStudentPaymentPlans = async (Id) => {
    const body = {}
    await studentService.getRegStudentPaymentPlans(Id)
        .then(res => {
            if (res.status === API_RESPONSE_STATUS[0]) {
                if (res.body !== null) {
                    let courseCount = 0
                    const temp = []

                    if (res.body.studentPaymentPlan.length !== 0) {
                        res.body.studentPaymentPlan.map(item => {
                            item.feetype === "COURSE_FEE" ? courseCount += 1 : 0
                        })

                        res.body.studentPaymentPlan.map(item => {

                            let feeLable = ''
                            FEE_TYPE.map(fee => {
                                if (fee.value === item.feetype) feeLable = fee.label
                            })

                            temp.push({
                                select: item.feetype === 'REGISTRATION_FEE',
                                amount: item.amount,
                                dueDate: item.dueDate,
                                feetype: feeLable,
                                feeDescription: item.feeDescription,
                                status: item.status
                            })
                        })
                    }
                    if (res.body.studentPaymentDiscount !== null && res.body.studentPaymentDiscount.length !== 0) {
                        res.body.studentPaymentDiscount.map(item => {

                            let feeLable = ''
                            FEE_TYPE.map(fee => {
                                if (fee.value === item.feetype) feeLable = fee.label
                            })

                            const discountData = {
                                select: false,
                                amount: item.feetype === "COURSE_FEE" ? (item.amount / courseCount) : item.amount,
                                dueDate: item.dueDate,
                                feetype: feeLable,
                                feeDescription: item.feeDescription,
                                status: item.status
                            }
                            if (temp.length !== 0) {
                                temp.map(detail => {
                                    if (detail.feetype === feeLable) {
                                        detail.discount = discountData
                                    }
                                })
                            }

                        })
                    }
                    body.courseId = res.body.courseId
                    body.courseName = res.body.courseName
                    body.paymentPlan = temp
                    body.paymentSummary = res.body.paymentSummary
                    body.studentPaymentPlans = res.body.studentPaymentPlan
                }
            }
        })
    return body
}

export const getRegStudentTransHistory = async (id, page) => {
    const body = {}
    // await studentService.getRegStudentTransHistory(id, page)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body !== null && res.body.content.length !== 0) {

                    const temp =  {
                        content: [
                            {
                                courseName: null,
                                receipt: "RCT11169",
                                invoiceId: 11142,
                                structureId: 11141,
                                courseId: 0,
                                paymentMethod: "CASH",
                                bankSlipUrl: null,
                                inquiryCoursePaymentTransactionHistoryId: 11142,
                                dateTime: "2024-01-29",
                                depositDate: null,
                                collectedDate: "2024-01-29",
                                chequeNo: null,
                                cardReceiptNo: null,
                                paymentMethodTypeId: 0,
                                bankSlipStatus: "APPROVED",
                                transactionType: "PAYMENT",
                                currency: "LKR",
                                refundType: null,
                                refundMethod: null,
                                paymentType: null,
                                description: null,
                                lateFee: 0.0,
                                amount: 10000.00,
                                feetype: "REGISTRATION_FEE",
                                courseFrom: null,
                                courseTo: null,
                                transferTo: null,
                                transferFrom: null,
                                remark: null
                            }
                        ],
                        pageable: {
                            sort: {
                                sorted: false,
                                unsorted: true,
                                empty: true
                            },
                            pageNumber: 0,
                            pageSize: 10,
                            offset: 0,
                            paged: true,
                            unpaged: false
                        },
                        last: true,
                        totalElements: 1,
                        totalPages: 1,
                        first: true,
                        sort: {
                            sorted: false,
                            unsorted: true,
                            empty: true
                        },
                        number: 0,
                        numberOfElements: 1,
                        size: 10,
                        empty: false
                    }

                    body.data = temp.content
                    body.elements = temp.totalElements
                    body.pages = temp.totalPages
                    body.noOfelements = temp.numberOfElements
                    body.offset = temp.pageable.offset
                // }
        //     }
        // })
    return body
}