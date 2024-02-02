import {lazy} from 'react'
import rs from '@routes'
import {accessList} from '@configs/basicInfomationConfig'

// ** Default Route
const DefaultRouteHAA = rs.dashboard


// ** Merge Routes
const RoutesHAA = [
    {path: rs.haaProgramme, component: lazy(() => import('../../views/headOfAcademicAdmin/programme'))},
    {path: rs.haaCourses, component: lazy(() => import('../../views/headOfAcademicAdmin/courses'))},
    {path: rs.haaModules, component: lazy(() => import('../../views/headOfAcademicAdmin/modules'))},
    {path: rs.haaBatch, component: lazy(() => import('../../views/headOfAcademicAdmin/batch'))},
    {
        path: rs.courseSetup,
        component: lazy(() => import('../../views/headOfAcademicAdmin/setup/courseSetup/courseSetup'))
    },
    {path: rs.batchSetup, component: lazy(() => import('../../views/headOfAcademicAdmin/setup/batchPlan'))},
    {path: rs.grading, component: lazy(() => import('../../views/headOfAcademicAdmin/scheme/grading'))},
    {path: rs.assessment, component: lazy(() => import('../../views/headOfAcademicAdmin/scheme/assessment'))},
    {path: rs.lecturerAllocation, component: lazy(() => import('../../views/headOfAcademicAdmin/lecturerAllocation'))},
    {
        path: rs.lecturerViewInfo,
        component: lazy(() => import('../../@core/components/lecturerAllocation/viewInformation'))
    },
    {path: rs.classSetup, component: lazy(() => import('../../views/headOfAcademicAdmin/setup/classSetup'))},
    {path: rs.classSchedule, component: lazy(() => import('../../views/headOfAcademicAdmin/setup/classSchedule'))},
    {path: rs.classSummary, component: lazy(() => import('../../views/headOfAcademicAdmin/setup/classSummary'))},
    {
        path: rs.classSummaryInfo,
        component: lazy(() => import('../../views/headOfAcademicAdmin/setup/classSummary/classSummaryInfo'))
    },
    {path: rs.viewStudents, component: lazy(() => import('../../@core/components/viewStudent/index'))},
    {path: rs.attendance, exact: true, component: lazy(() => import('../../@core/components/attendance'))},
    {path: rs.markAttendance, component: lazy(() => import('../../@core/components/attendance/markAttendance'))},
    {path: rs.attendanceSummary, component: lazy(() => import('../../@core/components/attendance/attendanceSummary'))},
    {
        path: rs.attendanceSummaryStudent,
        component: lazy(() => import('../../@core/components/attendance/summaryStudent'))
    },
    {path: rs.assessments, component: lazy(() => import('../../@core/components/markings'))},
    {path: rs.markings, component: lazy(() => import('../../@core/components/markings'))},
    {
        path: rs.assessmentsMarkingSheet,
        component: lazy(() => import('../../@core/components/markings/assessmentsMarkingSheet'))
    },
    {path: rs.allStudentMarking, component: lazy(() => import('../../views/headOfAcademicAdmin/marking'))},
    {path: rs.studentsMarking, component: lazy(() => import('../../views/headOfAcademicAdmin/marking/viewMarking'))},
    {path: rs.intake, component: lazy(() => import('../../views/headOfAcademicAdmin/configuration/intake'))},
    {
        path: rs.assessmentType,
        component: lazy(() => import('../../views/headOfAcademicAdmin/configuration/assessmentType'))
    },
    {
        path: rs.viewExamVenueStudents,
        component: lazy(() => import('../../views/headOfAcademicAdmin/examSchedule/viewStudents'))
    },
    {
        path: rs.assessmentTimeTable,
        exact: true,
        component: lazy(() => import('../../@core/components/assessmentTimeTable'))
    },
    {
        path: rs.assessmentTimeTableView,
        component: lazy(() => import('../../@core/components/assessmentTimeTable/assessment'))
    },
    {
        path: rs.userCreate, component: lazy(() => import('../../views/headOfAcademicAdmin/manageEmployees/userCreate'))
    },
    {
        path: rs.userEdit, component: lazy(() => import('../../views/headOfAcademicAdmin/manageEmployees/userCreate'))
    },
    {
        path: rs.employeeInformation,
        component: lazy(() => import('../../views/headOfAcademicAdmin/manageEmployees/employeeInformation'))
    }
]


export {DefaultRouteHAA, RoutesHAA}
