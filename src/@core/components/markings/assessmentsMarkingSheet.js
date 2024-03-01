import React, {Component} from "react"
import {Badge, Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row} from "reactstrap"
import {CSVLink} from "react-csv"
import {ChevronDown, Download, HelpCircle, Upload, User, X} from "react-feather"
import './_markings.scss'
import DataTable from "react-data-table-component"
import {
    ASSESSMENT_MARKING_SHEET_ENTER_COLUMNS,
    ASSESSMENT_MARKING_SHEET_VIEW_COLUMNS,
    ASSESSMENT_MARKING_SHEET_HAA_ENTER_COLUMNS
} from "./tableData"
import CustomPagination from "@components/customPagination"
import * as Api from '@api/lecturer_'
import {
    GRADES,
    COLOR_STATUS,
    EXAM_STATUS,
    STUDENT_MARK_TYPES,
    HAA_ASSESSMENT_STATUS,
    ASSESSMENT_TABLE_STATUS,
    ASSESSMENT_REMARK_TYPES,
    PUBLISH_UNPUBLISH,
    ASSESSMENT_MARKING_CSV_TEMPLATE_HEADER,
    ASSESSMENT_MARKING_HAA_CSV_TEMPLATE_HEADER,
    ASSESSMENT_MARKING_SHEET_HAA_CSV_HEADER,
    ASSESSMENT_MARKING_SHEET_HOS_CSV_HEADER
} from '@const'
import {capitalize, readCSV} from '@commonFunc'
import {markSheetValidation} from '@validations/lecturer'
import {haaMarkSheetValidation} from '@validations/headOfAcademicAdmin'
import {markingSheetErrors} from '@formError/lecturer'
import {haaMarkingSheetErrors} from '@formError/headOfAcademicAdmin'
import {getCookieUserData, selectThemeColors, showError} from '@utils'
import config from '@storage'
import classnames from "classnames"
import Select from "react-select"
import PublishSideConfirmation from "./publishSideConfirmation"
import {toast} from "react-toastify"
import ConfirmBox from "@components/confirm-box"
import rs from '@routes'
import ViewGradingScheme from "@components/scheme-editor/viewGradingScheme"
import Switch from "@components/switch"
import themeConfig from '@configs/themeConfig'

class AssessmentsMarkingSheet extends Component {
    fileRef = React.createRef()
    csvLinkEl = React.createRef()

    componentWillMount() {
        this.getAllAssessmentStudents()
    }

    state = {
        markingSheetList: [],
        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0,
        error: (getCookieUserData().role === config.haaRole) ? haaMarkingSheetErrors : markingSheetErrors,
        gradingTable: [],
        exportDataList: [],
        status: HAA_ASSESSMENT_STATUS[0],
        isPublishConfirmation: false,
        isSelectAllRows: false,
        isSelectRow: false,
        changeData: [],
        publishConfirmType: null,
        selectedRowIdList: [],
        isCancelConfirm: false,
        isGradingScheme: false,
        gradingModalData: null
    }

    getAllAssessmentStudents = async () => {
        const propState = this.props.location.state
        const res = await Api.getAssessmentStudentsByAssessmentIdAndAssessmentDateId(propState.assessmentId,
            propState.assessmentDateId,
            this.state.currentPage,
            (getCookieUserData().role === config.haaRole) ? this.state.status.value : null, propState.repeatRecommendation)
        // set null to HAA_ASSESSMENT_STATUS[2] for backend
        if (res) {
            const content = []
            res.content.map(async (item, index) => {
                const i = this.findIndex(this.state.changeData, item)
                if (i > -1) {
                    const ex = this.state.changeData[i]

                    if (getCookieUserData().role === config.haaRole) {
                        const checkMarks = (ex.actualMark > 0 && ex.actualMark <= 100)
                            ? ex.actualMark : (ex.moderatedMark > 0 && ex.moderatedMark <= 100)
                                ? ex.moderatedMark : (ex.submittedMark > 0 && ex.submittedMark <= 100) ? ex.submittedMark : 0

                        let foundGradingData = null
                        const list = [...this.state.gradingTable]
                        for (const i in list) {
                            if (list[i].markFrom <= checkMarks && list[i].markTo >= checkMarks) {
                                foundGradingData = list[i]
                            }
                        }

                        if (!item.absent) {
                            content.push({
                                ...item,
                                submittedMark: ex.submittedMark,
                                moderatedMark: ex.moderatedMark,
                                actualMark: ex.actualMark,
                                remarkType: ex.remarkType,
                                remarkTypeValue: ex.remarkTypeValue,
                                grade: foundGradingData ? foundGradingData.grade : item.grade,
                                examStatus: foundGradingData && foundGradingData.pass ? EXAM_STATUS.pass : item.examStatus
                            })
                        }
                    } else {
                        let foundGradingData = null
                        const list = [...this.state.gradingTable]
                        for (const i in list) {
                            if (list[i].markFrom <= ex.submittedMark && list[i].markTo >= ex.submittedMark) {
                                foundGradingData = list[i]
                            }
                        }
                        if (!item.absent) {
                            content.push({
                                ...item,
                                submittedMark: ex.submittedMark ? ex.submittedMark : item.submittedMark,
                                grade: foundGradingData ? foundGradingData.grade : item.grade,
                                examStatus: foundGradingData && foundGradingData.pass ? EXAM_STATUS.pass : item.examStatus,
                                lecturerRemark: ex.lecturerRemark ? ex.lecturerRemark : item.lecturerRemark
                            })
                        } else {
                            content.push(item)
                        }
                    }
                } else {
                    let isFound = false
                    const list = propState.gradingTable
                    const tempMarks = item.submittedMark < item.moderatedMark ? item.moderatedMark : item.moderatedMark < item.actualMark ? item.actualMark : item.submittedMark
                    for (const i in list) {
                        if (list[i].markFrom <= tempMarks && list[i].markTo >= tempMarks) {
                            isFound = true
                            content.push({
                                ...item,
                                grade: list[i].grade,
                                examStatus: list[i].pass ? EXAM_STATUS.pass : EXAM_STATUS.fail
                            })
                        }
                    }

                    if (!isFound) {
                        content.push(item)
                    }
                }
            })

            await this.setState({
                markingSheetList: content,
                numberOfElements: res.numberOfElements,
                totalElements: res.totalElements,
                totalPages: res.totalPages,
                offset: res.pageable.offset,
                pageSize: res.pageable.pageSize,
                gradingTable: propState.gradingTable
            })
        }
    }

    onImportFile = async (e) => {
        await readCSV(e.target.files[0], async result => {
            if (result && result.rows.length > 0) {
                this.fileRef.current.value = ""

                const changeData = [...this.state.changeData]
                result.rows.map(item => {
                    const index = this.findIndex(this.state.changeData, item)
                    if (index === -1) {
                        if ((getCookieUserData().role === config.haaRole)) {
                            changeData.push({
                                ...item,
                                submittedMark: item.submittedMark,
                                moderatedMark: item.moderatedMark,
                                actualMark: item.actualMark,
                                remarkTypeValue: item.remarkTypeValue,
                                remarkType: {label: item.remarkType, value: item.remarkType}
                            })
                        } else {
                            changeData.push({
                                ...item,
                                lecturerRemark: item.lecturerRemark,
                                submittedMark: item.marks
                            })
                        }
                    } else {
                        if ((getCookieUserData().role === config.haaRole)) {
                            changeData[index] = {
                                ...item,
                                submittedMark: item.submittedMark,
                                moderatedMark: item.moderatedMark,
                                actualMark: item.actualMark,
                                remarkTypeValue: item.remarkTypeValue,
                                remarkType: {label: item.remarkType, value: item.remarkType}
                            }
                        } else {
                            changeData[index] = {
                                ...item,
                                lecturerRemark: item.lecturerRemark,
                                submittedMark: item.marks
                            }
                        }
                    }
                })

                await this.setState({changeData})
                await this.getAllAssessmentStudents()
            }
        })
    }

    findIndex = (array, data) => {
        const filter = array.filter(i => i.cbDocketNumber === data.cbDocketNumber)[0]
        return filter ? array.findIndex(i => i.cbDocketNumber === filter.cbDocketNumber) : -1
    }

    onTableInputHandler = async (index, e, type) => {
        const rows = [...this.state.markingSheetList]
        let res = null
        switch (type) {
            case 'mark':
                rows[index].submittedMark = e.target.value

                const moderated = Number.parseInt(rows[index].moderatedMark)
                const actual = Number.parseInt(rows[index].actualMark)

                if (!(moderated > 0 || actual > 0)) {
                    res = await this.calculateGradeAndExamStatusByMarks(Number.parseInt(e.target.value))
                    if (res) {
                        rows[index].grade = res.grade
                        rows[index].examStatus = res.pass ? EXAM_STATUS.pass : EXAM_STATUS.fail
                    } else {
                        rows[index].grade = GRADES.f
                        rows[index].examStatus = EXAM_STATUS.fail
                    }
                }
                break
            case 'absent':
                rows[index].absent = e
                //rows[index].examStatus = e.target.checked ? EXAM_STATUS.absent : EXAM_STATUS.fail
                break
            case 'remark':
                rows[index].lecturerRemark = e.target.value
                break
            case 'remarkTypeValue':
                rows[index].remarkTypeValue = e.target.value
                break
            case 'moderatedMark':
                rows[index].moderatedMark = e.target.value

                const modActual = Number.parseInt(rows[index].actualMark)

                if (!(modActual > 0)) {
                    res = await this.calculateGradeAndExamStatusByMarks(Number.parseInt(e.target.value))
                    if (res) {
                        rows[index].grade = res.grade
                        rows[index].examStatus = res.pass ? EXAM_STATUS.pass : EXAM_STATUS.fail
                    } else {
                        rows[index].grade = GRADES.f
                        rows[index].examStatus = EXAM_STATUS.fail
                    }
                }
                break
            case 'actualMark':
                rows[index].actualMark = e.target.value
                res = await this.calculateGradeAndExamStatusByMarks(Number.parseInt(e.target.value))
                if (res) {
                    rows[index].grade = res.grade
                    rows[index].examStatus = res.pass ? EXAM_STATUS.pass : EXAM_STATUS.fail
                } else {
                    rows[index].grade = GRADES.f
                    rows[index].examStatus = EXAM_STATUS.fail
                }
                break
        }
        await this.setState({markingSheetList: rows})
    }

    calculateGradeAndExamStatusByMarks = async (mark, preLoad, preArray) => {
        const list = preLoad ? [...preArray] : [...this.state.gradingTable]
        for (const i in list) {
            if (list[i].markFrom <= mark && list[i].markTo >= mark) {
                return list[i]
            }
        }

        return false
    }

    validateTable = async (type, data) => {
        let res = null
        if (getCookieUserData().role === config.haaRole) {
            if (!(this.state.isSelectRow || this.state.isSelectAllRows)) {
                toast.warning('Please select at least a row', {icon: true, hideProgressBar: true})
                return false
            }

            res = haaMarkSheetValidation(this.state.markingSheetList, this.state.selectedRowIdList)
        } else {
            res = markSheetValidation(this.state.markingSheetList)
        }

        if (res) {
            this.setState({error: res})
            for (const key in res) {
                if (res[key]) {
                    toast.warning('Please check all marks', {icon: true, hideProgressBar: true})
                    return
                }
            }

            if ((getCookieUserData().role !== config.haaRole)) {
                await this.onSaveMarks(type)
            } else {
                if (type === 'PUBLISH') {
                    let isEmptyActualMark = false
                    this.state.markingSheetList.map(item => {
                        // const actualMark = item.actualMark ? Number.parseInt(item.actualMark) : 0
                        // if ((!item.absent) && actualMark !== 0 && item.selectAll) {
                        if ((!item.absent) && item.selectAll) {
                            // isEmptyActualMark = true
                            isEmptyActualMark = false
                            return false
                        }
                    })

                    if (isEmptyActualMark) {
                        toast.warning('Check actual mark(s) before publish', {icon: true, hideProgressBar: true})
                        return false
                    } else {
                        await this.setState({isPublishConfirmation: true, publishConfirmType: type})
                    }
                } else if (type === 'UNPUBLISH') {
                    await this.setState({isPublishConfirmation: true, publishConfirmType: type})
                } else if (type === STUDENT_MARK_TYPES.saveAsDraft) {
                    await this.onSaveMarks(type)
                }
            }
        }
    }

    onSaveMarks = async (type) => {
        const propState = this.props.location.state
        const dataList = []

        if (getCookieUserData().role === config.haaRole) {
            this.state.markingSheetList.map(item => {
                if (this.state.isSelectAllRows) {
                    dataList.push({
                        ...item,
                        submittedMark: item.submittedMark ? Number.parseInt(item.submittedMark) : 0,
                        moderatedMark: item.moderatedMark ? Number.parseInt(item.moderatedMark) : 0,
                        actualMark: item.actualMark ? Number.parseInt(item.actualMark) : 0,
                        remarkType: item.remarkType ? item.remarkType.value : null,
                        remark: item.remarkTypeValue ? item.remarkTypeValue : null
                    })
                } else {
                    if (item.selectAll) {
                        dataList.push({
                            ...item,
                            submittedMark: item.submittedMark ? Number.parseInt(item.submittedMark) : 0,
                            moderatedMark: item.moderatedMark ? Number.parseInt(item.moderatedMark) : 0,
                            actualMark: item.actualMark ? Number.parseInt(item.actualMark) : 0,
                            remarkType: item.remarkType ? item.remarkType.value : null,
                            remark: item.remarkTypeValue ? item.remarkTypeValue : null
                        })
                    }
                }
            })
        } else {
            this.state.markingSheetList.map(item => {
                dataList.push({
                    ...item,
                    submittedMark: item.submittedMark ? Number.parseInt(item.submittedMark) : 0
                })
            })
        }


        const data = {
            action: type,
            students: dataList.map(item => {
                return {
                    cbDocketNumber: item.cbDocketNumber,
                    batchCode: item.batchCode,
                    submittedMark: item.submittedMark,
                    moderatedMark: item.moderatedMark,
                    actualMark: item.actualMark,
                    absent: item.absent,
                    grade: item.grade,
                    publishStatus: item.publishStatus,
                    examStatus: item.examStatus,
                    remarkType: (getCookieUserData().role === config.haaRole) ? item.remarkType : ASSESSMENT_REMARK_TYPES[0].value, // FIRST, MODERATED, ACTUAL
                    remark: (getCookieUserData().role === config.haaRole) ? item.remark : item.lecturerRemark,
                    studentAssessmentId: item.studentAssessmentId
                }
            })
        }

        // const res = await Api.saveStudentMarks(propState.assessmentId, propState.assessmentDateId, data, propState.repeatRecommendation)
        // if (res) {
        //     await this.clearTableData()
        //     await this.getAllAssessmentStudents()
        // }
    }

    clearTableData = async () => {
        const rows = [...this.state.markingSheetList]
        rows.map(item => {
            item.remarkTypeValue = ''
            item.selectAll = false
        })
        await this.setState({markingSheetList: rows, isSelectAllRows: false})
    }

    onMarksCopy = async (type) => {
        const rows = [...this.state.markingSheetList]
        let res = null
        rows.map(async (item, i) => {
            if (type === 'MODERATED') {
                rows[i].moderatedMark = rows[i].submittedMark
                res = await this.calculateGradeAndExamStatusByMarks(Number.parseInt(rows[i].submittedMark))
                if (res) {
                    rows[i].grade = res.grade
                    rows[i].examStatus = res.pass ? EXAM_STATUS.pass : EXAM_STATUS.fail
                } else {
                    rows[i].grade = GRADES.f
                    rows[i].examStatus = EXAM_STATUS.fail
                }
            } else {
                rows[i].actualMark = rows[i].moderatedMark
                res = await this.calculateGradeAndExamStatusByMarks(Number.parseInt(rows[i].moderatedMark))
                if (res) {
                    rows[i].grade = res.grade
                    rows[i].examStatus = res.pass ? EXAM_STATUS.pass : EXAM_STATUS.fail
                } else {
                    rows[i].grade = GRADES.f
                    rows[i].examStatus = EXAM_STATUS.fail
                }
            }
        })

        await this.setState({markingSheetList: rows})
        await this.forceUpdate()
    }

    modalHandler = (state) => {
        this.setState({isPublishConfirmation: !state})
    }

    onPublishToStudent = async (data) => {
        let type = null
        if (this.state.publishConfirmType === 'PUBLISH') {
            if (data.actual) type = STUDENT_MARK_TYPES.actualPublished
            if (data.moderated) type = STUDENT_MARK_TYPES.moderatedPublished
        } else {
            if (data.actual) type = STUDENT_MARK_TYPES.actualUnpublished
            if (data.moderated) type = STUDENT_MARK_TYPES.moderatedUnpublished
        }

        await this.onSaveMarks(type)
        await this.setState({isPublishConfirmation: false})
        await this.unSelectAllCheckBox()
    }

    unSelectAllCheckBox = async () => {
        const rows = [...this.state.markingSheetList]
        rows.map(item => {
            item.selectAll = false
        })
        await this.setState({
            isSelectAllRows: false,
            isSelectRow: false,
            markingSheetList: rows
        })
    }

    onSelectAllHandler = async (type, e, index) => {
        const rows = [...this.state.markingSheetList]
        let selectAllRow = false
        let selectCount = 0
        let selectRow = false

        rows.map(item => {
            if (type === 'all') {
                item.selectAll = e.target.checked
                selectAllRow = e.target.checked
            } else {
                rows[index].selectAll = e.target.checked
                if (item.selectAll) {
                    selectCount = selectCount + 1
                    selectRow = true
                }
            }
        })

        if (!e.target.checked) {
            const a = this.state.selectedRowIdList.filter(ele => {
                return ele !== index
            })
            await this.setState({error: haaMarkingSheetErrors, selectedRowIdList: a})
        } else {
            this.state.selectedRowIdList.push(index)
        }

        if (selectCount === rows.length) {
            selectAllRow = true
        }

        await this.setState({markingSheetList: rows, isSelectAllRows: selectAllRow, isSelectRow: selectRow})
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.getAllAssessmentStudents()
    }

    onTableRemarkHandler = async (i, e) => {
        const rows = [...this.state.markingSheetList]
        rows[i].remarkType = e
        await this.setState({markingSheetList: rows})
    }

    viewGradingScheme = async () => {
        const gradingSchemeId = this.props.location.state.gradingSchemeId
        this.setState({
            isGradingScheme: true,
            gradingModalData: gradingSchemeId
        })
    }

    viewGradingModal = () => {
        this.setState({
            isGradingScheme: false
        })
    }

    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state
        const data = []
        const propState = this.props.location.state

        this.state.markingSheetList.map((item, i) => {
            const marks = Number.parseInt(item.submittedMark)
            const moderatedMark = Number.parseInt(item.moderatedMark)
            const actualMark = Number.parseInt(item.actualMark)
            const obj = {
                cbNo: item.cbDocketNumber,
                batch: item.batchCode ? item.batchCode : 'N/A',
                marks: <Input
                    invalid={(getCookieUserData().role === config.haaRole ? (this.state.error.marks && item.selectAll) : this.state.error.marks) && (item.submittedMark === '' || marks > 100 || marks < 0)}
                    type={'number'}
                    onChange={(e) => this.onTableInputHandler(i, e, 'mark')}
                    value={item.absent ? '-' : item.submittedMark}
                    style={{textAlign: 'right'}}
                    disabled={!propState.type.marks || item.absent}
                />,
                absent: <Switch checked={item.absent}
                                disabled={!propState.type.absent}
                                onChangeAction={() => this.onTableInputHandler(i,!item.absent , 'absent')}/>,
                grade: item.absent ? '-' : <Badge
                    color={`light-${item.grade === GRADES.a
                        ? COLOR_STATUS[0] : item.grade === GRADES.b
                            ? COLOR_STATUS[2] : item.grade === GRADES.f
                                ? COLOR_STATUS[1] : COLOR_STATUS[6]}`}
                    pill>{(item.submittedMark === 0 && item.moderatedMark === 0 && item.actualMark === 0) ? '-' : item.grade}</Badge>,
                examStatus: item.absent ? '-' : <span
                    className={`${item.examStatus === EXAM_STATUS.pass
                        ? 'lbl-success' : item.examStatus === EXAM_STATUS.fail
                            ? 'lbl-danger' : item.examStatus === EXAM_STATUS.absent
                                ? 'lbl-warning' : ''}`}>{(item.submittedMark === 0 && item.moderatedMark === 0 && item.actualMark === 0) ? '-' : item.examStatus ? capitalize(item.examStatus.replaceAll('_', ' ').toLowerCase()) : '-'}</span>,
                remark: <div className={'remark-container'}>
                    {(getCookieUserData().role === config.haaRole && !this.props.location.state.repeatRecommendation) ? <>
                        {/*<Select*/}
                        {/*    theme={selectThemeColors}*/}
                        {/*    className={classnames('react-select remark-select')}*/}
                        {/*    classNamePrefix='select'*/}
                        {/*    value={item.absent ? null : item.remarkType}*/}
                        {/*    options={ASSESSMENT_REMARK_TYPES}*/}
                        {/*    isClearable={true}*/}
                        {/*    menuPortalTarget={document.body}*/}
                        {/*    placeholder={'Type'}*/}
                        {/*    onChange={(e) => this.onTableRemarkHandler(i, e)}*/}
                        {/*    // isDisabled={item.absent}*/}
                        {/*/>*/}
                        <Input
                            value={item.absent ? '-' : item.remarkTypeValue}
                            onChange={(e) => this.onTableInputHandler(i, e, 'remarkTypeValue')}
                            disabled={!propState.type.remark}
                            className={'remark-input'}
                        /></> : <Input
                        value={item.lecturerRemark}
                        onChange={(e) => this.onTableInputHandler(i, e, 'remark')}
                        disabled={!propState.type.remark || item.absent}
                        className={'remark-input'}
                    />}</div>
            }

            if (propState.type.tblAllMarks) {
                obj['moderatedMarks'] = item.moderatedMark
                obj['actualMarks'] = item.actualMark
            }

            if (getCookieUserData().role === config.haaRole) {
                obj['selectAll'] =
                    <Input onChange={(e) => this.onSelectAllHandler('single', e, i)} checked={item.selectAll}
                           type='checkbox'/>

                obj['status'] = item.absent ? '-' : <Badge
                    className='ms-auto me-1'
                    color={item.status === ASSESSMENT_TABLE_STATUS.pending ? `light-${COLOR_STATUS[2]}`
                        : `light-${COLOR_STATUS[0]}`}
                    pill>{capitalize(item.status.replaceAll('_', ' ').toLowerCase())}</Badge>

                obj['moderatedMarks'] = <Input
                    invalid={(this.state.error.moderatedMark && item.selectAll) && (item.moderatedMark === '' || moderatedMark > 100 || moderatedMark < 0)}
                    type={'number'}
                    onChange={(e) => this.onTableInputHandler(i, e, 'moderatedMark')}
                    value={item.absent ? '-' : item.moderatedMark}
                    style={{textAlign: 'right'}}
                    disabled={item.absent}
                />

                obj['actualMark'] = <Input
                    invalid={(this.state.error.actualMark && item.selectAll) && (item.actualMark === '' || actualMark > 100 || actualMark < 0)}
                    type={'number'}
                    onChange={(e) => this.onTableInputHandler(i, e, 'actualMark')}
                    value={item.absent ? '-' : item.actualMark}
                    style={{textAlign: 'right'}}
                    disabled={item.absent}
                />

                obj['item'] = item
                obj['publishUnpublish'] = item.absent ? '-' : <Badge
                    className='ms-auto me-1'
                    color={item.publishStatus === PUBLISH_UNPUBLISH.published ? `light-${COLOR_STATUS[0]}`
                        : item.publishStatus === PUBLISH_UNPUBLISH.unPublished ? `light-${COLOR_STATUS[2]}` : `light-${COLOR_STATUS[1]}`}
                    pill>{item.publishStatus ? item.absent ? '-' : capitalize(item.publishStatus.replaceAll('_', ' ').toLowerCase()) : '-'}</Badge>
            } else {
                obj['moderatedMarks'] = item.moderatedMark
                obj['actualMarks'] = item.actualMark
            }

            data.push(obj)
        })

        const ExpandableTable = ({data}) => {
            return (<div className={'expandable-content p-2'}>
                <Row style={{width: '100%'}}>
                    <Col md={12}>
                        <div className={'remark'}>
                            <p className={'remark-content'}>First Remark
                                : {data.item.lecturerRemark ? data.item.lecturerRemark : 'N/A'}</p>
                            <span
                                className={'person'}>Remark By : {data.item.lecturerRemarkUser ? data.item.lecturerRemarkUser : 'N/A'}</span>
                            <span>Updated Date : {data.item.lecturerRemarkDate ? data.item.lecturerRemarkDate : 'N/A'}</span>
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className={'remark'}>
                            <p className={'remark-content'}>Moderator Remark
                                : {data.item.moderatorRemark ? data.item.moderatorRemark : 'N/A'}</p>
                            <span
                                className={'person'}>Remark By : {data.item.moderatorRemarkUser ? data.item.moderatorRemarkUser : 'N/A'}</span>
                            <span>Updated Date : {data.item.moderatorRemarkDate ? data.item.moderatorRemarkDate : 'N/A'}</span>
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className={'remark'}>
                            <p className={'remark-content'}>Actual Remark
                                : {data.item.actualRemark ? data.item.actualRemark : 'N/A'}</p>
                            <span
                                className={'person'}>Remark By : {data.item.actualRemarkUser ? data.item.actualRemarkUser : 'N/A'}</span>
                            <span>Updated Date : {data.item.actualRemarkDate ? data.item.actualRemarkDate : 'N/A'}</span>
                        </div>
                    </Col>
                </Row>
            </div>)
        }

        const RepeatRecommendationExpandableTable = ({data}) => {
            return (<div className={'expandable-content p-2'}>
                <Row style={{width: '100%'}}>
                    <Col md={2}>
                        <div className={'repeat-expand'}>
                            <span style={{fontWeight: 500}}>Lecturer Name : </span>
                            <span className={'data'}> Kamal</span>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className={'repeat-expand'}>
                            <span style={{fontWeight: 500}}>Marker Name : </span>
                            <span className={'data'}> Kamal</span>
                        </div>
                    </Col>

                    <Col md={2}>
                        <div className={'repeat-expand'}>
                            <span style={{fontWeight: 500}}>Attempt : </span>
                            <span className={'data'}> Kamal</span>
                        </div>
                    </Col>

                    <Col md={12}>
                        <div className={'repeat-expand'}>
                            <span style={{fontWeight: 500}}>Marker Remark : </span>
                            <span className={'data'}> Kamal</span>
                        </div>
                    </Col>
                </Row>
            </div>)
        }

        return <div className={'assessment-marking-sheet'}>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle
                        tag='h4'>{propState.repeatRecommendation ? 'Repeat Marking' : 'Assessments Marking Sheet'}</CardTitle>

                    <div className='d-flex mt-md-0 mt-1 align-item-center'>
                        <Button
                            size={'sm'}
                            className={'btn-copy'}
                            style={{marginRight: 20}}
                            onClick={this.viewGradingScheme}
                        >View Grading Schemes</Button>

                        {/*{propState.type.btnImport && <>*/}
                            {/*<CSVLink filename={'template_marking_sheet.csv'} data={[]}*/}
                                     {/*headers={(getCookieUserData().role === config.haaRole) ? ASSESSMENT_MARKING_HAA_CSV_TEMPLATE_HEADER : ASSESSMENT_MARKING_CSV_TEMPLATE_HEADER}>*/}
                                {/*<div className={'link-csv-template'}>*/}
                                    {/*<Download className={'lbl-csv-template'} size={15}/>{" "}*/}
                                    {/*<span className='lbl-csv-template align-middle ml-50'>CSV Template</span>*/}
                                {/*</div>*/}
                            {/*</CSVLink>*/}

                            {/*<Button tag={Label} className='top-custom-btn mr-2' outline color={'primary'}>*/}
                                {/*<Download className='importBtn' size={15}/>*/}
                                {/*<span className='align-middle ml-50 importBtn' > Import </span>*/}
                                {/*<input type='file'  ref={this.fileRef}*/}
                                       {/*onChange={this.onImportFile}*/}
                                       {/*hidden*/}
                                       {/*accept='.xlsx, .xls, .csv'/>*/}
                            {/*</Button></>}*/}

                        {/*<CSVLink*/}
                            {/*headers={(getCookieUserData().role === config.haaRole) ? ASSESSMENT_MARKING_SHEET_HAA_CSV_HEADER : (getCookieUserData().role === config.hosRole) ? ASSESSMENT_MARKING_SHEET_HOS_CSV_HEADER : null}*/}
                            {/*data={this.state.exportDataList}*/}
                            {/*ref={this.csvLinkEl}*/}
                            {/*filename={"assessments_marking_sheet_export.csv"}*/}
                        {/*/>*/}
                        {/*<Button tag={Label} onClick={this.onExportData} className={'top-custom-btn'} outline*/}
                                {/*color={'primary'}>*/}
                            {/*<Upload className='importBtn' size={15}/>*/}
                            {/*<span  className='align-middle ml-50 importBtn'> Export </span>*/}
                        {/*</Button>*/}
                    </div>
                </CardHeader>
                <CardBody>
                    <div className={'custom-header'}>
                        <div className={'header-label'}>Assessment Details</div>
                        <X onClick={() => this.props.history.goBack()} className={'icn-header'} size={24}/>
                    </div>

                    <Row>
                        <Col md={2}>
                            <div>
                                <label className={'title-header-data'}>Assessment Type</label>
                                <label>{propState.assessmentType.type}</label>
                            </div>
                        </Col>

                        <Col md={3}>
                            <div>
                                <label className={'title-header-data'}>Module Name</label>
                                <label>{propState.moduleName}</label>
                            </div>
                        </Col>

                        {!propState.repeatRecommendation && <Col md={2}>
                            <div>
                                <label className={'title-header-data'}>Dead Line</label>
                                <label>{propState.deadline ? propState.deadline : 'N/A'}</label>
                            </div>
                        </Col>}

                        {propState.repeatRecommendation && <Col md={2}>
                            <div>
                                <label className={'title-header-data'}>Submission Date</label>
                                <label>{propState.submissionDate ? propState.submissionDate : 'N/A'}</label>
                            </div>
                        </Col>}

                        {propState.type.lblPassingPercentage && <Col md={2}>
                            <div>
                                <label className={'title-header-data'}>Passing Percentage</label>
                                <label>{propState.passingPercentage}%</label>
                            </div>
                        </Col>}

                        {propState.type.returnDate && !propState.repeatRecommendation && <Col md={2}>
                            <div>
                                <label className={'title-header-data'}>Return Date</label>
                                <label>{propState.returnDate ? propState.returnDate : 'N/A'}</label>
                            </div>
                        </Col>}
                    </Row>

                    {(getCookieUserData().role === config.haaRole) && <div className={'status-section'}>
                        <label>Status:</label>
                        <Select
                            theme={selectThemeColors}
                            className={classnames('react-select status-select')}
                            classNamePrefix='select'
                            value={this.state.status}
                            options={HAA_ASSESSMENT_STATUS}
                            isClearable={false}
                            onChange={async (e) => {
                                await this.setState({status: e})
                                await this.getAllAssessmentStudents()
                            }}
                            placeholder={'Status'}
                        />

                        {(data.length > 0 && propState.type.copyButton) && <div align={'right'} style={{width: '100%'}}>
                            <Button
                                color={'primary'}
                                size={'sm'}
                                className={'btn-copy'}
                                onClick={() => this.onMarksCopy('MODERATED')}
                            >First Marks to Moderated</Button>

                            <Button
                                color={'primary'}
                                size={'sm'}
                                className={'btn-copy-right'}
                                onClick={() => this.onMarksCopy('ACTUAL')}
                            >Moderated Marks to Actual</Button>
                        </div>}
                    </div>}

                    <div className={'tbl-section'}>
                        {((getCookieUserData().role === config.haaRole) && this.state.markingSheetList.length > 0) &&
                        <div className={'selectall-section'}><Input type={'checkbox'}
                                                                    checked={this.state.isSelectAllRows}
                                                                    onChange={(e) => this.onSelectAllHandler('all', e)}/>
                            <label> SELECT
                                ALL</label>
                        </div>}

                        <div className='react-dataTable'>
                            {(getCookieUserData().role !== config.haaRole) ? <DataTable
                                noHeader
                                pagination
                                data={[...data]}
                                columns={propState.type.tblAllMarks ? ASSESSMENT_MARKING_SHEET_VIEW_COLUMNS : ASSESSMENT_MARKING_SHEET_ENTER_COLUMNS}
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
                            /> : <DataTable
                                noHeader
                                pagination
                                data={[...data]}
                                columns={ASSESSMENT_MARKING_SHEET_HAA_ENTER_COLUMNS}
                                className='react-dataTable'
                                expandableRows
                                expandableRowsComponent={this.props.location.state.repeatRecommendation ? RepeatRecommendationExpandableTable : ExpandableTable}
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
                            />}
                        </div>
                    </div>

                    {this.state.markingSheetList.length > 0 && <div className={'mt-2'} align={'right'}>
                        <Button color={'primary'} className={'mr-2'} outline
                                onClick={() => this.setState({isCancelConfirm: true})}>Cancel</Button>

                        {propState.type.btnSaveAsDraft &&
                        <Button color={'primary'} className={'mr-2'} outline
                                onClick={() => this.validateTable(STUDENT_MARK_TYPES.saveAsDraft)}>
                            Save as Draft</Button>}
                        <Button color={'primary'} onClick={() => this.validateTable('PUBLISH')}>Publish</Button>
                    </div>}
                </CardBody>
            </Card>

            {this.state.isPublishConfirmation && <PublishSideConfirmation
                title={'Confirmation'}
                state={this.state.isPublishConfirmation}
                modalHandler={this.modalHandler}
                onPublishToStudent={this.onPublishToStudent}
                type={this.state.publishConfirmType}
            />}

            <ConfirmBox
                isOpen={this.state.isCancelConfirm}
                toggleModal={() => this.setState({isCancelConfirm: false})}
                yesBtnClick={() => this.props.history.goBack()}
                noBtnClick={() => this.setState({isCancelConfirm: false})}
                title="Confirmation"
                message="Are you sure to cancel?"
                icon={<HelpCircle size={40} color={themeConfig.color.primary}/>}
            />

            {this.state.isGradingScheme && <ViewGradingScheme
                isOpen={this.state.isGradingScheme}
                toggleModal={this.viewGradingModal}
                title={'Grading Scheme Information'}
                data={this.state.gradingModalData}
            />}
        </div>
    }
}

export default AssessmentsMarkingSheet
