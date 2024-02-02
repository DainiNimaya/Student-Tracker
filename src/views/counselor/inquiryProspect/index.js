import {Badge, Card, CardBody, CardHeader, CardTitle} from 'reactstrap'
import {X} from "react-feather"
import React, {useEffect, useState, useRef} from "react"
import config from '@storage'
import GeneralInformation from '@components/inquiry-prospect/generalInformation'
import TabView from '@components/inquiry-prospect'
import {INQUIRY_PROSPECT_ACTIONS} from '@const'
import Cookies from "js-cookie"
import * as Api from "@api/counsellor"
import {accessList} from '@configs/basicInfomationConfig'
import rs from '@routes'

const status = [
    {title: 'Inquiry', value: 'INQUIRY', color: 'light-info'},
    {title: 'Follow Up', value: "FOLLOWUP", color: 'light-success'},
    {title: 'Registration', value: 'REGISTRATION', color: 'light-success'},
    {title: 'Future Intake', value: 'FUTURE_INTAKE', color: 'light-warning'},
    {title: 'UnAssigned', value: 'UNASSIGNED', color: 'light-danger'},
    {title: 'Not Interested', value: 'NOT_INTERESTED', color: 'light-danger'},

    {title: 'Future Intake', value: 'FUTURE_INQUIRY', color: 'light-warning'},
    {title: 'Follow Up', value: 'FOLLOW_UP', color: 'light-success'},
    {title: 'Rejected', value: 'REJECTED', color: 'light-danger'}
]

const subStatus = [
    {title: 'Paid', value: 'PAID', color: 'light-success'},
    {title: 'Course Detail Shared', value: 'COURSE_DETAILS_SHARED', color: 'light-success'},
    {title: 'Registration Link Shared', value: 'REGISTRATION_LINK_SHARED', color: 'light-success'},
    {title: 'Application Submitted', value: 'APPLICATION_SUBMITTED', color: 'light-success'},
    {title: 'Offer Letter Shared', value: 'OFFER_LETTER_SHARED', color: 'light-success'},
    {title: 'Special Approved', value: 'SPECIAL_APPROVED', color: 'light-success'},
    {title: 'Registered', value: 'REGISTERED', color: 'light-success'},
    {title: 'Pending Payment', value: 'PENDING_PAYMENT', color: 'light-warning'},
    {title: 'Pending Enrollment', value: 'PENDING_ENROLLMENT', color: 'light-warning'},
    {title: 'Pending Hos Approval', value: 'PENDING_HOS_APPROVAL', color: 'light-warning'},
    {title: 'Pending HOF Approval', value: 'PENDING_HOF_APPROVAL', color: 'light-warning'},
    {title: 'Pending FM Approval', value: 'PENDING_FM_APPROVAL', color: 'light-warning'},
    {title: 'HOS Approved', value: 'HOS_APPROVED', color: 'light-warning'},
    {title: 'Pending AA Approval', value: 'PENDING_AA_APPROVAL', color: 'light-warning'},
    {title: 'AA Approved', value: 'AA_APPROVED', color: 'light-success'},
    {title: 'HOS Rejected', value: 'HOS_REJECTED', color: 'light-danger'},
    {title: 'HOF Rejected', value: 'HOF_REJECTED', color: 'light-danger'},
    {title: 'FM Rejected', value: 'FM_REJECTED', color: 'light-danger'},
    {title: 'HOS Recommended', value: 'HOS_RECOMMENDED', color: 'light-success'},
    {title: 'HOF Recommended', value: 'HOF_RECOMMENDED', color: 'light-success'},
    {title: 'AA Recommended', value: 'AA_RECOMMENDED', color: 'light-success'},
    {title: 'FM Recommended', value: 'FM_RECOMMENDED', color: 'light-success'},
    {title: 'AA Rejected', value: 'AA_REJECTED', color: 'light-danger'}
]

const App = (props) => {
    const [courseName, setCourseName] = useState('')
    const [inquiryId, setInquiryId] = useState(undefined)
    const [inquiryGI, setInquiryGI] = useState(undefined)
    const gi = useRef()
    const [isInquiry, setIsInquiry] = useState(false)
    const [newInquiry, setNewInquiry] = useState(false)
    const [cbNo, setCbNo] = useState(null)
    const [activeTab, setActiveTab] = useState(null)
    const [isRefreshGeneralInfo, setIsRefreshGeneralInfo] = useState(false)

    const setCourseNameFun = (courseName) => {
        if (courseName) setCourseName(courseName.label)
    }

    useEffect(async () => {
        const routeParam = props.location?.state ?? false
        if (routeParam) {
            await setInquiryId(routeParam.inquiryId)
        }

        setNewInquiry(window.location.pathname === rs.newInquiry)
    }, [])

    const user = JSON.parse(Cookies.get(config.user)).role

    const prop = {...props, user, action: INQUIRY_PROSPECT_ACTIONS[2], inquiryId, inquiryGI, cbNo}

    const clearForm = () => {
        gi.current.clearForm()
    }


    const getSavedChanges = () => {
        const tempId = inquiryId
        setInquiryId(undefined)
        setInquiryId(tempId)
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <div className="d-flex flex-row align-items-center">
                        <CardTitle tag='h4' className='cardTitle-lg'>{
                            props.location?.state?.title ?? "Inquiry Prospect"}</CardTitle>

                        {
                            (inquiryGI && inquiryGI.inquiryStatus !== null) ?
                                <Badge className={'ms-1'}
                                       color={status[status.findIndex(e => e.value === inquiryGI.inquiryStatus)]?.color}
                                       pill>
                                    {status[status.findIndex(e => e.value === inquiryGI.inquiryStatus)]?.title}
                                </Badge> :
                                <Badge className={'ms-1'} color='light-success' pill>
                                    Inquiry
                                </Badge>
                        }
                        {
                            (inquiryGI && inquiryGI?.subStatus !== null && inquiryGI?.inquiryStatus !== "REGISTRATION") &&
                            <Badge className={'ms-1'}
                                   color={subStatus[subStatus.findIndex(e => e.value === inquiryGI?.subStatus)]?.color}
                                   pill>
                                {subStatus[subStatus.findIndex(e => e.value === inquiryGI?.subStatus)]?.title}
                            </Badge>
                        }
                    </div>

                    <X size={20} onClick={() => props.history.goBack()} className="cursor-pointer"/>
                </CardHeader>
                <CardBody>
                    <GeneralInformation
                        ref={gi}
                        selectedCourse={setCourseNameFun}
                        props={
                            {
                                ...props,
                                user,
                                setInquiryId: id => setInquiryId(id),
                                setInquiryGI: async (data) => {
                                    await setInquiryGI(data)
                                }
                            }}
                        setIsInquiryType={setIsInquiry}
                        isCBSearch={newInquiry}
                        setCBNo={setCbNo}
                        saveChanges={getSavedChanges}
                        refreshState={isRefreshGeneralInfo}
                        refresh={setIsRefreshGeneralInfo}
                    />
                </CardBody>
            </Card>
        </div>
    )
}

export default App
