import React, {useEffect, useState, Fragment} from 'react'
import {Col, Row} from "reactstrap"
import CardCongratulations from '@components/dashboard/CardCongratulations'
import StatsCard from '@components/dashboard/StatsCard'
import {useRTL} from '@hooks/useRTL'
import {Clipboard, Clock, DollarSign, Info, List, MessageCircle, UserCheck} from "react-feather"
import * as Api from "@api/counselor_"
import * as ApiFE from "@api/fe_"
import * as ApiStudent from "@api/student"
import * as ApiLecturer from "@api/lecturer_"
import * as ApiHaa from "@api/haa_"
import {getCookieUserData} from '@utils'
import config from '@storage'
import Cookies from "js-cookie"
import rs from '@routes'
import './dashboard.scss'
import {KOHA_STATUS} from "@const"
import ABC from './ClassER'
import ABC1 from './FM_Chart2'
import ABC2 from './AA_chart1'
import ABC3 from './AA_chart2'
import ABC4 from './SC_chart1'
import ABC5 from './SC_Chart2'
import ABC6 from './L_chart1'
import ABC7 from './L_chart2'
import {accessList, quickAction, moodleAccessRole, office365AccessRole, externalInquiryAccessRole, libraryAccessRole} from '@configs/basicInfomationConfig'

const App = (props) => {
    if (!localStorage.getItem("skin")) {
        localStorage.setItem("skin", '"light"')
    }

    const role = Cookies.get(config.role)
    const [stats, setStats] = useState({
        registeredStudentsPast7Days: 0,
        inquiries: 0,
        followups: 0,
        registeredStudents: 0,
        pendingInquiries: 0,
        enrolledStudents: 0,
        pendingEnrollments: 0,
        collectionDues: 0,
        totalEmployees: 0,
        totalStudents: 0,
        nextSubmission: "N/A",
        upcomingAssessments: 0,
        nextPaymentDate: "N/A",
        totalClasses: 0,
        noOfHours: 0,
        submissionDeadlines: 0,
        specialApprovalInquiries: 0,
        pendingRepeatStudents: 0,
        classes: 0,
        activeStudents: 0,
        activeEmployees: 0
    })
    const [restrict, setRestrict] = useState(KOHA_STATUS.active)

    useEffect(async () => {
        await loadStats('DAY')

    }, [])

    const loadStats = async (type) => {
        const userId = await getCookieUserData().userId
        let res

        switch (role) {
            case config.hocRole:
                res = await Api.getDashboardStats(type, userId)
                break
            case config.hofRole:
                res = await ApiFE.getDashboardStats(type, userId)
                break
            case config.studentRole:
                const user = JSON.parse(Cookies.get(config.user))
                const data = {studentId: user.studentId, studentName: user.firstName, cbNumber: user.cbNumber}
                sessionStorage.setItem('STUDENT_DETAILS', JSON.stringify(data))
                res = await ApiStudent.getDashboardStats(type, userId)

                break
            case config.hosRole:
                res = await ApiLecturer.getDashboardStats(type, userId)
                break
            case config.haaRole:
                res = await ApiHaa.getDashboardStats(type, userId)
                break
        }

        if (res) {
            setStats({...res})
        }
    }

    const getStats = () => {
        switch (role) {
            case config.hocRole:
                return [
                    {
                        title: stats.inquiries,
                        subtitle: 'Inquiries',
                        color: 'light-primary',
                        icon: <MessageCircle size={24}/>,
                        url: rs.allInquiries
                    },
                    {
                        title: stats.followups,
                        subtitle: 'Followups',
                        color: 'light-info',
                        icon: <List size={24}/>,
                        url: rs.allFollowUps
                    },
                    {
                        title: stats.registeredStudents,
                        subtitle: 'Registrations',
                        color: 'light-danger',
                        icon: <UserCheck size={24}/>,
                        url: rs.manageStudentProfiles
                    }
                ]
            case config.hofRole:
                return [
                    {
                        title: stats.pendingEnrollments,
                        subtitle: 'Pending Enrollments',
                        color: 'light-primary',
                        icon: <MessageCircle size={24}/>,
                        url: rs.enrollmentRequests
                    },
                    {
                        title: stats.enrolledStudents,
                        subtitle: 'Registered Students',
                        color: 'light-info',
                        icon: <UserCheck size={24}/>,
                        url: rs.manageStudentProfiles
                    },
                    {
                        title: stats.collectionDues,
                        subtitle: 'Due Payments',
                        color: 'light-danger',
                        icon: <List size={24}/>,
                        url: rs.pendingCollection
                    }
                ]
            case config.studentRole:
                return [
                    {
                        title: stats.nextSubmission,
                        subtitle: 'Next Submission',
                        color: 'light-danger',
                        icon: <Clock size={24}/>,
                        url: rs.manageProjectView
                    },
                    {
                        title: stats.upcomingAssessments,
                        subtitle: 'Upcoming Assessments',
                        color: 'light-info',
                        icon: <List size={24}/>,
                        url: rs.assessmentTimeTableView
                    },
                    {
                        title: stats.nextPaymentDate ? stats.nextPaymentDate : 'N/A',
                        subtitle: 'Next Payment Date',
                        color: 'light-success',
                        icon: <DollarSign size={24}/>,
                        url: rs.myFinances
                    }
                ]
            case config.haaRole:
                return [
                    {
                        title: stats.registeredStudents,
                        subtitle: 'Registered Students',
                        color: 'light-primary',
                        icon: <MessageCircle size={24}/>,
                        url: rs.manageStudentProfiles
                    },
                    {
                        title: stats.specialApprovalRequests,
                        subtitle: 'No. of Lecturers',
                        color: 'light-info',
                        icon: <Clipboard size={24}/>,
                        url: rs.recommendationSpecialApproval
                    },
                    {
                        title: stats.pendingProgressionApproval,
                        subtitle: 'Ongoing Batches',
                        color: 'light-danger',
                        icon: <UserCheck size={24}/>,
                        url: rs.progressionApproval
                    }
                ]
            case config.hosRole:
                return [
                    {
                        title: stats.totalClasses,
                        subtitle: 'Classes',
                        color: 'light-info',
                        icon: <Clipboard size={24}/>,
                        url: rs.schedules
                    },
                    {
                        title: stats.noOfHours,
                        subtitle: 'No. of Hours',
                        color: 'light-primary',
                        icon: <Clock size={24}/>,
                        url: rs.lecturerTimeTable
                    },
                    {
                        title: stats.submissionDeadlines,
                        subtitle: 'Submission Deadline',
                        color: 'light-danger',
                        icon: <Info size={24}/>,
                        url: rs.assessmentTimeTable
                    }
                ]
        }
    }

    return (
        <div id='dashboard-analytics'>
            <Row className='match-height'>
                <Col lg='4' sm='12'>
                    <CardCongratulations kohaState={restrict} count={stats.registeredStudentsPast7Days}/>
                </Col>
                <Col lg={8} xs='12'>
                    <StatsCard
                        cols={{lg:'4', sm: '6'}}
                        data={getStats()}
                        loadStats={loadStats}
                        props={props}
                    />
                </Col>
                <Col lg='6' xs='12' style={{height: 'fit-content'}}>
                    {
                        role === config.hofRole ? <ABC/> :
                            role === config.haaRole ? <ABC2/> :
                                role === config.hocRole ? <ABC4/> : <ABC6/>

                    }

                </Col>
                <Col lg='6' xs='12' style={{height: 'fit-content'}}>
                    {
                        role === config.hofRole ? <ABC1/> :
                            role === config.haaRole ? <ABC3/> :
                                role === config.hocRole ? <ABC5/> : <ABC7/>

                    }
                </Col>
            </Row>
        </div>
    )
}

export default App
