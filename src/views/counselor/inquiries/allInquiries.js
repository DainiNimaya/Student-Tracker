import React, {Component, Fragment} from "react"
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Row, UncontrolledTooltip} from "reactstrap"
import {ChevronDown, Eye, Plus, Upload} from "react-feather"
import DataTable from 'react-data-table-component'
import {errorMessage, inquiries} from '@strings'
import './scss/_allInquiries.scss'
import {findObject, getCookieUserData, getFirstTwoLetter} from '@utils'
import {
    ALL_INQUIRIES_CSV_HEADER,
    COLOR_STATUS,
    FILTER_TYPES,
    FILTERS,
    INQUIRY_PROSPECT_ACTIONS,
    INQUIRY_TYPES,
    // MARKETING_CODES,
    DATE_FORMAT,
    INQUIRY_STATUS,
    NOTIFY_TO_HOC_STATUS
} from '@const'
import Avatar from '@components/avatar'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {ALL_INQUIRE_TABLE_COLUMN} from './tableData'
import rs from '@routes'
import * as Api from "@api/counsellor"
import CustomPagination from "@components/customPagination"
import moment from 'moment'
import {toast} from "react-toastify"
import {CommonToast} from "@toast"
import {capitalize} from "@commonFunc"
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import Filter from "@components/filter"
import ExportMenu from '@components/export-menu'
import DuplicateDetailsExpand from "@components/duplicate-details-expand"
import Cookies from "js-cookie"
import config from '@storage'

class AllInquiries extends Component {
    csvLinkEl = React.createRef();

    state = {
        data: [],
        marketingCodes: [],
        counselors: [],
        inquiryTypes: [],
        intakes: [],
        courses: [],
        exportData: [],
        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0,
        userId: getCookieUserData().userId,
        intake: '',
        role: JSON.parse(Cookies.get(config.user)).role
    }

    onFilterHandler = async (data) => {
        await this.setState({currentPage: 0})
        await this.props.dispatch(handleFilter({...data, route: rs.allInquiries}))
        await this.loadAllInquiries()
    }

    async componentWillMount() {
        await this.loadAllIntakes()
        await this.loadAllCounselors()
        await this.loadAllCourses()
        await this.loadAllInquiryType()
        await this.loadAllMarketingCodes()
        await this.loadAllInquiries()
    }

    loadAllInquiryType = async () => {
        const data = [{value: null, label: 'All'}]
        INQUIRY_TYPES.map(item => {
            data.push(item)
        })
        await this.setState({inquiryTypes: data})
    }

    loadAllMarketingCodes = async () => {
        const data = [{value: null, label: 'All'}]
        // MARKETING_CODES.map(item => {
        //     data.push(item)
        // })
        await this.setState({marketingCodes: data})
    }

    loadAllCourses = async () => {
        const url = `courses/restriction?userId=${this.state.userId}`
        const res = await Api.getAllCourses(url)
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push({value: item.courseId, label: item.courseName})
        })
        await this.setState({courses: data})
    }

    loadAllIntakes = async () => {
        const res = await Api.getAllIntakes()
        const data = [{value: null, label: 'All'}]
        let ongoing = null
        res.map(item => {
            if (item.ongoing) ongoing = {value: item.intakeId, label: item.intakeCode}
            data.push({value: item.intakeId, label: item.intakeCode})
        })
        await this.setState({intakes: data, intake: ongoing})
    }

    loadAllCounselors = async () => {
        const res = await Api.getAllCounselors(this.state.userId)
        const data = [{value: null, label: 'All'}]
        res.map(item => {
            data.push(item)
        })
        if (this.props.filter.route === undefined) {
            this.props.dispatch(handleFilter({
                ...FILTERS,
                counselor: await findObject(data, await getCookieUserData().userId),
                intake: this.state.intake,
                route: rs.allInquiries
            }))
        } else if (this.props.filter.route !== rs.allInquiries) {
            this.props.dispatch(handleFilter({
                ...FILTERS,
                counselor: await findObject(data, await getCookieUserData().userId),
                intake: this.state.intake,
                route: rs.allInquiries
            }))
        }
        await this.setState({counselors: data})
    }

    exportData = async (type, size, page, isGetPages) => {
        const res = await Api.getInquiryExportData({
            ...this.bodyData(true),
            pagination: {
                index: page !== undefined ? page : this.state.currentPage,
                size: size ? size : 10
            },
            dataNeeded: !isGetPages
        })
        if (res?.content && res?.content.length > 0) {
            await this.setState({exportData: res.content})
            // this.csvLinkEl.current.link.click()
        }
        return res
    }

    bodyData = (isExport) => {
        const filter = this.props.filter
        const data = {
            name: filter.studentName ? filter.studentName.trim() : null,
            counselorId: filter.counselor ? filter.counselor.value : null,
            courseId: filter.course ? filter.course.value : null,
            intakeId: filter.intake ? filter.intake.value : null,
            inquiryType: filter.inquiryType ? filter.inquiryType.value : null,
            startDate: filter.dateRange ? moment(filter.dateRange[0]).format(DATE_FORMAT) : null,
            endDate: filter.dateRange ? moment(filter.dateRange[1]).format(DATE_FORMAT) : null,
            marketingCode: filter.marketingCode ? filter.marketingCode.value : null,
            action: 'ALL',
            inquiryStatus: filter.status ? filter.status.value : null,
            offerLetterNotifyStatus : filter.offerLetterNotifyStatus ? filter.offerLetterNotifyStatus.value : null,
            nicPassport: filter.nicPp ? filter.nicPp.trim() : null,
            contact: filter.contact ? filter.contact : null,
            inquiryNo: filter.inquiryNo ? filter.inquiryNo.trim() : null,
            restrictUserId: getCookieUserData().userId,
            dataNeeded : true

        }
        if (!isExport) {
            data['dataNeeded'] = true
            data['pagination'] = {
                index: this.state.currentPage,
                size: 10
            }
        }
        return data
    }

    loadAllInquiries = async () => {
        const data = {...await this.bodyData(), dataNeeded: true}
        const res = await Api.getAllInquiries(data)
        this.setState({
            ...this.state,
            data: res.content,
            numberOfElements: res.numberOfElements,
            totalElements: res.totalElements,
            totalPages: res.totalPages,
            offset: res.pageable.offset,
            pageSize: res.pageable.pageSize
        })
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.loadAllInquiries()
    }

    navigateToInquiryProspect = (item) => {
        this.props.history.push(item ? rs.inquiriesProspect : rs.newInquiry,
            {action: INQUIRY_PROSPECT_ACTIONS[item ? 2 : 0], inquiryId: item?.inquiryId ?? undefined})
    }


    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state

        const filterArray = [
            {
                type: FILTER_TYPES.input,
                name: 'inquiryNo',
                label: 'Inquiry Number',
                placeholder: 'Search by Inquiry Number',
                value: this.props.filter.inquiryNo
            },
            {
                type: FILTER_TYPES.input,
                name: 'studentName',
                label: 'Student Name',
                placeholder: 'Search by Student Name',
                value: this.props.filter.studentName
            },
            {
                type: FILTER_TYPES.input,
                name: 'nicPp',
                label: 'NIC / PP',
                placeholder: 'Search by NIC / PP',
                value: this.props.filter.nicPp
            },
            {
                type: FILTER_TYPES.number,
                name: 'contact',
                label: 'Contact Number',
                placeholder: 'Search by Contact Number',
                value: this.props.filter.contactNo
            },
            {
                type: FILTER_TYPES.dropDown,
                name: 'counselor',
                label: "Counsellor",
                placeholder: 'All',
                options: this.state.counselors,
                value: this.props.filter && this.props.filter.counselor ? this.props.filter.counselor : findObject(this.state.counselors, getCookieUserData().userId)
                // default: this.props.filter.counselor
            },
            {
                type: FILTER_TYPES.dropDown,
                name: 'course',
                label: "Course",
                placeholder: 'All',
                options: this.state.courses,
                value: this.props.filter.course
            },
            {
                type: FILTER_TYPES.dropDown,
                name: 'intake',
                label: inquiries.intake,
                placeholder: 'All',
                options: this.state.intakes,
                value: this.props.filter && this.props.filter.intake ? this.props.filter.intake : this.state.intake
                // default: this.props.filter.intake
            },
            {
                type: FILTER_TYPES.dropDown,
                name: 'status',
                label: 'Status',
                placeholder: 'All',
                options: INQUIRY_STATUS,
                value: this.props.filter.status
            }

        ]


        const allData = []
        let count = 0
        this.state.data.map(async (item, i) => {
            const isDuplicated = (item.duplicateDetails && item.duplicateDetails.length > 0)

            let nameCount = 0
            let contactCount = 0
            let emailCount = 0
            item.duplicateDetails && item.duplicateDetails.map(dup => {
                if (item.studentName === dup.studentName) nameCount = nameCount + 1
                if (item.studentMobile === dup.contactNo) contactCount = contactCount + 1
                if (item.studentEmail === dup.email) emailCount = emailCount + 1
            })

            allData.push({
                id: <span key={i} className={'item-id'}
                          onClick={() => this.navigateToInquiryProspect(item)}>{item.inquiryNumber ? item.inquiryNumber : '-'}</span>,
                name: <div key={i}>

                    <div className={'name-container'}>
                        <Avatar className={'avatar'} color={`light-${COLOR_STATUS[count]}`}
                                content={item.studentName ? getFirstTwoLetter(item.studentName) : ''}
                                initials/>

                        <div className={'item-name'}>
                        <span id={`name${i}`}>{item.studentName}
                            {
                                isDuplicated && <sup
                                    className={'contact-duplicate'}>{nameCount > 0 && nameCount}</sup>
                            }
                    </span>
                        </div>

                        {
                            isDuplicated && <UncontrolledTooltip placement='right' target={`name${i}`}>
                                Duplicated
                            </UncontrolledTooltip>
                        }
                    </div>
                </div>,
                contact: <div key={i}>
                    {
                        item.studentMobile ? <>
                            <div id={`positionRight${i}`} className={'item-contact'}>{item.studentMobile}
                                {
                                    isDuplicated && <sup
                                        className={'contact-duplicate'}>{contactCount > 0 && contactCount}</sup>
                                }
                            </div>
                            {
                                isDuplicated && <UncontrolledTooltip placement='right' target={`positionRight${i}`}>
                                    Duplicated
                                </UncontrolledTooltip>
                            }
                        </> : '-'
                    }
                    {
                        item.studentEmail ? <div style={{display: 'flex'}}>
                            <div id={`email${i}`} className={'item-email'}>{item.studentEmail}</div>
                            {
                                isDuplicated &&
                                <sup className={'duplicate'}>{emailCount > 0 && emailCount}</sup>
                            }
                            {isDuplicated && <UncontrolledTooltip placement='right' target={`email${i}`}>
                                Duplicated
                            </UncontrolledTooltip>}
                        </div> : null
                    }
                </div>,
                contactNumber: item.studentMobile,
                studentEmail: item.studentEmail,
                inquiryType: item.inquiryType && true ? capitalize(item.inquiryType.replaceAll('_', ' ').toLowerCase()) : "N/A",
                inquiryDate: item.requestedDate ? moment(item.requestedDate).format('D/M/YYYY') : 'N/A',
                counselor: item.counselor && item.counselor.firstName,
                course: item.course ? item.course.courseName : 'N/A',
                // marketingCode: findObject(MARKETING_CODES, item.marketingCode),
                intake: item.intake ? item.intake.intakeCode : 'N/A',
                duplicateDetails: item.duplicateDetails,
                studentName: item.studentName,
                cbinqno: item.cbinqno,
                status: item.inquiryStatus ? capitalize(item.inquiryStatus.replaceAll('_', ' ').toLowerCase()) : 'N/A',
                actions: <Button key={i} onClick={() => this.navigateToInquiryProspect(item)}
                                 className={'top-custom-btn'}
                                 color='primary' outline>
                    <Eye size={15}/>
                    <span className='m-md-1 align-middle ml-50'>View</span>
                </Button>
            })
            count > 6 ? count = 0 : count += 1
        })


        return (<Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>{inquiries.allInquiries}</CardTitle>
                </CardHeader>
                <CardBody>
                    {
                        this.state.intake !== '' && this.state.counselors.length !== 0 && <Filter
                            list={filterArray}
                            onFilter={this.onFilterHandler}
                        />
                    }
                </CardBody>
                <div className='react-dataTable'>
                    <DataTable
                        noHeader
                        pagination
                        data={allData}
                        expandableRows={false}
                        columns={ALL_INQUIRE_TABLE_COLUMN}
                        expandOnRowClicked
                        customStyles={{rows: {style: {alignItems: 'center'}}}}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10}/>}
                        paginationDefaultPage={this.state.currentPage + 1}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        paginationComponent={() => CustomPagination({
                            currentPage,
                            numberOfElements,
                            totalElements,
                            totalPages,
                            offset,
                            handlePagination: page => this.handlePagination(page)
                        })}
                    />
                </div>
            </Card>
        </Fragment>)
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(AllInquiries)
