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

export const getAllAssessmentsByModuleId = async (moduleId, isRepeat) => {
    let body = []
    // await assessmentService.getAllAssessmentsByModuleId(moduleId, isRepeat)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0] || 0) {
                body =  [
                    {
                        assessmentId: 73,
                        assessmentType: {
                            assessmentTypeId: 73,
                            type: "Examination",
                            percentage: 30.0
                        },
                        assessmentName: "Medical Assesment Scheme",
                        assignmentFileUrl: ""
                    },
                    {
                        assessmentId: 74,
                        assessmentType: {
                            assessmentTypeId: 74,
                            type: "Individual Viva",
                            percentage: 30.0
                        },
                        assessmentName: "Medical Assesment Scheme",
                        assignmentFileUrl: ""
                    }
                ]
        //     }
        // })
    return body
}


export const getAssessmentDatesByAssessmentId = async (assessmentId, moduleId, isRepeat) => {
    let body = []
    // await assessmentService.getAssessmentDatesByAssessmentId(assessmentId, moduleId, isRepeat)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0] || 0) {
                body =  [
                    {
                        assessmentDateId: 3152,
                        gradingSchemeId: 66,
                        code: "GGF2",
                        issueDate: "2024-01-30",
                        uploadDate: null,
                        returnDate: "2024-02-06",
                        submissionDate: "2024-02-29",
                        uploaderId: 2956,
                        uploaderName: "Bhagya Battage",
                        modaratorId: 2956,
                        modaratorName: "Bhagya Battage",
                        status: "ACTUAL",
                        classes: ["FPAMI Theory", "Hall 1", "Practical"],
                        batches: ["52MSJ2023F"],
                        noOfStudents: 12,
                        submissionPercentage: 0,
                        passedPercentage: 0
                    },
                    {
                        assessmentDateId: 4390,
                        gradingSchemeId: 66,
                        code: "Foundation",
                        issueDate: "2024-01-27",
                        uploadDate: null,
                        returnDate: "20234-02-28",
                        submissionDate: "2024-02-24",
                        uploaderId: 2956,
                        uploaderName: "Bhagya Battage",
                        modaratorId: 2956,
                        modaratorName: "Bhagya Battage",
                        status: "PENDING",
                        classes: ["Foundation Class"],
                        batches: [" 52MSJ2023P(Sa)"],
                        noOfStudents: 36,
                        submissionPercentage: 0,
                        passedPercentage: 0
                    }
                ]
        //     }
        // })
    return body
}

export const getAssessmentStudentsByAssessmentIdAndAssessmentDateId = async (assessmentId, assessmentDateId, page, status, isRepeat) => {
    let body = []
    // await assessmentService.getAssessmentStudentsByAssessmentIdAndAssessmentDateId(assessmentId, assessmentDateId, page, status, isRepeat)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0] || 0) {
                body = {
                    content: [
                        {
                            studentAssessmentId: 3153,
                            cbDocketNumber: "CB012402",
                            publishStatus: "PUBLISHED",
                            batchCode: "52MSJ2023F",
                            submittedMark: 30.0,
                            moderatedMark: 40.0,
                            actualMark: 50.0,
                            absent: false,
                            grade: "C",
                            examStatus: "PASS",
                            lecturerRemark: null,
                            lecturerRemarkDate: null,
                            lecturerRemarkUser: "",
                            moderatorRemark: null,
                            moderatorRemarkDate: null,
                            moderatorRemarkUser: "",
                            actualRemark: null,
                            actualRemarkDate: "2023-08-23",
                            actualRemarkUser: "Navishka",
                            status: "ACTUAL"
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
                    last: false,
                    totalElements: 12,
                    totalPages: 2,
                    first: true,
                    number: 0,
                    sort: {
                        sorted: false,
                        unsorted: true,
                        empty: true
                    },
                    numberOfElements: 10,
                    size: 10,
                    empty: false
                }
        //     }
        // })
    return body
}