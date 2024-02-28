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
    // await studentService.getStudentFurtherInfo(id, cbNo)
    //     .then(res => {
    //         if (res.status === 0) {
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
        //     }
        // })
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
    // await studentService.getStudentEmploymentInfo(id, cbNo)
    //     .then(res => {
    //         if (res.status === 0) {
    //             // body = res.body
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
        //     }
        // })
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
    // await courseService.getCoursesByStudentId(studentId, cbNo).then(res => {
    //     if (res.status === API_RESPONSE_STATUS[0]) {
    //         // body = res.body
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
                    intakeCode: "INT2024"
                }
            ]
    //     }
    // })
    return body
}

export const getQualificationsByStudentId = async (studentId, cbNo) => {
    let body = []
    // await studentService.getQualificationsByStudentId(studentId, cbNo).then(res => {
    //     if (res.status === 0) {
    //         // body = res.body
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
    //     }
    // })
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

export const getAllBatchesForProgression = async (courseId) => {
    let body = []
    // await batchService.getAllBatchesForProgression(courseId)
    //     .then(res => {
    //         if (res.status === 0) {
                const temp =  [
                    {
                        batchId: 2889,
                        batchCode: "52MSJ2023P(Su)",
                        startDate: "2023-08-01",
                        endDate: "2026-09-30",
                        orientationDate: "2023-08-01",
                        intakeId: 39,
                        intakeCode: "Aug/Sep",
                        feeScheme: 2544,
                        duration: 0,
                        branch: 17,
                        branchName: "Panadura",
                        noOfStudents: 2,
                        batchIndex: null,
                        studentLimit: 100,
                        displayName: "S.M.Part time Sunday",
                        libraryId: 0,
                        categoryId: 0
                    }
                ]
                body = temp.map(item => {
                    return {
                        label: item.batchCode,
                        value: item.batchId,
                        noOfStudents: item.noOfStudents,
                        studentLimit: item.studentLimit
                    }
                })
        //     }
        // })
    return body
}

export const getAllModulesForDropDown = async () => {
    let body = []
    // await moduleService.getAllModule('modules').then(res => {
    //     if (res.status === 0) {
            const temp = [
                {
                    moduleId: 10440,
                    moduleName: "Foundation Principles and Application IV",
                    moduleCode: "FA0044",
                    description: "",
                    weeklyHours: null,
                    noOfCredits: 30,
                    moduleType: "CORE",
                    moduleCategory: "NORMAL",
                    consideringForGpaCalculation: true,
                    assessmentSchemeId: 72,
                    assessmentSchemeCode: "Medical Assesment Scheme",
                    gradingSchemeId: 66,
                    gradingSchemeCode: "Medical Science Module Grading",
                    gradingSchemeDescription: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                    lecturerId: [9560],
                    lecturers: [
                        {
                            lecturerId: 9560,
                            cost: null
                        }
                    ],
                    levelId: 0,
                    levelName: null,
                    assignStudent: false,
                    moduleUsed: true,
                    gpaCalculate: true
                }
                ]
            body = temp.map(item => {
                return {label: item.moduleName, value: item.moduleId}
            })
    //     }
    // })
    return body
}

export const getLecturers = async () => {
    const url = `users?userRole=LECTURER`
    const body = []
    // await userService.getAllUsers(url)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             if (res.body.length !== 0) {
                    const temp =  [
                        {
                            userId: 10862,
                            role: "LECTURER",
                            userRoles: ["LECTURER"],
                            email: "dchamidiwijesuriya@gmail.com",
                            office365LoginAttributes: null,
                            firstName: "Wijini Amanda Wijayabandara",
                            lastName: "",
                            gender: "FEMALE",
                            dateOfBirth: null,
                            profileImageUrl: "https://amrak-dev-resources.unicloud360.com/pp/dchamidiwijesuriya@gmail.comprofileImg",
                            mobileNumber: "",
                            landNumber: "",
                            nic: "",
                            empNo: "5472",
                            createdAt: null,
                            userStatus: "INACTIVE",
                            schoolList: [],
                            department: {
                                departmentId: 2,
                                departmentName: "Academic Department"
                            },
                            branchList: [],
                            courseList: [],
                            lectureType: "FULL_TIME",
                            lecCostPerHour: null,
                            designation: "Lecturer",
                            passwordExist: false
                        }
                    ]
                    temp.map(user => {
                        const name = `${user.firstName !== null ? user.firstName : ''} ${user.lastName !== null ? user.lastName : ''}`
                        body.push({label: name, value: user.userId, type: user.lectureType, cost: user.lecCostPerHour})
                    })
                // }
        //     }
        // })
    return body
}

export const getAllUpcomingClasses = async (url) => {
    let body = []
    // await classSetupService.getAllUpcomingClasses(url)
    //     .then(res => {
    //         if (res.status === 0) {
                // body = res.body
                body =  {
                    content: [
                        {
                            classDateId: 2028,
                            actualDate: "2023-05-02",
                            className: "FPAMI 01 Theory",
                            moduleId: 164,
                            moduleName: " Foundation Principles and Application of Medical Imaging 1",
                            moduleCode: "HMI102 ",
                            slotId: 2026,
                            slotName: "FPAMI 1 Slot",
                            lectureId: 1,
                            lectureName: "Navishka",
                            venueId: 52,
                            venueName: "Hall 3",
                            classWeekType: "CLASS",
                            availability: true,
                            from: "12:08:00",
                            to: "15:00:00",
                            details: [
                                {
                                    batchId: 161,
                                    batchCode: "52MSJ2023F",
                                    schoolId: 13,
                                    schoolName: "Medical School",
                                    courseId: 77,
                                    courseName: "Medical Science"
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

export const getAllCourseExport = async (name, page, size, dataNeeded) => {
    let body = []
    // await courseService.getAllCourseExport(name, page, size, dataNeeded)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body) {
    //                 body = res.body
                        body =  {
                            content: [
                                {
                                    courseId: 2878,
                                    courseName: "Bio Science ",
                                    courseCode: "BS007",
                                    addedDate: "2023-12-22T11:44:03.488+00:00",
                                    schoolOrDepartment: {
                                        schoolId: 2870,
                                        schoolName: "Nursing school",
                                        courseList: null
                                    },
                                    providerCode: 41,
                                    courseDescription: "ndustry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electr",
                                    qualificationAchieve: "Bsc",
                                    specialization: "Masters",
                                    courseType: null,
                                    programCode: "BCS",
                                    totalCredits: 360,
                                    neededDocument: null,
                                    effectiveModulesCount: 0,
                                    maxElectiveCount: 2,
                                    minElectiveCount: 0,
                                    degreeStatus: null
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
                            last: true,
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
                            numberOfElements: 1,
                            empty: false
                        }
                // }
        //     }
        // })
    return body
}

export const getSelectedCourse = async (data) => {
    let body = null
    // await courseService.getSelectedCourse(data)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body.length !== 0) {
    //                 body = res.body
                    body =  {
                        courseId: 2878,
                        courseName: "Bio Science ",
                        courseCode: "BS",
                        addedDate: "2023-08-22 11:44:03.488",
                        providerCode: 41,
                        courseDescription: "ndustry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electr",
                        qualificationAchieve: "Bsc",
                        specialization: "Masters",
                        courseType: null,
                        programCode: "BCS",
                        totalCredits: 360,
                        neededDocument: null,
                        effectiveModulesCount: 0,
                        gradingSchemeId: 60,
                        maxElectiveCount: 2,
                        minElectiveCount: 0,
                        degreeStatus: null,
                        courseUsed: true
                    }
        //         }
        //     }
        // })
    return body
}

export const createEditCourse = async (data) => {

    const levelList = []
    let totalCredits = 0

    if (data.levelList.length !== 0) {
        data.levelList.map(item => {
            totalCredits += Number(item.min)
            levelList.push({
                cmId: item.cmId,
                levelId: item.level.value,
                minCreditAmount: item.min,
                maxCreditAmount: item.max,
                totalGradeAverage: item.total
            })
        })
    }

    const tempCenter = []
    if (data.center !== null && data.center.length !== 0) {
        data.center.map(item => {
            tempCenter.push(item.value)
        })
    }

    const requiredData = {}
    requiredData.courseId = data.courseId === null ? 0 : data.courseId
    requiredData.courseName = data.courseName
    requiredData.courseCode = data.courseCode
    requiredData.courseDescription = data.description
    requiredData.qualificationAchieve = data.qualification
    requiredData.specialization = data.specialization
    requiredData.schoolId = data.school.value
    requiredData.provideCode = data.providerCode.value.toString()
    requiredData.degreeStatus = data.degreeStatus.value
    requiredData.programCode = data.programCode
    requiredData.courseLevel = levelList
    requiredData.courseCenter = tempCenter
    requiredData.totalCredits = totalCredits
    requiredData.gradingSchemeId = data.gradingSchema.value
    requiredData.maxElectiveCount = Number(data.maxEM)
    requiredData.minElectiveCount = Number(data.minEM)
    // if (accessList.allowStudyMode) requiredData.typeOfCourse = data.courseType.value.trim()

    let body = 1
    await courseService.createEditCourse(requiredData, data.courseId)
        .then(res => {
            if (res !== undefined) {
                if (res.status === 0) {
                    toast.success(data.courseId === null ? "Course added successfully." : "Course details updated successfully", {
                        icon: true,
                        hideProgressBar: true
                    })
                    body = res.status
                }
            }
        })
    return body

}

export const getAllBatches = async (url, classId) => {
    let body = undefined
    // await batchService.getAllBatches(url, classId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
                    body =  {
                        content: [
                            {
                                batchId: 11196,
                                batchCode: "52MSJ2023P(NE)",
                                startDate: "2024-01-10",
                                endDate: "2025-01-01",
                                orientationDate: "2024-01-09",
                                intakeId: 38,
                                intakeCode: "INT2024",
                                feeScheme: 8966,
                                duration: 0,
                                branch: 21,
                                branchName: "Colombo",
                                noOfStudents: 0,
                                batchIndex: null,
                                studentLimit: 100,
                                displayName: "D.physical Science (test)",
                                libraryId: 0,
                                categoryId: 0
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
                        last: true,
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
                        numberOfElements: 1,
                        empty: false
                    }
    //         }
    //     })
    return body
}

export const getNoOfStudentInBatch = async () => {
    let body = undefined
    await studentService.getNoOfStudentsInBatch()
        .then(res => {
            if (res.status === API_RESPONSE_STATUS[0]) {
                body = res.body
            }
        })
    return body
}

export const getSelectedBatch = async (batchId) => {
    let body = undefined
    // await batchService.getSelectedBatch(batchId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
                body = {
                    batchId: 11196,
                    batchCode: "52MSJ2023P(NE)",
                    startDate: "2024-01-10",
                    endDate: "2025-01-01",
                    orientationDate: "2024-01-09",
                    intakeId: 38,
                    intakeCode: "INT2024",
                    feeScheme: 8966,
                    duration: 0,
                    branch: 21,
                    branchName: "Colombo",
                    noOfStudents: 0,
                    batchIndex: null,
                    studentLimit: 100,
                    displayName: "D.physical Science (test)",
                    libraryId: 0,
                    categoryId: 0
                }
        //     }
        // })
    return body
}

export const checkBatchAssignedStatus = async (batchId) => {
    let body = undefined
    await batchService.checkBatchAssignedStatus(batchId)
        .then(res => {
            if (res.status === 0) {
                body = res.body
            }
        })
    return body
}

export const saveBatch = async (data) => {
    let body = undefined
    await batchService.saveBatch(data)
        .then(res => {
            if (res.status === API_RESPONSE_STATUS[0]) {
                body = res
                toast.success(res.message, {icon: true, hideProgressBar: true})
            }
        })
    return body
}

export const getAllModules = async (page, size, dataNeeded, name, type, course) => {

    // const url = `modules?loadAllModule=true&index=${page}&size=${size}&dataNeeded=${dataNeeded}${name === '' ? `` : `&moduleNameOrCode=${name}`}${type === '' ? `` : `&moduleType=${type}`}${course === '' ? `` : `&courseId=${course}`}`
    let body = null
    // await moduleService.getAllModule(url)
    //     .then(res => {
    //         if (res.status === 0) {
    //             body = res.body
                    body =  {
                        content: [
                            {
                                moduleId: 10440,
                                moduleName: "Foundation Principles and Application IV",
                                moduleCode: "FA0078",
                                description: "",
                                weeklyHours: null,
                                noOfCredits: 30,
                                moduleType: "CORE",
                                moduleCategory: "NORMAL",
                                consideringForGpaCalculation: true,
                                assessmentSchemeId: 72,
                                assessmentSchemeCode: "Medical Assesment Scheme",
                                gradingSchemeId: 66,
                                gradingSchemeCode: "Medical Science Module Grading",
                                gradingSchemeDescription: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                                lecturerId: [9560],
                                lecturers: [
                                    {
                                       lecturerId: 9560,
                                       cost: null
                                    }
                                ],
                                levelId: 0,
                                levelName: null,
                                assignStudent: false,
                                moduleUsed: true,
                                gpaCalculate: true
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
                        numberOfElements: 1,
                        empty: false
                    }
    //         }
    //     })
    return body
}

export const getAllCourses = async (data) => {
    let body = []
    // const url = `courses${data !== undefined ? `?userId=${await getCookieUserData().userId}&schoolId=${data}` : ''}`
    // await courseService.getAllCoursesDropdown(url)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body.length !== 0) {
    //                 body = res.body
                    body =  [
                        {
                            courseId: 2878,
                            courseName: "Bio Science ",
                            courseCode: "BS",
                            addedDate: "2023-08-22T11:44:03.488+00:00",
                            providerCode: 41,
                            courseDescription: "ndustry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electr",
                            qualificationAchieve: "Bsc",
                            specialization: "Masters",
                            courseType: null,
                            programCode: "BCS",
                            totalCredits: 360,
                            neededDocument: null,
                            effectiveModulesCount: 0,
                            maxElectiveCount: 2,
                            minElectiveCount: 0,
                            degreeStatus: null
                        }
                    ]
        //         }
        //     }
        // })
    return body
}

export const getSelectedModule = async (data) => {
    let body = null
    // await moduleService.getSelectedModule(data)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body.length !== 0) {
    //                 body = res.body
                    body =  {
                        moduleId: 10440,
                        moduleName: "Foundation Principles and Application IV",
                        moduleCode: "FA556",
                        description: "",
                        weeklyHours: null,
                        noOfCredits: 30,
                        moduleType: "CORE",
                        moduleCategory: "NORMAL",
                        consideringForGpaCalculation: true,
                        assessmentSchemeId: 72,
                        assessmentSchemeCode: "Medical Assesment Scheme",
                        gradingSchemeId: 66,
                        gradingSchemeCode: "Medical Science Module Grading",
                        gradingSchemeDescription: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                        lecturerId: [9560],
                        lecturers: [
                            {
                                lecturerId: 9560,
                                cost: null
                            }
                        ],
                        levelId: 0,
                        levelName: null,
                        assignStudent: false,
                        moduleUsed: true,
                        gpaCalculate: true
                    }
                // }
        //     }
        // })
    return body
}

export const getAllAssessment = async () => {

    const body = []
    // await assessmentService.getAllAssessment()
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body.length !== 0) {
                    const temp =  [
                        {
                            schemeId: 72,
                            schemeCode: "Medical Assesment Scheme",
                            description: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                            gradingSchemeId: 66,
                            schemeTypeList: [
                                {
                                    assessmentTypeId: 73,
                                    configAssessmentTypeId: 42,
                                    configTypeName: "Examination",
                                    percentage: 30.0,
                                    assessmentTypeName: "Exam"
                                },
                                {
                                    assessmentTypeId: 74,
                                    configAssessmentTypeId: 43,
                                    configTypeName: "Individual Viva",
                                    percentage: 30.0,
                                    assessmentTypeName: "Viva"
                                }
                            ]
                        }
                    ]
                    temp.map(assessment => {
                        body.push({
                            value: assessment.schemeId,
                            label: assessment.schemeCode
                        })
                    })
        //         }
        //     }
        // })
    return body
}

export const addEditModule = async (data) => {

    const lecturer = []

    if (data.lecturerList.length !== 0) {
        data.lecturerList.map(item => {
            lecturer.push({lecturerId: item.name.value, cost: item.cost})
        })
    }

    const requestBody = {
        moduleId: data.moduleId,
        moduleName: data.moduleName,
        moduleCode: data.moduleCode,
        description: data.description,
        noOfCredits: data.credits,
        moduleCategory: data.category.value,
        // isGpaCalculate: data.gpaType.value === GPA_TYPE[0].value,
        moduleType: data.moduleType.value,
        // moduleLevelId: data.moduleLevel.value,
        assessmentSchemeId: data.schemeId.value,
        lecturers: lecturer

    }

    let body = 1
    await moduleService.addEditModule(requestBody)
        .then(res => {
            if (res.status === 0) {
                toast.success(data.moduleId === null ? "New module saved successfully." : "Module details updated successfully.", {
                    icon: true,
                    hideProgressBar: true
                })
                body = res.status
            }
        })
    return body
}

export const getAllGradingSchemes = async (type) => {

    const url = type !== undefined ? `schemas?markCalculationType=${type}` : `schemas`

    let body = []
    // await schemeService.getAllGradingSchemes(url)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body.length !== 0) {
    //                 body = res.body
                    body = [
                        {
                            gradingSchemeId: 60,
                            gradingSchemeIdCode: "Medical Science Grading",
                            markCalculation: "GRADING_POINT_AVERAGE",
                            gradingSchemeDecription: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                            previousGradingPercentage: 0.0,
                            totalSubjectCredit: 0,
                            passAllRequired: true,
                            forceMinPassing: false,
                            compensatableFail: false,
                            roundUp: false,
                            moduleId: 0,
                            gradingTable: [
                                {
                                    gradingTableId: 67,
                                    markFrom: "0",
                                    markTo: "30",
                                    grade: "F",
                                    description: "FAIL",
                                    gradePoint: 0.0,
                                    isPass: false
                                },
                                {
                                    gradingTableId: 68,
                                    markFrom: "31",
                                    markTo: "40",
                                    grade: "S",
                                    description: "Simple Pass",
                                    gradePoint: 0.5,
                                    isPass: true
                                },
                                {
                                    gradingTableId: 69,
                                    markFrom: "41",
                                    markTo: "50",
                                    grade: "C",
                                    description: "Credit Pass",
                                    gradePoint: 1.0,
                                    isPass: true
                                },
                                {
                                    gradingTableId: 70,
                                    markFrom: "51",
                                    markTo: "60",
                                    grade: "B",
                                    description: "Good",
                                    gradePoint: 1.5,
                                    isPass: true
                                },
                                {
                                    gradingTableId: 71,
                                    markFrom: "61",
                                    markTo: "100",
                                    grade: "A",
                                    description: "Excellent",
                                    gradePoint: 2.0,
                                    isPass: true
                                }
                            ]
                        }
                    ]
        //         }
        //     }
        // })
    return body
}

export const saveGradingSchemes = async (form, gradingTableData) => {
    const requestBody = gradingSchemesRequestDataObject(form, gradingTableData)

    let body = []
    await schemeService.saveGradingSchemes(requestBody)
        .then(res => {
            if (res.status === 0) {
                toast(<SuccessToast
                    desc={res.message}/>, {
                    icon: false,
                    hideProgressBar: true
                })
                body = res
            }
        })
    return body
}

export const getAllAssessmentSchemes = async () => {
    let body = []
    // await schemeService.getAllAssessmentSchemes()
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body.length !== 0) {
    //                 body = res.body
                    body =  [
                        {
                            schemeId: 72,
                            schemeCode: "Medical Assesment Schme",
                            description: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                            gradingSchemeId: 66,
                            schemeTypeList: [
                                {
                                    assessmentTypeId: 73,
                                    configAssessmentTypeId: 42,
                                    configTypeName: "Examination",
                                    percentage: 30.0,
                                    assessmentTypeName: "Exam"
                                },
                                {
                                    assessmentTypeId: 74,
                                    configAssessmentTypeId: 43,
                                    configTypeName: "Individual Viva",
                                    percentage: 30.0,
                                    assessmentTypeName: "Viva"
                                },
                                {
                                    assessmentTypeId: 75,
                                    configAssessmentTypeId: 44,
                                    configTypeName: "Presentation",
                                    percentage: 30.0,
                                    assessmentTypeName: "Presentation"
                                },
                                {
                                    assessmentTypeId: 76,
                                    configAssessmentTypeId: 45,
                                    configTypeName: "Group Assignment",
                                    percentage: 10.0,
                                    assessmentTypeName: "Group Assignment"
                                }
                            ]
                        }
                    ]
        //         }
        //     }
        // })
    return body
}

export const saveAssessmentSchemes = async (form, tbl) => {
    const requestBody = assessmentSchemesRequestDataObject(form, tbl)

    let body = null
    await schemeService.saveAssessmentSchemes(requestBody)
        .then(res => {
            if (res.status === 0) {
                toast(<SuccessToast
                    desc={res.message}/>, {
                    icon: false,
                    hideProgressBar: true
                })
                body = res
            }
        })
    return body
}

export const getAllAssessmentTypes = async () => {
    let body = []
    // await assessmentService.getAllAssessmentTypes()
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
                body =  [
                    {
                        configAssessmentTypeId: 42,
                        createdDate: "2023-06-27T06:29:25.985+00:00",
                        assessmentTypeName: "Examination",
                        examType: true
                    }
                ]
        //     }
        // })
    return body
}

export const updateAssessmentSchemes = async (id, form, tbl) => {
    const requestBody = assessmentSchemesRequestDataObject(form, tbl)
    requestBody['schemeId'] = id

    let body = null
    await schemeService.saveAssessmentSchemes(requestBody)
        .then(res => {
            if (res.status === 0) {
                toast(<SuccessToast
                    desc={res.message}/>, {
                    icon: false,
                    hideProgressBar: true
                })
                body = res
            }
        })
    return body
}

export const updateGradingSchemes = async (form, gradingTableData) => {
    const requestBody = gradingSchemesRequestDataObject(form, gradingTableData)
    requestBody['gradingSchemeId'] = form.id

    let body = []
    await schemeService.saveGradingSchemes(requestBody)
        .then(res => {
            if (res.status === 0) {
                toast(<SuccessToast
                    desc={res.message}/>, {
                    icon: false,
                    hideProgressBar: true
                })
                body = res
            }
        })
    return body
}

export const checkDuplicateSchemeCode = async (schemeCode) => {
    let body = undefined
    await schemeService.checkSchemeCodeDuplicates(schemeCode)
        .then(res => {
            if (res.status === API_RESPONSE_STATUS[0]) {
                body = res.body
            }
        })
    return body
}

export const getSelectedCourseBatches = async (courseId) => {
    let body = []
    // await batchPlanService.getSelectedCourseBatches(courseId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
                body =  [
                    {
                        batchId: 161,
                        batchCode: "52MSJ2023F",
                        startDate: "2023-06-01",
                        endDate: "2026-06-01",
                        orientationDate: "2023-05-31"
                    }
                ]
        //     }
        // })
    return body
}

export const getAllClassCodes = async () => {
    let body = []
    // await classSetupService.getAllClassCodes()
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
                body = [
                    {
                        classId: 11192,
                        className: "Botny 10",
                        classCode: "Botny 10"
                    }
                ]
        //     }
        // })
    return body
}

export const getAllClasses = async (url) => {
    let body = undefined
    // await classSetupService.getAllClasses(url)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
    console.log("e")
                body = {
                    content: [
                        {
                            classId: 229,
                            className: "FPAMI 01 Theory",
                            classCode: "FPAMI 1",
                            schoolName: "Medical School",
                            moduleName: " Foundation Principles and Application of Medical Imaging 1",
                            moduleCode: "HMI102 ",
                            moduleId: 164,
                            batchCode: ["52MSJ2023F"],
                            courseName: "Medical Science",
                            courseCode: "MS",
                            noOfSlots: 3,
                            lecturers: [
                                {
                                    lecturerId: 1,
                                    lecturerName: "Navishka"
                                }
                            ],
                            from: "2023-06-01",
                            to: "2023-08-31"
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
                    totalElements: 18,
                    totalPages: 2,
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

export const getStudentsForAttendance = async (url) => {
    let body = undefined
    // await classSetupService.getStudentsForAttendance(url)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
    //             body = res.body
                body = {
                    content: [
                        {
                            studentId: 502,
                            studentName: "Prathihari Wijesingha",
                            cbNumber: "CB012402",
                            batchId: 161,
                            batchCode: "52MSJ2023F",
                            courseName: null,
                            courseCode: null,
                            remark: "Remark",
                            attendanceAvg: 0,
                            approvedLeaveAvg: 0,
                            status: 'ABSENT',
                            noOfPresents: 0,
                            noOfAbsent: 0,
                            noOfLateCome: 0
                        },
                        {
                            studentId: 586,
                            studentName: "indika madushan",
                            cbNumber: "CB012403",
                            batchId: 161,
                            batchCode: "52MSJ2023F",
                            courseName: null,
                            courseCode: null,
                            remark: "-",
                            attendanceAvg: 0,
                            approvedLeaveAvg: 0,
                            status: 'PRESENT',
                            noOfPresents: 0,
                            noOfAbsent: 0,
                            noOfLateCome: 0
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
                    totalElements: 2,
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

export const markAllAttendance = async (timelineId, action) => {
    let body = undefined
    await classSetupService.markAllAttendance(timelineId, action)
        .then(res => {
            if (res.status === API_RESPONSE_STATUS[0]) {
                body = res
                toast.success(res.message, {icon: true, hideProgressBar: true})
            }
        })
    return body
}
export const saveAttendance = async (timelineId, data) => {
    let body = undefined
    await classSetupService.saveAttendance(timelineId, data)
        .then(res => {
            if (res.status === API_RESPONSE_STATUS[0]) {
                body = res
                toast.success(res.message, {icon: true, hideProgressBar: true})
            }
        })
    return body
}

export const getAllBanks = async () => {
    let body = []
    // await paymentService.getAllBanks()
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                const temp =  [
                    {
                        id: 498,
                        bankName: "BOC",
                        bankCode: "8765",
                        accountNumber: "011786555573777",
                        branch: "Panadura",
                        swiftCode: "12345",
                        accountType: "LKR",
                        visibility: true
                    }
                ]
                body = temp.map(item => {
                    item['label'] = item.bankName
                    item['value'] = item.id
                    return item
                })
        //     }
        // })
    return body
}

export const getDashboardStats = async (type, userId) => {
    let body = undefined
    // await haaService.getDashboardStats(type, userId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = {
                    pendingProgressionApproval : 0,
                    registeredStudents : 0,
                    specialApprovalRequests : 0
                }
        //     }
        // })
    return body
}

export const getUnassignedCourseSetupModules = async (courseId, levelId) => {
    let body = []
    // await moduleService.getUnassignedCourseSetupModules(courseId, levelId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = [
                    {
                        moduleId: 170,
                        moduleName: "Medical Radiation Science 2",
                        moduleCode: "HMI201",
                        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It h",
                        weeklyHours: null,
                        noOfCredits: 60,
                        moduleType: "CORE",
                        moduleCategory: null,
                        consideringForGpaCalculation: true,
                        assessmentSchemeId: 0,
                        assessmentSchemeCode: null,
                        gradingSchemeId: 0,
                        gradingSchemeCode: null,
                        gradingSchemeDescription: null,
                        lecturerId: [],
                        lecturers: [],
                        levelId: 0,
                        levelName: null,
                        assignStudent: false,
                        moduleUsed: false,
                        gpaCalculate: true
                    }
                ]
        //     }
        // })
    return body
}

export const getUnassignedBatches = async (courseId) => {
    let body = []
    // await batchPlanService.getUnassignedBatches(courseId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = [
                    {
                        batchId: 10923,
                        batchCode: "Ink32",
                        startDate: "2024-01-19",
                        endDate: "2024-01-22",
                        orientationDate: "2024-01-18"
                    },
                    {
                        batchId: 11196,
                        batchCode: "52MSJ2023P(NE)",
                        startDate: "2024-01-10",
                        endDate: "2025-01-01",
                        orientationDate: "2024-01-09"
                    }
                ]
        //     }
        // })
    return body
}

export const getAllModuleClasses = async (moduleId) => {
    let body = []
    // await classSetupService.getAllModuleClasses(moduleId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = [
                    {
                        classId: 552,
                        className: "FPAMI Theory",
                        classCode: "FPAMI",
                        from: "2023-06-01",
                        to: "2023-10-31",
                        batches: [161],
                        autoAdd: true,
                        slotAvailable: true,
                        studentAssigned: true
                    }
                ]
        //     }
        // })
    return body
}

export const getModulesBySemester = async (school, course, lecturerId) => {
    let body = []
    // await moduleService.getModulesBySemester(school, course, lecturerId)
    //     .then(res => {
    //         if (res.status === 0) {
                body = [
                    {
                        moduleId: 162,
                        moduleName: "Foundation Principles and Application of Medical Imaging 2",
                        moduleCode: "HMI104 ",
                        description: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                        noOfCredits: 30,
                        noOfSemesters: 0,
                        module_type: "CORE",
                        moduleCategory: "NORMAL",
                        consideringForGpaCalculation: true
                    },
                    {
                        moduleId: 164,
                        moduleName: " Foundation Principles and Application of Medical Imaging 1",
                        moduleCode: "HMI102 ",
                        description: "rem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
                        noOfCredits: 60,
                        noOfSemesters: 0,
                        module_type: "CORE",
                        moduleCategory: "MULTI_SEMESTER",
                        consideringForGpaCalculation: true
                    }
                ]
        //     }
        // })
    return body
}

export const getAllClassStudents = async (classId, page, studentId, slotId) => {
    let body = []
    // await classSetupService.getAllClassStudents(classId, page, studentId, slotId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = [
                    {
                        studentId: 502,
                        cbNumber: "CB012402",
                        studentName: "Prathihari Wijesingha",
                        courseName: "Medical Science",
                        courseCode: "MS",
                        batchCode: "52MSJ2023F",
                        studentMobile: "+940714094958",
                        studentEmail: "chamidil@ceyentra.com",
                        inquiryId: 450
                    },
                    {
                        studentId: 586,
                        cbNumber: "CB012403",
                        studentName: "indika madushan",
                        courseName: "Medical Science",
                        courseCode: "MS",
                        batchCode: "52MSJ2023F",
                        studentMobile: null,
                        studentEmail: "indikam@ceyentra.com",
                        inquiryId: 559
                    },
                    {
                        studentId: 836,
                        cbNumber: "CB000004",
                        studentName: "prasad wikramage",
                        courseName: "Medical Science",
                        courseCode: "MS",
                        batchCode: "52MSJ2023F",
                        studentMobile: null,
                        studentEmail: "indikamceyentra@gmail.com",
                        inquiryId: 813
                    }
                ]
        //     }
        // })
    return body
}

export const getAllBatches_ = async (url, classId) => {
    let body = undefined
    // await batchService.getAllBatches(url, classId)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = [
                    {
                        batchId: 11196,
                        batchCode: "52MSJ2023P(NE)",
                        startDate: "2024-01-10",
                        endDate: "2025-01-01",
                        orientationDate: "2024-01-09",
                        intakeId: 38,
                        intakeCode: "INT2024",
                        feeScheme: 8966,
                        duration: 0,
                        branch: 21,
                        branchName: "Colombo",
                        noOfStudents: 0,
                        batchIndex: null,
                        studentLimit: 100,
                        displayName: "D.physical Science (test)",
                        libraryId: 0,
                        categoryId: 0
                    }
                ]
        //     }
        // })
    return body
}

export const loadAllClassSlots = async (data) => {
    let body = []
    // await gapService.loadAllClassSlots(data)
    //     .then(res => {
    //         if (res.status === API_RESPONSE_STATUS[0]) {
                body = {
                    noOfStudents: 12,
                    slots: [
                        {
                            slotId: 2026,
                            slotName: "FPAMI 1 Slot",
                            lecturer: "Navishka",
                            venue: "Hall 3",
                            day: "TUESDAY",
                            from: "12:08:00",
                            to: "15:00:00"
                        },
                        {
                            slotId: 3044,
                            slotName: "Slot 2",
                            lecturer: "Navishka",
                            venue: "Hall 1",
                            day: "MONDAY",
                            from: "12:00:00",
                            to: "19:00:00"
                        },
                        {
                            slotId: 3135,
                            slotName: "biology practical",
                            lecturer: "Navishka",
                            venue: "Hall 2",
                            day: "WEDNESDAY",
                            from: "10:00:00",
                            to: "19:04:00"
                        }
                    ]
                }
        //     }
        // })
    return body
}