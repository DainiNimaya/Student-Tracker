import * as intakeService from '@service/intakeService'
import * as userService from '@service/userService'
import * as courseService from '@service/courseService'
import * as counsellorService from '@service/counsellorService'
import * as inquiryProspectService from '@service/inquiryProspectService'
import * as paymentService from '@service/paymentService'
import * as discountService from '@service/discountService'
import * as followUpService from '@service/followUpService'
import * as inquiryService from '@service/inquiryService'
import * as enrollmentService from '@service/enrollmentService'
import * as registrationService from '@service/registrationService'
import * as batchService from '@service/batchService'
import {API_RESPONSE_STATUS, DATE_FORMAT_TABLE} from '@const'
import {toast} from "react-toastify"
import moment from "moment"
import {capitalize} from '@commonFunc'
import {removePhoneNumberFirstNumbers} from '@utils'
import config from '@storage'


export const getAllIntakes = async (branchId) => {
    let body = []
    // await intakeService.getAllIntakes(branchId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                // body = res.body
                body =  [
                    {
                        intakeId: 38,
                        intakeCode: "June/July",
                        startDate: null,
                        endDate: null,
                        intakeName: "Fall Intake",
                        duration: 0,
                        noOfStudents: 50,
                        ongoing: false,
                        courseName: ["Medical Science"],
                        assignedBatched: ["52MSJ2023F", " 52MSJ2023P(Sa)", "52MSJ2023P(NE)"]
                    }
                ]
        //     }
        // })
    return body
}

export const getAllCourses = async (url) => {
    let body = []
    // await courseService.getAllCourses(url)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                // body = res.body
                body =  [
                    {
                        courseId: 77,
                        courseName: "Medical Science",
                        courseCode: "MS",
                        addedDate: "2023-06-27T07:44:03.418+00:00",
                        schoolOrDepartment: {
                            schoolId: 13,
                            schoolName: "Medical School",
                            courseList: null
                        },
                        providerCode: 41,
                        courseDescription: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                        qualificationAchieve: "Masters",
                        specialization: "Specilization",
                        courseType: "FULL_TIME",
                        programCode: "Program code",
                        totalCredits: 360,
                        neededDocument: null,
                        effectiveModulesCount: 0,
                        maxElectiveCount: 2,
                        minElectiveCount: 0,
                        degreeStatus: null
                    }
                ]
        //     }
        // })
    return body
}

export const getAllCounselors = async (userId, branchId) => {
    let body = []
    // await counsellorService.getAllCounselors(userId, branchId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                // body = res.body
                const bodyTemp =  [
                    {
                        userId: 1,
                        role: null,
                        email: null,
                        office365LoginAttributes: null,
                        firstName: "Navishka",
                        lastName: "",
                        gender: null,
                        dateOfBirth: null,
                        profileImageUrl: null,
                        mobileNumber: null,
                        landNumber: null,
                        nic: null,
                        empNo: null,
                        createdAt: null,
                        restrictedBranches: null,
                        designation: null,
                        restrictedSchools: null,
                        restrictedCourses: null
                    }
                ]
                const data = bodyTemp.map(item => {
                    return {value: item.userId, label: (`${item.firstName} ${item.lastName}`)}
                })
                body = data
        //     }
        // })
    return body
}

export const getAllIntakeCourses = async (url, intake) => {
    let body = []
    // await courseService.getAllIntakeCourses(url, intake)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                // body = res.body
                body =  [
                    {
                        courseId: 77,
                        courseName: "Medical Science",
                        courseCode: "MS",
                        addedDate: "2023-06-27T07:44:03.418+00:00",
                        schoolOrDepartment: {
                            schoolId: 13,
                            schoolName: "Medical School",
                            courseList: null
                        },
                        providerCode: 41,
                        courseDescription: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                        qualificationAchieve: "Masters",
                        specialization: "Specilization",
                        courseType: "FULL_TIME",
                        programCode: "Program code",
                        totalCredits: 360,
                        neededDocument: null,
                        effectiveModulesCount: 0,
                        maxElectiveCount: 2,
                        minElectiveCount: 0,
                        degreeStatus: null
                    }
                ]
        //     }
        // })
    return body
}

export const getAllInquiries = async (data) => {
    let body = []
    // await inquiryService.getAllInquiries(data)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                // body = res.body
                body = {
                    content: [
                        {
                            inquiryId: 10644,
                            studentName: "Shaveena",
                            studentId: 10739,
                            cbNumber: "SID000050",
                            approvedBy: null,
                            approvedDate: null,
                            appointmentDate: null,
                            createdAt: "2024-01-09T09:35:37.270+00:00",
                            studentTitle: null,
                            inquiryType: null,
                            inquiryStatus: "REGISTRATION",
                            inquiryNumber: "INQ10680",
                            studentMobile: null,
                            studentContact: null,
                            studentEmail: "Shaveena@gmail.com",
                            remark: null,
                            followUpRemark: null,
                            jobTitle: null,
                            natureOfJob: null,
                            department: null,
                            jobReference: null,
                            income: 0.0,
                            experience: null,
                            serviceLetterUrl: null,
                            companyName: null,
                            mainBusiness: null,
                            orgType: null,
                            orgContactPerson: null,
                            orgAddress: null,
                            orgTelephone: null,
                            orgEmail: null,
                            nicPassport: "99586768",
                            uniReferenceNumber: null,
                            apiitReferenceNumber: null,
                            subStatus: "PAID",
                            lastFollowupDate: null,
                            nextFollowupDate: null,
                            followupDateTime: null,
                            requestedDate: "2024-01-08",
                            submittedDate: null,
                            marketingCode: null,
                            offer: null,
                            applicationStatus: null,
                            aaRecommendationStatus: null,
                            hosRecommendationStatus: null,
                            declarationStatus: null,
                            specialApprovalState: null,
                            specialApprovalRemark: null,
                            counselor: {
                                userId: 1,
                                role: null,
                                email: "navishkad@ceyentra.com",
                                office365LoginAttributes: null,
                                firstName: "Navishka",
                                lastName: "",
                                gender: null,
                                dateOfBirth: null,
                                profileImageUrl: "https://sms-resources.amrak.lk/navishkad@ceyentra.comprofileImg",
                                mobileNumber: "",
                                landNumber: null,
                                nic: null,
                                empNo: "1",
                                createdAt: null,
                                restrictedBranches: null,
                                designation: null,
                                restrictedSchools: null,
                                restrictedCourses: null
                            },
                            course: {
                                courseId: 77,
                                courseName: "Medical Science",
                                courseCode: "MS",
                                courseDescription: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                                qualificationAchieve: "Masters",
                                specialization: "Specilization",
                                courseType: "FULL_TIME",
                                providerCode: 41,
                                schoolId: 13,
                                levelId: null,
                                branchId: 0,
                                programCode: "Program code",
                                totalCredits: 360,
                                neededDocument: null,
                                effectiveModulesCount: 0,
                                maxElectiveCount: 2,
                                minElectiveCount: 0
                            },
                            intake: {
                                intakeId: 38,
                                intakeCode: "June/July",
                                startDate: null,
                                endDate: null
                            },
                            inquiryPaymentPlanStructureList: null,
                            inquiryDiscountList: [],
                            duplicateDetails: [],
                            paymentPlan: "Annual ",
                            dueDate: null,
                            paymentCollectedBy: ["Navishka Navishka"],
                            pendingQualificationList: [
                                {
                                    qualificationId: 10657,
                                    qualification: "G.C.E O/L",
                                    indexNo: "1234567",
                                    inquiryId: null,
                                    level: null,
                                    year: "2019",
                                    school: "Panadura",
                                    status: "PENDING",
                                    comment: null,
                                    results: null,
                                    transcript: null,
                                    otherAttachment: null,
                                    specialComment: null
                                }
                            ]
                        }
                    ],
                    pageable: {
                        sort: {
                            sorted: false,
                            empty: true,
                            unsorted: true
                        },
                        pageNumber: 0,
                        pageSize: 10,
                        offset: 0,
                        paged: true,
                        unpaged: false
                    },
                    last: false,
                    totalElements: 1,
                    totalPages: 1,
                    sort: {
                        sorted: false,
                        empty: true,
                        unsorted: true
                    },
                    size: 10,
                    number: 0,
                    first: true,
                    numberOfElements: 10,
                    empty: false
                }
        //     }
        // })
    return body
}

export const getAllRegisteredExport = async (data) => {
    let body = null
    const content = []
    await inquiryService.getAllInquiries(data)
        .then(res => {
            if (res.status === API_RESPONSE_STATUS[0]) {
                res.body.content.map(item => {
                    const tempData = {
                        ...item,
                        intake: item.intake ? item.intake.intakeCode : '',
                        counselorName: item.counselor ? `${item.counselor.firstName} ${item.counselor.lastName}` : '',
                        courseName: item.course ? item.course.courseName : '',
                        registeredDate: item.createdAt ? moment(item.createdAt).format('D/M/YYYY') : ''
                    }

                    let tempQual = ''
                    item?.qualificationList.map((qual, qi) => {
                        tempQual += `${qi === 0 ? '' : ' / '} ${qual.qualificationName}`
                        qual?.results.map((result, ri) => {
                            tempQual += `${ri === 0 ? ' - (' : ', '} ${result.subjectName} -  ${result.result} ${(qual.results.length - 1 === ri ? ')' : '')}`
                        })
                    })

                    content.push({
                        ...tempData,
                        qualifications: tempQual
                    })
                })

                body = {
                    ...res.body,
                    content
                }
            }
        })
    return body
}