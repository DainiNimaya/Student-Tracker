import {
    Home,
    CreditCard,
    Sliders,
    Circle,
    MessageSquare,
    Users,
    MessageCircle,
    Clipboard,
    Settings
} from 'react-feather'
import rs from '@routes'
import {accessList} from '@configs/basicInfomationConfig'

const manageRequests = []

manageRequests.push({
    id: 'enrollmentRequests',
    title: 'Enrollment Requests',
    icon: <Circle size={20}/>,
    navLink: rs.enrollmentRequests
})


const navigations = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: <Home size={20}/>,
        navLink: rs.dashboard
    },
    {
        id: 'daily-collection',
        title: 'Manage Collections',
        icon: <Clipboard size={20}/>,
        children: [
            {
                id: 'bank-transfer',
                title: 'Bank Transfers',
                icon: <Circle size={12}/>,
                navLink: rs.bankTransfer
            },
            {
                id: 'pending-collection',
                title: 'Pending Payments',
                icon: <Circle size={20}/>,
                navLink: rs.pendingCollection
            },
            {
                id: 'daily-transactions',
                title: 'Daily Transactions',
                icon: <Circle size={12}/>,
                navLink: rs.dailyTransaction
            }
        ]
    },
    {
        id: 'fee-schemes',
        title: 'Fee Schemes',
        icon: <CreditCard size={20}/>,
        children: [
            {
                id: 'general-fee-schemes',
                title: 'General Fee Schemes',
                icon: <Circle size={12}/>,
                navLink: rs.feeSchemes
            }
        ]
    },
    {
        id: 'manage-requests',
        title: 'Manage Requests',
        icon: <MessageSquare size={20}/>,
        children: manageRequests
    },
    {
        id: 'manageStudentProfiles',
        title: 'Student Profile Manage',
        icon: <Users size={20}/>,
        navLink: rs.manageStudentProfiles
    },
    {
        id: 'configurations',
        title: 'Configurations',
        icon: <Settings size={20}/>,
        children: [
            {
                id: 'bank',
                title: 'Bank Accounts',
                icon: <Circle size={12}/>,
                navLink: rs.banks
            }
        ]
    }
]

export default navigations