import {lazy} from 'react'
import rs from '@routes'
import {accessList} from '@configs/basicInfomationConfig'

const DefaultRoutes = rs.login

// ** Merge Routes
const Common = [
    {
        path: rs.login,
        component: lazy(() => import('../../views/Login')),
        layout: 'BlankLayout',
        meta: {authRoute: true}
    },
    {
        path: rs.resetPassword,
        component: lazy(() => import('../../views/login/resetPassword')),
        layout: 'BlankLayout',
        meta: {authRoute: true}
    },
    {path: rs.dashboard, component: lazy(() => import('../../@core/components/dashboard'))},
    {path: rs.error, component: lazy(() => import('../../views/Error')), layout: 'BlankLayout'},
    {path: rs.studentOnboard, component: lazy(() => import('../../views/student/onBoard/index')), meta: {authRoute: true}},
    {path: rs.studentOnboardMyFinance, component: lazy(() => import('../../views/student/myFinances')), meta: {authRoute: true}},
    {path: rs.manageProfile, component: lazy(() => import('../../views/common/manageProfile'))},
    {path: rs.manageStudentProfiles, component: lazy(() => import('../../views/common/studentMasterProfile'))},
    {
        path: rs.studentProfileView,
        component: lazy(() => import('../../views/common/studentMasterProfile/studentProfileView'))
    },
    {path: rs.generalTimeTable, component: lazy(() => import('../../@core/components/generalTimeTable/Calendar'))}
]

export {DefaultRoutes, Common}
