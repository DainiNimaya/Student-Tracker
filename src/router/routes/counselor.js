import {lazy} from 'react'
import rs from '@routes'
import {accessList} from '@configs/basicInfomationConfig'

// ** Default Route
const DefaultRouteHeadOfCounselor = rs.dashboard

// ** Merge Routes
const RoutesHeadOfCounselor = [
    {
        path: rs.allInquiries, component: lazy(() => import('../../views/counselor/inquiries/allInquiries'))
    },
    {
        path: rs.newInquiry, component: lazy(() => import('../../views/counselor/inquiryProspect'))
    },
    {
        path: rs.inquiriesProspect, component: lazy(() => import('../../views/counselor/inquiryProspect'))
    },
    {
        path: rs.registrations,
        component: lazy(() => import('../../views/counselor/registration/registration'))
    }
]


export {DefaultRouteHeadOfCounselor, RoutesHeadOfCounselor}
