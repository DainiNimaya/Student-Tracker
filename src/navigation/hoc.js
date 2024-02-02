import {
    Home,
    Circle,
    MessageCircle,
    CheckSquare,
    Briefcase,
    UserCheck,
    Users,
    Settings,
    Calendar,
    Award
} from 'react-feather'
import rs from '@routes'
import React from "react"
import {accessList} from '@configs/basicInfomationConfig'

const navigations = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <Home size={20}/>,
        navLink: rs.dashboard
    },
    {
        id: 'inquiries',
        title: 'Inquiries',
        icon: <MessageCircle size={20}/>,
        children: [
            {
                id: 'newInquiries',
                title: 'New Inquiries',
                icon: <Circle size={12}/>,
                navLink: rs.newInquiry
            },
            {
                id: 'allInquiries',
                title: 'All Inquiries',
                icon: <Circle size={12}/>,
                navLink: rs.allInquiries
            }
        ]
    },
    {
        id: 'registrations',
        title: 'Registrations',
        icon: <UserCheck size={20}/>,
        navLink: rs.registrations
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
    }
]


export default navigations