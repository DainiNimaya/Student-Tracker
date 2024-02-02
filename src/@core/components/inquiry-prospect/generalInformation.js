import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react"
import {
    Button,
    CardTitle,
    Col,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    Input,
    InputGroup,
    Label,
    Row
} from 'reactstrap'
import Select from 'react-select'
import {User} from "react-feather"
import Required from "@components/required"
import * as Api from "@api/counsellor"
import * as ApiHaa from "@api/haa"
import {
    IDENTIFIERS,
    INQUIRY_PROSPECT_ACTIONS,
    INQUIRY_PROSPECT_STATUS2,
    INQUIRY_PROSPECT_STATUS,
    INQUIRY_TYPES,
    // MARKETING_CODES,
    STUDENT_ONBOARD_ACCESS_LIST
} from "@const"
import {
    appendPlusToMobile,
    createInquiryGIDataObject,
    createStudentOnboardGIDataObject,
    findObject,
    isNULL,
    selectThemeColors,
    showError,
    specialChar,
    isEMPTY
} from '@utils'
import PhoneInput from "react-phone-number-input"
import {inquiryProspectGIErrors} from "@formError/counsellor"
import {
    inquiryProspectDuplicatesValidation,
    inquiryProspectGIValidation
} from "@validations/counsellor"
import classnames from "classnames"
import Cookies from "js-cookie"
import config from '@storage'
import rs from '@routes'
import {studentOnboardGIValidation} from "@validations/student"
import {getLoggedUserData} from '@commonFunc'
import {accessList, inquiryDateAccessRole, basicInfo} from '@configs/basicInfomationConfig'
import {toast} from "react-toastify"
import {inquiries} from '@strings'
import Flatpickr from "react-flatpickr"

const App = ({
                 props,
                 studentOnBoard,
                 onNext,
                 selectedCourse,
                 setIsInquiryType,
                 isCBSearch,
                 setCBNo,
                 saveChanges,
                 refreshState,
                 refresh
             } = props, ref) => {

    const user = props.user

    const [disabled, setDisabled] = useState(user === config.haaRole || user === config.hosRole)
    const [action, setAction] = useState(INQUIRY_PROSPECT_ACTIONS[0])

    const save = action === INQUIRY_PROSPECT_ACTIONS[0]
    const required = user === config.studentRole
    const hoc = user === config.hocRole
    // const disabled = user === config.haaRole || user === config.hosRole
    const hide = user === config.haaRole || user === config.hosRole
    const newInq = props.history.location.pathname === rs.newInquiry
    const updateSubStatus = getLoggedUserData().role === config.hocRole || getLoggedUserData().role === config.counsellorRole

    const [intakeList, setIntakeList] = useState([])
    const [courses, setCourses] = useState([])
    const [branches, setBranches] = useState([])
    const [counsellors, setCounsellors] = useState([])
    const [dropdownOpen, setDropdownOpen] = useState(false)
    // Form data
    const [title, setTitle] = useState(IDENTIFIERS[0])
    const [name, setName] = useState('')
    const [preferredName, setPreferredName] = useState('')
    const [appitReferenceNumber, setAppitReferenceNumber] = useState('')
    const [uniReferenceNumber, setUniReferenceNumber] = useState('')
    const [inquiryId, setInquiryId] = useState(undefined)
    const [inquiryNumber, setInquiryNumber] = useState('')
    const [inquiryType, setInquiryType] = useState(undefined)
    const [mobile, setMobile] = useState('')
    const [studentLandNumber, setStudentLandNumber] = useState('')
    const [studentAddress, setStudentAddress] = useState('')
    const [email, setEmail] = useState('')
    const [courseMissMatch, setCourseMissMatch] = useState(false)
    const [inquiryStatus, setInquiryStatus] = useState(null)
    const [intake, setIntake] = useState(undefined)
    const [counsellor, setCounsellor] = useState(undefined)
    const [course, setCourse] = useState(undefined)
    const [branch, setBranch] = useState(undefined)
    const [remark, setRemark] = useState('')
    const [addedDate, setAddedDate] = useState(null)
    const [marketingCode, setMarketingCode] = useState(undefined)
    const [duplicates, setDuplicates] = useState(undefined)
    const [intakeId, setIntakeId] = useState(undefined)
    const [cbNumber, setCbNumber] = useState('')
    const [disableCounsellor, setDisableCounsellor] = useState(user === config.studentRole || user === config.haaRole || user === config.hosRole)
    const [oldCourseDetails, setOldCourseDetails] = useState(null)
    const [degreeStatus, setDegreeStatus] = useState(null)

    const [error, setError] = useState(inquiryProspectGIErrors)

    useEffect(() => {
        loadAllData()
    }, [])

    useEffect(() => {
        loadAllData()
        if (refresh) refresh(false)
    }, [refreshState])

    const loadAllData = async () => {
        const routeParam = props.location?.state ?? false
        const lists = await loadSelectionValues()
        if (props.user !== config.studentRole && routeParam) {
            setAction(routeParam.action)
            setInquiryId(routeParam.inquiryId)
            if (routeParam.action !== INQUIRY_PROSPECT_ACTIONS[0] && routeParam.inquiryId !== undefined) {
                await fetchInquiryGeneralInformation(routeParam.inquiryId, lists)
            }
        }
        if (props.user === config.studentRole && props.inquiryToken !== undefined) {
            setAction(props.action)
            await fetchInquiryGeneralInformation(props.inquiryToken, lists)
        }

        if (!routeParam || (routeParam.action === INQUIRY_PROSPECT_ACTIONS[0] && routeParam.inquiryId === undefined)) {
            if (props.user === config.counsellorRole || props.user === config.hocRole) {
                const user = JSON.parse(Cookies.get(config.user))
                setCounsellor({label: `${user.firstName} ${user.lastName}`, value: user.userId})

                if (lists.intakes.length > 0) {
                    const intake = lists.intakes.filter(item => {
                        return item.ongoing
                    })[0]
                    await onChangeValue({target: {name: 'intake', value: intake}})
                }
            }
        }
    }

    const loadSelectionValues = async () => {
        let intakes = []
        if (props.user === config.counsellorRole || props.user === config.hocRole) {
            const INTAKES = await Api.getAllIntakes()
            intakes = INTAKES.map(item => {
                return {label: item.intakeCode, value: item.intakeId, ongoing: item.ongoing}
            })
        }

        if (!props.isStudentOnboard) {
            const COUNSELLORS = await Api.getAllCounsellors()
            const counsellors = COUNSELLORS.map(item => {
                return {label: `${item.firstName} ${item.lastName}`, value: item.userId}
            })

            setCounsellors([...counsellors])
        }

        setIntakeList([...intakes])
        return {intakes, counsellors}
    }

    const getAllCourses = async (intakeId) => {
        setCourse(null)
        const url = `courses?intakeId=${intakeId}&completeCourse=true`
        const COURSES = await Api.getAllIntakeCourses(url)
        const courses = COURSES.map(item => {
            return {label: item.courseName, value: item.courseId, degreeStatus: item.degreeStatus}
        })
        setCourses([...courses])
        return courses
    }

    const getAllBranches = async (courseId) => {
        setBranch(null)
        const branchList = await ApiHaa.getAllBranches(courseId, true)
        setBranches([...branchList])
        return branchList
    }

    const fetchInquiryGeneralInformation = async (id, lists) => {
        const res = props.user === config.studentRole ? await Api.getInquiryGIByToken(id) : await Api.getInquiryGI(id)
        if (res) {
            setOldCourseDetails({course: res.appliedCourseId, branch: res.branchId, intake: res.intakeId})
            if (props.isStudentOnboard) {
                const isFound = STUDENT_ONBOARD_ACCESS_LIST.includes(res.subStatus)

                if (isFound) {
                    setDisabled(true)
                    props.changeAccessType(INQUIRY_PROSPECT_ACTIONS[1])
                }
            }

            if (updateSubStatus && res.inquiryStatus === "INQUIRY") setIsInquiryType(true)

            if (res.requestedDate) {
                setAddedDate([res.requestedDate])
            } else {
                setAddedDate([new Date()])
            }
            setInquiryId(res.inquiryId)
            setTitle(res.studentTitle)
            setCourseMissMatch(res.courseMissMatch)
            setName(isNULL(res.studentName))
            setPreferredName(isNULL(res.preferredName))
            setMobile(appendPlusToMobile(isNULL(res.studentMobile)))
            setStudentLandNumber(appendPlusToMobile(isNULL(res.studentLandNumber)))
            setStudentAddress(isNULL(res.studentAddress))
            setEmail(isNULL(res.studentEmail))
            setRemark(isNULL(res.remark))
            setInquiryNumber(isNULL(res.inquiryNumber))
            setAppitReferenceNumber(isNULL(res.appitReferenceNumber))
            setUniReferenceNumber(isNULL(res.uniReferenceNumber))
            setInquiryStatus(findObject(INQUIRY_PROSPECT_STATUS, res.inquiryStatus) ?? null)
            setIntake(findObject(lists.intakes, res.intakeId))
            if (res.intakeId) {
                const courses = await getAllCourses(res.intakeId)
                const temp = findObject(courses, res.appliedCourseId)
                setCourse(temp)
                setDegreeStatus(temp ? temp?.degreeStatus : null)
                res.degreeStatus = temp ? temp?.degreeStatus : null
                if (selectedCourse !== undefined) {
                    selectedCourse(temp)
                }

                if (res.appliedCourseId) {
                    const branchList = await getAllBranches(res.appliedCourseId)
                    setBranch(findObject(branchList, res.branchId))
                }
            } else {
                if (lists.intakes.length > 0) {
                    const intake = lists.intakes.filter(item => {
                        return item.ongoing
                    })[0]
                    await onChangeValue({target: {name: 'intake', value: intake}})
                }
            }

            setCounsellor({
                label: res.counselorName,
                value: res.counsellorId
            })

            setInquiryType(findObject(INQUIRY_TYPES, res.inquiryType))
            // setMarketingCode(findObject(MARKETING_CODES, res.marketingCode))
            setIntakeId(isNULL(res.intakeId))

            props.setInquiryGI(res)
            props.setInquiryId(res.inquiryId)
            sessionStorage.setItem(config.inquiryId, res.inquiryId)

            if (props.user === config.counsellorRole) {
                const userId = JSON.parse(Cookies.get(config.user)).userId
                if (res.counsellorId && res.counsellorId !== userId) {
                    setDisableCounsellor(true)
                }
            }
        }
    }

    const onChangeValue = async (e) => {
        const name = e.target.name
        switch (name) {
            case 'title':
                setTitle(e.currentTarget.textContent)
                break
            case 'appitReferenceNumber':
                setAppitReferenceNumber(e.target.value)
                break
            case 'uniReferenceNumber':
                setUniReferenceNumber(e.target.value)
                break
            case 'name':
                if (specialChar.test(e.target.value)) setName(e.target.value.replace('  ', ' '))
                break
            case 'preferredName':
                if (specialChar.test(e.target.value)) setPreferredName(e.target.value.replace('  ', ' '))
                break
            case 'inquiryNumber':
                setInquiryNumber(e.target.value)
                break
            case 'inquiryType':
                setInquiryType(e.target.value)
                break
            case 'mobile':
                setMobile(e.target.value)
                break
            case 'studentLandNumber':
                setStudentLandNumber(e.target.value)
                break
            case 'studentAddress':
                setStudentAddress(e.target.value)
                break
            case 'email':
                setEmail(e.target.value)
                break
            case 'inquiryStatus':
                setInquiryStatus(e.target.value)
                break
            case 'intake':
                setIntake(e.target.value)
                if (e.target.value) await getAllCourses(e.target.value.value)
                break
            case 'counsellor':
                setCounsellor(e.target.value)
                break
            case 'branch':
                setBranch(e.target.value)
                break
            case 'course':
                setCourse(e.target.value)
                setDegreeStatus(e.target.value.degreeStatus)
                // selectedCourse(e.target.value)
                if (props.user === config.counsellorRole || props.user === config.hocRole) {
                    await getAllBranches(e.target.value.value)
                }
                break
            case 'remark':
                setRemark(e.target.value)
                break
            case 'marketingCode':
                setMarketingCode(e.target.value)
                break
            case 'cbNumber':
                setCbNumber(e.target.value)
                break
        }
    }

    // save inquiry handler
    const onSave = async () => {
        // fields validation
        let res = inquiryProspectGIValidation(name, inquiryType, mobile, email, inquiryStatus, intake, counsellor, course, studentAddress, studentLandNumber, branch, preferredName)
        setError(res)
        selectedCourse(course)
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        // api request body
        const body = createInquiryGIDataObject(title, name, inquiryId, inquiryNumber, inquiryType, mobile, email,
            inquiryStatus, intake, counsellor, course, remark, studentAddress, studentLandNumber, marketingCode, preferredName, branch, addedDate)
        res = await Api.saveInquiryGI(body, cbNumber)
        // api response data
        if (res) {
            setAction(INQUIRY_PROSPECT_ACTIONS[2])
            setInquiryNumber(res.inquiryNumber)
            setInquiryId(res.inquiryId)
            props.setInquiryId(res.inquiryId)
            props.setInquiryGI({...res, branchId: res.branchId ?? branch.value, degreeStatus})

            if (oldCourseDetails !== null) {
                const isCourseChanged = oldCourseDetails.course !== course.value
                const isBranchChanged = oldCourseDetails.branch !== branch.value
                const isIntakeChanged = oldCourseDetails.intake !== intake.value
                if (inquiryNumber && (isCourseChanged || isBranchChanged || isIntakeChanged)) {
                    saveChanges()
                }
            }
        }
    }

    const onSaveStudent = async () => {
        if (!disabled) {
            let res = studentOnboardGIValidation(marketingCode, name, mobile, email, preferredName)
            setError(res)
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }

            const body = createStudentOnboardGIDataObject(title, name, inquiryId, inquiryNumber, inquiryType, mobile,
                email, inquiryStatus, intakeId, counsellor, course, remark, studentAddress, studentLandNumber, marketingCode, preferredName, branch)

            res = await Api.saveInquiryGI(body)
            if (res) {
                setAction(INQUIRY_PROSPECT_ACTIONS[2])
                setInquiryNumber(res.inquiryNumber)
                setInquiryId(res.inquiryId)
                props.setInquiryGI({...res, branchId: res.branchId ?? branch.value})
                if (studentOnBoard) onNext()
            }
        } else {
            onNext()
        }
    }

    const checkDuplicates = async () => {
        if (user === config.counsellorRole || user === config.hocRole) {
            let res = inquiryProspectDuplicatesValidation(name, mobile, email)
            setError(res)
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }
            res = await Api.checkDuplicates({
                name: isEMPTY(name),
                mobile: isEMPTY(mobile),
                email: isEMPTY(email),
                inquiryId: inquiryId ?? 0
            })
            if (res) {
                setDuplicates({
                    ...res,
                    name: res.duplicates.filter(item => item.name === true).length > 0,
                    mobile: res.duplicates.filter(item => item.mobile === true).length > 0,
                    email: res.duplicates.filter(item => item.email === true).length > 0
                })
            }
        }
    }

    const clearForm = () => {
        setInquiryStatus(null)
        setIntake(null)
        setCourse(null)
        setBranch(null)
        setCourses([])
        setCounsellor(null)
        setInquiryType(null)
        setMarketingCode(null)
        setIntakeId(null)
        setInquiryId(undefined)
        setDuplicates(undefined)

        setTitle(IDENTIFIERS[0])
        setCourseMissMatch(false)
        setName('')
        setPreferredName('')
        setMobile('')
        setStudentLandNumber('')
        setStudentAddress('')
        setEmail('')
        setRemark('')
        setInquiryNumber('')
        setAppitReferenceNumber('')
        setUniReferenceNumber()

        props.setInquiryGI(undefined)
        props.setInquiryId(undefined)
    }

    useImperativeHandle(ref, () => ({
        clearForm() {
            clearForm()
        }
    }))

    const onVerify = async () => {
        if (cbNumber.trim() === '') {
            toast.error(inquiries.enterCbNumber, {icon: true, hideProgressBar: true})
        } else {
            const res = await ApiHaa.getStudentGeneralInfo(0, cbNumber)
            if (res) {
                setName(isNULL(res.studentName))
                setTitle(res.studentTitle)
                setMobile(appendPlusToMobile(isNULL(res.studentMobile)))
                setStudentLandNumber(appendPlusToMobile(isNULL(res.studentLandNumber)))
                setPreferredName(isNULL(res.preferredName))
                // setIntake(findObject(lists.intakes, res.intakeId))
                setInquiryType(findObject(INQUIRY_TYPES, res.inquiryType))
                setEmail(isNULL(res.studentEmail))
                setStudentAddress(isNULL(res.studentAddress))
                setCounsellor(findObject(counsellors, res.counselorId))
                // setMarketingCode(findObject(MARKETING_CODES, res.marketingCode))
                setBranch(findObject(branches, res.branchId))

                setCBNo(cbNumber)
            } else {
                setCbNumber('')
            }
        }
    }

    return (
        <div>
            <CardTitle tag='h4' className="mt-1"><User size={20}/> &nbsp;General
                Information&nbsp;{inquiryNumber && `- ${inquiryNumber}`}</CardTitle>
            <Form>
                <Row>
                    <Col sm='6'>
                        <Row className='mb-1'>
                            <Label sm='3' for='name'>Name<Required/></Label>
                            <Col sm='9'>
                                <InputGroup>
                                    <Dropdown
                                        disabled={disabled}
                                        isOpen={disabled ? false : dropdownOpen}
                                        toggle={() => setDropdownOpen(disabled ? false : !dropdownOpen)}>
                                        <DropdownToggle color='primary' caret outline>{title}</DropdownToggle>
                                        <DropdownMenu>
                                            {
                                                IDENTIFIERS.map((item, index) => (
                                                    <DropdownItem
                                                        key={index}
                                                        className='w-100'
                                                        name="title"
                                                        onClick={!disabled && onChangeValue}>{item}</DropdownItem>
                                                ))
                                            }
                                        </DropdownMenu>
                                    </Dropdown>
                                    <Input
                                        invalid={error.name}
                                        type='text'
                                        name='name'
                                        id='name'
                                        placeholder='Student Name'
                                        value={name}
                                        readOnly={disabled}
                                        onBlur={checkDuplicates}
                                        onChange={onChangeValue}/>
                                </InputGroup>
                                {
                                    duplicates?.name && <Label className="text-warning">Duplicated</Label>
                                }

                            </Col>

                        </Row>
                    </Col>

                    <Col sm='6'>
                        <Row className='mb-1'>
                            <Label sm={3}>Inquiry Type</Label>
                            <Col sm={9}>
                                {
                                    (user === config.counsellorRole || user === config.hocRole) ?
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            theme={selectThemeColors}
                                            className={classnames('react-select', {'is-invalid': error.inquiryType})}
                                            classNamePrefix='select'
                                            value={inquiryType}
                                            onChange={value => onChangeValue({
                                                target: {
                                                    name: 'inquiryType',
                                                    value
                                                }
                                            })}
                                            options={INQUIRY_TYPES}
                                            isClearable={false}
                                            placeholder="Select Inquiry Type"
                                        /> :
                                        <Input
                                            type='text'
                                            name='inquiryType'
                                            id='inquiryType'
                                            value={inquiryType?.label}
                                            readOnly
                                            placeholder='Inq. Type'/>
                                }
                            </Col>
                        </Row>
                    </Col>

                    <Col sm='6'>
                        <Row className='mb-1'>
                            <Label sm='3' for='mobile'>
                                Mobile{required && <Required/>}
                            </Label>
                            <Col sm='9'>
                                <PhoneInput
                                    international
                                    countryCallingCodeEditable={true}
                                    defaultCountry="LK"
                                    placeholder="7########"
                                    name="mobile"
                                    value={mobile}
                                    disabled={disabled}
                                    onBlur={checkDuplicates}
                                    className={error.mobile ? 'validation-error' : ''}
                                    onChange={value => onChangeValue({target: {name: 'mobile', value}})}
                                />
                                {
                                    duplicates?.mobile && <Label className="text-warning">Duplicated</Label>
                                }
                            </Col>
                        </Row>
                    </Col>

                    <Col sm='6'>
                        <Row className='mb-1'>
                            <Label sm='3' for='email'>
                                Email{required && <Required/>}
                            </Label>
                            <Col sm='9'>
                                <Input
                                    type='email'
                                    name='email'
                                    id='email'
                                    value={email}
                                    readOnly={disabled}
                                    invalid={error.email}
                                    onBlur={checkDuplicates}
                                    onChange={onChangeValue}
                                    placeholder='example@gmail.com'/>
                                {
                                    duplicates?.email && <Label className="text-warning">Duplicated</Label>
                                }
                            </Col>
                        </Row>
                    </Col>

                    <Col sm='6'>
                        <Row className='mb-1'>
                            <Label sm='3'>
                                Counsellor{user !== config.studentRole && <Required/>}
                            </Label>
                            <Col sm='9'>
                                {
                                    disableCounsellor ?
                                        <Input
                                            type='text'
                                            name='counsellor'
                                            id='counsellor'
                                            value={counsellor?.label}
                                            readOnly
                                            placeholder='Selected Counsellor'/>
                                        :
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                            theme={selectThemeColors}
                                            className={classnames('react-select', {'is-invalid': error.counsellor})}
                                            classNamePrefix='select'
                                            value={counsellor}
                                            onChange={value => onChangeValue({target: {name: 'counsellor', value}})}
                                            options={counsellors}
                                            isClearable={false}
                                            isDisabled={props.location?.state?.myInq ?? false}
                                            placeholder="Counsellor"
                                            onBlur={checkDuplicates}
                                        />
                                }
                            </Col>
                        </Row>
                    </Col>

                    {
                        (user !== config.studentRole && !hide) &&
                        <Col sm='6'>
                            <Row className='mb-1'>
                                <Label sm='3' for='intake'>
                                    Intake<Required/>
                                </Label>
                                <Col sm='9'>
                                    <Select
                                        menuPortalTarget={document.body}
                                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                        theme={selectThemeColors}
                                        className={classnames('react-select', {'is-invalid': error.intake})}
                                        classNamePrefix='select'
                                        value={intake}
                                        onChange={value => onChangeValue({target: {name: 'intake', value}})}
                                        options={intakeList}
                                        isClearable={false}
                                        placeholder="Select Intake Code"
                                    />
                                </Col>
                            </Row>
                        </Col>
                    }

                    {
                        !hide &&
                        <Col sm='6'>
                            <Row className='mb-1'>
                                <Label sm='3' style={{paddingTop: 0}}>
                                    Course Applied{user !== config.studentRole && <Required/>}
                                </Label>
                                <Col sm='9'>
                                    {
                                        user !== config.studentRole ?
                                            <Select
                                                menuPortalTarget={document.body}
                                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                                theme={selectThemeColors}
                                                className={classnames('react-select', {'is-invalid': error.course})}
                                                classNamePrefix='select'
                                                value={course}
                                                onChange={value => onChangeValue({target: {name: 'course', value}})}
                                                options={courses}
                                                isClearable={false}
                                                placeholder="Select a Course"
                                            /> :
                                            <Input
                                                type='text'
                                                name='course'
                                                id='course'
                                                value={course?.label}
                                                invalid={error.course}
                                                onChange={onChangeValue}
                                                readOnly
                                                placeholder='Selected course'/>
                                    }

                                    {
                                        courseMissMatch &&
                                        <Label className="text-warning">Different from student selected</Label>
                                    }
                                </Col>
                            </Row>
                        </Col>
                    }

                    <Col sm='6'>
                        <Row className='mb-1'>
                            <Label sm='3' for='addedDate'>
                                Date
                            </Label>
                            <Col sm='9'>
                                <Flatpickr
                                    disabled={!(accessList.allowInquiryDateEditable && inquiryDateAccessRole.includes(Cookies.get(config.role)))}
                                    className={`form-control`}
                                    id='addedDate'
                                    options={{maxDate: new Date()}}
                                    placeholder="Added date"
                                    onChange={setAddedDate}
                                    value={addedDate}/>
                            </Col>
                        </Row>
                    </Col>

                    <Col sm='6'>
                        <Row className='mb-1'>
                            <Label sm='3' for='remark'>
                                Remarks
                            </Label>
                            <Col sm='9' style={{position: 'relative', minHeight: 50}}>
                                <Input
                                    type='textarea'
                                    name='remark'
                                    id='remark'
                                    value={remark}
                                    maxLength="250"
                                    onChange={onChangeValue}
                                    placeholder='Type your remark here'
                                />
                                <span className="wordCount" style={{
                                    position: 'absolute',
                                    right: 15
                                }}><span>{remark.length}</span>/250</span>
                            </Col>
                        </Row>
                    </Col>

                    {
                        !hide &&
                        <Col sm={12}>
                            <div className='d-flex justify-content-end'>
                                {
                                    user !== config.studentRole &&
                                    <Button className='me-1' outline color='primary' type='reset'
                                            onClick={() => {
                                                !newInq ? props.history.goBack() : clearForm()
                                            }}>
                                        {!newInq ? 'Cancel' : 'Clear'}
                                    </Button>
                                }
                                {
                                    studentOnBoard ?
                                        <Button color='primary' type='button' className="mt-1"
                                                onClick={onSaveStudent}>
                                            Next
                                        </Button> :
                                        <>{!disabled && <Button color='primary' type='button'
                                                                onClick={user === config.studentRole ? onSaveStudent : onSave}>
                                            {inquiryNumber ? 'Save Changes' : 'Save Inquiry'}
                                        </Button>}</>
                                }
                                {/*save inquiry action*/}
                            </div>
                        </Col>
                    }
                </Row>
            </Form>
        </div>
    )
}

export default forwardRef(App)
