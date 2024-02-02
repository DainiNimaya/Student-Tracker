import {
    Home,
    Circle,
    FileText,
    Layers,
    Sliders,
    Layout,
    LogIn,
    Folder,
    BookOpen,
    Target,
    Calendar,
    Users,
    UserCheck,
    Book,
    Award,
    Settings,
    Clock,
    TrendingUp, GitPullRequest
} from 'react-feather'
import rs from '@routes'
import {accessList} from '@configs/basicInfomationConfig'

const manageStudents = [
    {
        id: 'studentMasterProfile',
        title: 'Student Master Profile',
        icon: <Circle size={12}/>,
        navLink: rs.manageStudentProfiles
    }
]

const navigations = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <Home size={20}/>,
        navLink: rs.dashboard
    },
    {
        id: 'timeTable',
        title: 'Timetable',
        icon: <Calendar size={20}/>,
        children: [
            {
                id: 'general-time-table',
                title: 'General Timetable',
                icon: <Circle size={12}/>,
                navLink: rs.generalTimeTable
            }
        ]
    },
    {
        id: 'components',
        title: 'Components',
        icon: <Home size={20}/>,
        children: [
            {
                id: 'programmes',
                title: 'Programmes',
                //icon: <Layers size={20}/>,
                icon: <Circle size={12}/>,
                navLink: rs.haaProgramme
            },
            {
                id: 'courses',
                title: 'Courses',
                //icon: <Folder size={20}/>,
                icon: <Circle size={12}/>,
                navLink: rs.haaCourses
            },
            {
                id: 'batches',
                title: 'Batches',
                //icon: <LogIn size={20}/>,
                icon: <Circle size={12}/>,
                navLink: rs.haaBatch
            },
            {
                id: 'modules',
                title: 'Modules',
                //icon: <BookOpen size={20}/>,
                icon: <Circle size={12}/>,
                navLink: rs.haaModules
            }
        ]
    },
    {
        id: 'scheme',
        title: 'Manage Scheme',
        icon: <Layout size={20}/>,
        children: [
            {
                id: 'grading',
                title: 'Grading Scheme',
                icon: <Circle size={12}/>,
                navLink: rs.grading
            }, {
                id: 'assessment',
                title: 'Assessment Scheme',
                icon: <Circle size={12}/>,
                navLink: rs.assessment
            }
        ]
    },
    {
        id: 'setup',
        title: 'Manage Setups',
        icon: <Sliders size={20}/>,
        children: [
            {
                id: 'course-setup',
                title: 'Course Setup',
                icon: <Circle size={12}/>,
                navLink: rs.courseSetup
            },
            {
                id: 'batch-setup',
                title: 'Batch Plan',
                icon: <Circle size={12}/>,
                navLink: rs.batchSetup
            },
            {
                id: 'class-setup',
                title: 'Class Setup',
                icon: <Circle size={12}/>,
                navLink: rs.classSetup
            }
        ]
    },
    {
        id: 'manageClasses',
        title: 'Manage Classes',
        icon: <Users size={20}/>,
        children: [
            {
                id: 'class-schedule',
                title: 'Class Schedule',
                icon: <Circle size={12}/>,
                navLink: rs.classSchedule
            }
        ]
    },
    {
        id: 'assessments',
        title: 'Manage Assessments',
        icon: <Book size={20}/>,
        children: [
            {
                id: 'assessments-setup',
                title: 'Assignment',
                icon: <Circle size={20}/>,
                navLink: rs.assessments
            }
        ]
    },
    {
        id: 'allStudentsMarking',
        title: 'Markings',
        icon: <Award size={20}/>,
        children: [
            {
                id: 'all-students-marks',
                title: 'All Students Marks',
                icon: <Circle size={12}/>,
                navLink: rs.allStudentMarking
            }
        ]
    },
    {
        id: 'manageAttendance',
        title: 'Manage Attendance',
        icon: <UserCheck size={20}/>,
        children: [
            {
                id: 'attendance',
                title: 'Attendance',
                icon: <Circle size={12}/>,
                navLink: rs.attendance
            }
        ]
    },
    {
        id: 'manageStudent',
        title: 'Manage Student',
        icon: <Users size={20}/>,
        children: manageStudents
    },
    {
        id: 'configurations',
        title: 'Configurations',
        icon: <Settings size={20}/>,
        children: [
            {
                id: 'intake',
                title: 'Intake',
                icon: <Circle size={12}/>,
                navLink: rs.intake
            },
            {
                id: 'assessmentType',
                title: 'Assessment Type',
                icon: <Circle size={12}/>,
                navLink: rs.assessmentType
            }
        ]
    }

]

export default navigations