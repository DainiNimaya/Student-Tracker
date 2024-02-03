import * as programmeService from '@service/programmeService'
import {toast} from "react-toastify"
import * as batchPlanService from '@service/batchPlanService'
import * as recommendationService from '@service/recommendationService'
import * as schoolService from '@service/schoolService'
import * as levelService from '@service/levelService'
import * as courseService from '@service/courseService'
import * as moduleService from '@service/moduleService'
import * as batchService from '@service/batchService'
import * as paymentSchemeService from '@service/paymentSchemeService'
import * as userService from '@service/userService'
import * as schemeService from '@service/schemeService'
import * as branchService from '@service/branchService'
import * as awardingBodyService from '@service/awardingBodyService'
import * as assessmentService from '@service/assessmentService'
import * as classSetupService from '@service/classSetupService'
import * as counsellorService from '@service/counsellorService'
import * as gapService from '@service/gapService'
import * as lecturerService from '@service/lecturerService'
import * as leaveService from '@service/leaveService'
import * as studentService from '@service/studentService'
import * as venueService from '@service/venueService'
import * as feeSchemeService from '@service/feeSchemeService'
import * as paymentPlanService from '@service/paymentPlanService'
import * as followUpService from '@service/followUpService'
import * as attendanceService from '@service/attendanceService'
import * as intakeService from '@service/intakeService'
import * as provideCodeService from '@service/provideCodeService'
import * as configService from '@service/configService'
import * as holidayService from '@service/holidayCalenderService'
import * as haaService from '@service/haaService'
import * as paymentService from '@service/paymentService'
import * as markingService from '@service/markingService'
import * as emailService from '@service/emailService'
import * as acceptanceService from '@service/acceptanceService'

import {API_RESPONSE_STATUS, DATE_FORMAT_2} from '@const'
import Cookies from "js-cookie"
import config from '@storage'
import React from "react"
import {ErrorToast, SuccessToast} from "@toast"
import {
    gradingSchemesRequestDataObject,
    assessmentSchemesRequestDataObject,
    assessmentSchemeTypeRequestDataObject,
    getCookieUserData
} from '@utils'
import moment from "moment"

const successMessage = "Operation Success"

export const getAllProgramme = async (name, page, size) => {
    let body = []
    // await programmeService.getAllProgramme(name, page, size)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body) {
                    body = {
                        content:[
                            {programmeId:'1', name:'Engineering Programmes', desc: 'It encompasses a wide range of disciplines such as civil, mechanical, electrical, chemical, and computer engineering, among others.'},
                            {programmeId:'2',name:'Business Programmes', desc: 'It covers key areas such as finance, marketing, accounting, human resources, and entrepreneurship.'},
                            {programmeId:'3',name:'IT Programmes', desc: 'Students learn how to design, implement, and manage technology solutions to address organizational needs and challenges.'},
                            {programmeId:'4',name:'Accountancy Programmes', desc: 'An accountancy program is designed to provide students with a comprehensive understanding of financial principles, practices, and regulations. '},
                            {programmeId:'5',name:'Master of Business Administration', desc: 'A Master of Business Administration (MBA) program is a graduate-level degree that provides students with advanced knowledge and skills in various aspects of business management and leadership'}
                        ],
                        totalElements:5,
                        totalPages:1,
                        numberOfElements:5,
                        pageable:{offset:0}
                    }
        //         }
        //     }
        // })
    return body
}

export const createEditProgramme = async (data) => {

    const requiredData = {}
    requiredData.programmeId = data.programmeId === null ? 0 : data.programmeId
    requiredData.programmeName = data.programmeName
    requiredData.programmeDescription = data.description

    let body = 1
    await programmeService.createEditProgramme(requiredData, data.programmeId)
        .then(res => {
            if (res !== undefined) {
                if (res.status === 0) {
                    toast.success(data.courseId === null ? "Programme added successfully." : "Programme details updated successfully", {
                        icon: true,
                        hideProgressBar: true
                    })
                    body = res.status
                }
            }
        })
    return body

}

export const getStudentFurtherInfo = async (id, cbNo) => {
    let body = []
    await studentService.getStudentFurtherInfo(id, cbNo)
        .then(res => {
            if (res.status === 0) {
                // body = res.body
                body =  {
                    locality: "LOCAL",
                    dateOfBirth: "2000-01-05",
                    maritalStatus: "SINGLE",
                    country: "Sri Lanka",
                    nicPassport: "99586768",
                    gender: "MALE",
                    profilePictureUrl: "https://amrak-dev-resources.unicloud360.com/profile_images/1704712707174-african-college-students-classroom-young-studying-39110187.webp",
                    origin: null,
                    placeOfBirth: null,
                    nationality: "Sinhala",
                    race: null,
                    religion: null,
                    hobbies: null,
                    specialAbilities: null,
                    studentSupport: {
                        studentSupport: false,
                        disabilities: false,
                        specialNeeds: false,
                        otherConsider: false,
                        disabilitiesReason: null,
                        specialNeedsReason: null,
                        considerReason: null
                    },
                    nicImages: ["https://amrak-dev-resources.unicloud360.com/default/1704712735672-a.pdf"]
                }
            }
        })
    return body
}

export const updateStudentFurtherInfo = async (id, data) => {
    let body = 1
    await studentService.updateStudentFurtherInfo(id, data)
        .then(res => {
            if (res.status === 0) {
                toast.success("Further information details updated successfully.", {
                    icon: true,
                    hideProgressBar: true
                })
                body = res.status
            }
        })
    return body
}

export const getStudentEmploymentInfo = async (id, cbNo) => {
    let body = []
    await studentService.getStudentEmploymentInfo(id, cbNo)
        .then(res => {
            if (res.status === 0) {
                // body = res.body
                body =  {
                    employeeRecordAvailable: false,
                    workingInformation: {
                        jobTitle: null,
                        natureOfJob: null,
                        department: null,
                        joinedDate: null,
                        jobReference: null,
                        income: null,
                        experience: null,
                        serviceLetter: null
                    },
                    companyInfo: {
                        companyName: null,
                        mainBusiness: null,
                        orgType: null,
                        contactPerson: null,
                        address: null,
                        country: "Sri Lanka",
                        province: null,
                        city: null,
                        postalCode: null,
                        telephone: null,
                        email: null
                    }
                }
            }
        })
    return body
}

export const updateStudentEmploymentInfo = async (id, data) => {
    let body = 1
    await studentService.updateStudentEmploymentInfo(id, data)
        .then(res => {
            if (res.status === 0) {
                toast.success("Employment information details updated successfully.", {
                    icon: true,
                    hideProgressBar: true
                })
                body = res.status
            }
        })
    return body
}

export const uploadFile = async (studentId, data) => {
    let body = []
    await Promise.all(data.map(async (item, index) => {
        const formData = new FormData()
        formData.append("type", item.type)
        formData.append("file", item.file)

        await studentService.uploadFile(studentId, formData)
            .then(async res => {
                if (res.status === API_RESPONSE_STATUS[0]) {

                    if (index === (data.length - 1)) {
                        body = res.body
                        toast.success(res.message, {icon: true, hideProgressBar: true})
                    }
                }
            })
    }))
    return body
}

export const getCoursesByStudentId = async (studentId, cbNo) => {
    let body = []
    await courseService.getCoursesByStudentId(studentId, cbNo).then(res => {
        if (res.status === API_RESPONSE_STATUS[0]) {
            // body = res.body
            body =  [
                {
                    courseId: 77,
                    courseName: "Medical Science",
                    batchCode: " 52MSJ2023P(Sa)",
                    status: "ONGOING",
                    remark: null,
                    recommendationLetter: null,
                    studentAgreement: null,
                    intakeId: 38,
                    intakeCode: "June/July"
                }
            ]
        }
    })
    return body
}

export const getQualificationsByStudentId = async (studentId, cbNo) => {
    let body = []
    await studentService.getQualificationsByStudentId(studentId, cbNo).then(res => {
        if (res.status === 0) {
            // body = res.body
            body =  [
                {
                   qualificationId: 10743,
                   qualification: "G.C.E O/L",
                   indexNo: "1234567",
                   inquiryId: 10644,
                   level: "3",
                   year: "2019",
                   school: "Panadura",
                   status: "APPROVED",
                   comment: null,
                   results: [],
                   transcript: null,
                   otherAttachment: null,
                   specialComment: ""
                }
            ]
        }
    })
    return body
}

export const updateQualificationByStudentIdAndQualificationId = async (studentId, qualificationId, data) => {
    let body = null
    await studentService.updateQualificationByStudentIdAndQualificationId(studentId, qualificationId, data)
        .then(res => {
            if (res.status === 0) {
                body = res
            }
        })
    return body
}

export const getFeeSchemeByStudentId = async (studentId) => {
    let body = null
    // await feeSchemeService.getFeeSchemeByStudentId(studentId).then(res => {
    //     if (res.status === 0) {
            // body = res.body
            body =  {
                paymentPlan: [
                    {
                        paymentPlanId: 2348,
                        paymentPlanStructureId: 10745,
                        description: "Non Refundable",
                        feeType: "REGISTRATION_FEE",
                        dueDate: null,
                        amount: 10000.00,
                        paymentReceipt: null,
                        payment: 10000.00,
                        status: "PAID",
                        invoiceId: 10746,
                        lateFee: 0.00,
                        discount: 0,
                        taxAmount: 0.00,
                        amountPayable: 10000.00,
                        currencyType: null,
                        refundedAmount: 0.00
                    },
                    {
                        paymentPlanId: 2348,
                        paymentPlanStructureId: 10747,
                        description: "Non Refundable",
                        feeType: "SU_FEE",
                        dueDate: null,
                        amount: 20000.00,
                        paymentReceipt: null,
                        payment: null,
                        status: "TO_BE_PAID",
                        invoiceId: 0,
                        lateFee: 0,
                        discount: 0,
                        taxAmount: 0.00,
                        amountPayable: 20000.00,
                        currencyType: null,
                        refundedAmount: 0.00
                    },
                    {
                        paymentPlanId: 2348,
                        paymentPlanStructureId: 10748,
                        description: "Refundable",
                        feeType: "LIBRARY_FEE",
                        dueDate: null,
                        amount: 30000.00,
                        paymentReceipt: null,
                        payment: null,
                        status: "TO_BE_PAID",
                        invoiceId: 0,
                        lateFee: 0,
                        discount: 0,
                        taxAmount: 0.00,
                        amountPayable: 30000.00,
                        currencyType: null,
                        refundedAmount: 0.00
                    },
                    {
                        paymentPlanId: 2348,
                        paymentPlanStructureId: 10749,
                        description: "Refundable",
                        feeType: "COURSE_FEE",
                        dueDate: "2023-07-31",
                        amount: 400000.00,
                        paymentReceipt: null,
                        payment: null,
                        status: "TO_BE_PAID",
                        invoiceId: 0,
                        lateFee: 18600.00,
                        discount: 0,
                        taxAmount: 0.00,
                        amountPayable: 418600.00,
                        currencyType: null,
                        refundedAmount: 0.00
                    }
                ],
                transactionHistory: [
                    {
                        transactionId: 10746,
                        description: null,
                        transactionType: "PAYMENT",
                        date: "2024-01-09",
                        amount: 10000.00,
                        invoiceId: 10746,
                        paymentType: "REGISTRATION_FEE",
                        status: "APPROVED",
                        paymentPlanStructureId: 10745,
                        currency: "LKR"
                    }
                ]
            }
    //     }
    // })
    return body
}