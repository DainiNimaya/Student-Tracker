import React, {Fragment, useEffect, useState, forceRender} from 'react'
import {Button, Modal, ModalBody, Row, Col, Label, Input} from 'reactstrap'
import './scss/_courseModal.scss'
import classnames from "classnames"
import Select from 'react-select'
import {selectThemeColors, showError, findObject} from '@utils'
import {X, Edit, AlertCircle, Layers, MinusCircle, Plus, HelpCircle} from 'react-feather'
import * as apiHaa from "@api/haa"
import {DEGREE_STATUS, COURSE_TYPES} from '@const'
import {addCourseErrors, courseLevelErrors} from '@formError/headOfAcademicAdmin'
import {addCourseValidation, courseLevelValidation, Amount_REGEX, Number_REGEX} from '@validations/headOfAcademicAdmin'
import {accessList} from '@configs/basicInfomationConfig'
import cloneDeep from "lodash/cloneDeep"

class CourseModal extends React.Component {

    state = {
        courseName: '',
        courseCode: '',
        description: '',
        qualification: '',
        specialization: '',
        // courseType: [],
        school: [],
        providerCode: [],
        programCode: '',
        level: [],
        center: [],
        credits: '',
        gradingSchema: '',
        allowEdit: false,
        schoolOption: [],
        levelOption: [],
        centerOption: [],
        pCodeOptions: [],
        // typeOption: [COURSE_TYPES],
        schemeOption: [],
        error: addCourseErrors,
        tabType: 1,
        levelList: [{cmId: 0, level: '', min: '', max: '', total: ''}],
        levelListTemp: [{cmId: 0, level: '', min: '', max: '', total: ''}],
        clError: courseLevelErrors,
        aveCondition: false,
        minEM: '',
        maxEM: '',
        courseLevelConfirm: false,
        degreeStatus:[]
    }

    componentDidMount() {
        this.loadSelectData()
    }

    loadSelectData = async () => {
        const schools = await apiHaa.getAllSchools()
        const courseLevel = await apiHaa.getLevels()
        const courseCentres = await apiHaa.getAllBranches()
        const pCodes = await apiHaa.getAllProvideCode()
        const schemaResult = await apiHaa.getAllGradingSchemes(OVERALL_MARK_CALCULATION[0].value)
        const gradingSchema = []
        const tempProviderCode = []

        if (schemaResult.length !== 0) {
            schemaResult.map(schema => {
                gradingSchema.push({label: schema.gradingSchemeIdCode, value: schema.gradingSchemeId})
            })
        }

        if (pCodes.length !== 0) {
            pCodes.map(item => {
                tempProviderCode.push({label: item.providerCode, value: item.providerCodeId})
            })
        }

        if (this.props.school !== undefined) {
            this.setState({school: this.props.school})
        }

        if (this.props.courseId) {
            const course = await apiHaa.getSelectedCourse(this.props.courseId)
            if (course !== null) {

                // let type = []
                let sch = []
                let provide = []
                let degreeStatus = []
                const branch = []
                const levellist = []
                let scheme = {}

                // if (accessList.allowStudyMode && course.courseType !== null) {
                //     type = findObject(COURSE_TYPES, course.courseType)
                // }

                if (course.degreeStatus !== null) {
                    DEGREE_STATUS.map(item => {
                        if (item.value === course.degreeStatus) degreeStatus = item
                    })
                }

                if (schools.length !== 0 && course.schoolOrDepartment !== null) {
                    schools.map(item => {
                        if (item.value === course.schoolOrDepartment.schoolId) sch = item
                    })
                }

                if (tempProviderCode.length !== 0 && course.providerCode !== null) {
                    tempProviderCode.map(item => {
                        if (item.value === course.providerCode) provide = item
                    })
                }

                if (courseLevel.length !== 0 && course.level.length !== 0) {
                    course.level.map(item => {
                        courseLevel.map((levelData, index) => {
                            if (item.levelId === levelData.value) {
                                levellist.push({
                                    cmId: item.cmId,
                                    level: levelData,
                                    min: item.minCreditAmount,
                                    max: item.maxCreditAmount,
                                    total: item.totalGradeAverage
                                })
                                courseLevel.splice(index, 1)
                            }
                        })
                    })
                }

                if (gradingSchema.length !== 0) {
                    gradingSchema.map(item => {
                        if (item.value === course.gradingSchemeId) {
                            scheme = item
                        }
                    })
                }

                if (course.branch !== null && course.branch.length !== 0) {
                    course.branch.map(item => {
                        branch.push({value: item.branchId, label: item.branchName})
                    })
                }

                this.setState({
                    courseName: course.courseName === null ? '' : course.courseName,
                    courseCode: course.courseCode === null ? '' : course.courseCode,
                    description: course.courseDescription === null ? '' : course.courseDescription,
                    qualification: course.qualificationAchieve === null ? '' : course.qualificationAchieve,
                    specialization: course.specialization === null ? '' : course.specialization,
                    //courseType: type,
                    school: sch,
                    providerCode: provide,
                    programCode: course.programCode === null ? '' : course.programCode,
                    levelList: levellist,
                    levelListTemp: cloneDeep(levellist),
                    center: branch,
                    credits: course.totalCredits,
                    schoolOption: schools,
                    levelOption: courseLevel,
                    centerOption: courseCentres,
                    pCodeOptions: tempProviderCode,
                    schemeOption: gradingSchema,
                    gradingSchema: scheme,
                    minEM: course.minElectiveCount ? course.minElectiveCount : 0,
                    maxEM: course.maxElectiveCount ? course.maxElectiveCount : 0,
                    degreeStatus
                })
            }
        } else {
            this.setState({
                schoolOption: schools,
                levelOption: courseLevel,
                centerOption: courseCentres,
                pCodeOptions: tempProviderCode,
                schemeOption: gradingSchema
            })
        }
    }

    toggleModal = () => {
        this.props.modalFunction({type: 'close'})
    }

    handleCourse = async () => {

        const {
            courseName, courseCode, qualification, courseType, school, providerCode, programCode, level, credits,
            description, specialization, center, levelList, gradingSchema, minEM, maxEM, degreeStatus
        } = this.state

        const data = {
            courseId: this.props.courseId ?? null,
            courseName,
            courseCode,
            description,
            qualification,
            specialization,
            courseType,
            school,
            providerCode,
            programCode,
            levelList,
            center,
            gradingSchema,
            minEM,
            maxEM,
            degreeStatus
        }
        const result = await apiHaa.createEditCourse(data)
        if (result === 0) {
            this.setState({courseLevelConfirm: false})
            this.props.callback()
        }
    }

    checkValidation = () => {

        const {
            courseName, courseCode, qualification, courseType, school, providerCode, programCode, level, credits,
            description, specialization, center, levelList, gradingSchema, minEM, maxEM, degreeStatus
        } = this.state

        const res = addCourseValidation(courseName, courseCode, qualification, courseType, school, providerCode,
            programCode, gradingSchema, minEM, maxEM, center, degreeStatus)
        const clRes = courseLevelValidation(levelList)

        let gradeAveCondition = false
        if (levelList.length !== 0) {
            let sum = 0
            levelList.map(data => {
                sum += Number(data.total)
            })
            gradeAveCondition = sum === 100
        }

        if (res.courseName || res.courseCode || res.qualification || res.courseType || res.school || res.providerCode
            || res.program || res.gradingSchema || res.minEM || res.maxEM || res.degreeStatus) {
            this.setState({error: res, clError: clRes, tabType: 1, aveCondition: !gradeAveCondition})
        } else {
            this.setState({error: res, clError: clRes, aveCondition: !gradeAveCondition})
        }

        if (clRes.dataValues || !gradeAveCondition) return
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }

        this.handleCourse()
    }

    checkLevelIsChanged = () => {
        if (this.props.manageType === "edit") {
            let lvlChangedCount = 0
            const level = this.state.levelList
            const levelTemp = this.state.levelListTemp
            level.map((lvl, i) => {
                if (level[i]?.level?.value !== levelTemp[i]?.level?.value) {
                    lvlChangedCount += 1
                }
            })

            if (lvlChangedCount > 0) {
                this.setState({courseLevelConfirm: true})
                return false
            } else {
                this.checkValidation()
            }
        }

        return true
    }

    handleAllowEdit = (data) => {
        this.setState({allowEdit: data})
    }

    handleTabType = (data) => {
        if (data === 2) {
            const {
                courseName, courseCode, qualification, courseType, school, providerCode, programCode, level, credits,
                description, specialization, center, levelList, gradingSchema, minEM, maxEM, degreeStatus
            } = this.state

            const res = addCourseValidation(courseName, courseCode, qualification, courseType, school, providerCode,
                programCode, gradingSchema, minEM, maxEM, center, degreeStatus)
            this.setState({error: res})
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }
            this.setState({tabType: data})
        } else {
            this.setState({tabType: data})
        }

    }

    onChangeAction = (type, e) => {
        if (type === 'tbl') {
            const temp = this.state.levelList
            const name = [e.target.name].toString()
            switch (name.split('-')[1]) {
                case 'max':
                    if (Amount_REGEX.test(e.target.value)) temp[Number(name.split('-')[0])].max = e.target.value
                    break
                case 'min':
                    if (Amount_REGEX.test(e.target.value)) temp[Number(name.split('-')[0])].min = e.target.value
                    break
                case 'total':
                    if (Amount_REGEX.test(e.target.value) && e.target.value <= 100) temp[Number(name.split('-')[0])].total = e.target.value
                    break
            }
            this.setState({levelList: temp})
        } else {
            // if (e.target.name === 'courseName' || e.target.name === 'qualification' || e.target.name === 'specialization') {
            //     if (e.target.value.length < 40) { this.setState({[e.target.name] : e.target.value}) }
            // } else if (e.target.name === 'courseCode' || e.target.name === 'programCode') {
            //     if (e.target.value.length < 20) { this.setState({[e.target.name] : e.target.value}) }
            // } else if (e.target.name === 'minEM' || e.target.name === 'maxEM') {
            //     if (Number_REGEX.test(e.target.value) || e.target.value === '') { this.setState({[e.target.name] : e.target.value}) }
            // } else { this.setState({[e.target.name] : e.target.value}) }

            if (e.target.name === 'minEM' || e.target.name === 'maxEM') {
                if (Number_REGEX.test(e.target.value) || e.target.value === '') {
                    this.setState({[e.target.name]: e.target.value})
                }
            } else {
                this.setState({[e.target.name]: e.target.value})
            }
        }
    }

    onDropDownHandler = (type, id, e) => {
        switch (type) {
            case 'tbl' :
                this.state.levelOption.map((item, index) => {
                    if (item === e) {
                        this.state.levelOption.splice(index, 1)
                    }
                })

                const temp = this.state.levelList
                if (this.state.levelList[id].level !== '') this.state.levelOption.push(this.state.levelList[id].level)
                temp[id].level = e
                this.setState({levelList: temp})
                break
            case 'courseType' :
                this.setState({courseType: e})
                break
            case 'school' :
                this.setState({school: e})
                break
            case 'providerCode' :
                this.setState({providerCode: e})
                break
            case 'degreeStatus' :
                this.setState({degreeStatus: e})
                break
            case 'gradingSchema' :
                this.setState({gradingSchema: e})
                break
            case 'center' :
                this.setState({center: e})
                break
        }
    }

    addRowAction = () => {
        this.state.levelList.push({cmId: 0, level: '', min: '', max: '', total: ''})
        this.setState({clError: courseLevelErrors})
    }

    removeRowAction = (id) => {
        if (this.state.levelList[id].level !== '') this.state.levelOption.push(this.state.levelList[id].level)
        this.state.levelList.length === 1 ? this.setState({
                levelList: [
                    {
                        cmId: 0,
                        level: '',
                        min: '',
                        max: '',
                        total: ''
                    }
                ]
            })
            : this.state.levelList.splice(id, 1)
        this.forceUpdate()
    }


    render() {

        const {
            courseName, courseCode, qualification, courseType, school, providerCode, programCode, typeOption,
            schemeOption, schoolOption, pCodeOptions, centerOption, gradingSchema, level, credits, description,
            specialization, center, levelList, tabType, error, clError, aveCondition, maxEM, minEM, allowEdit,degreeStatus
        } = this.state
        const tableData = []
        const reacOnlyCondition = this.props.manageType === 'edit' && !this.state.allowEdit
        let total_credits = 0
        let totalGradeAverage = 0

        if (levelList.length !== 0) {
            levelList.map((item, i) => {
                total_credits += Number(item.min)
                item.total !== '' && (totalGradeAverage += Number.parseInt(item.total))
                tableData.push(
                    {
                        level: <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            theme={selectThemeColors}
                            className={classnames('react-select', {'is-invalid': clError.dataValues && item.level === ''})}
                            classNamePrefix='select'
                            value={item.level}
                            options={this.state.levelOption}
                            isClearable={false}
                            onChange={(e) => this.onDropDownHandler('tbl', i, e)}
                            placeholder={'Select level type'}
                            isDisabled={reacOnlyCondition}
                        />,
                        min: <Input name={`${i}-min`} value={item.min}
                                    invalid={clError.dataValues && (item.min === '' || Number(item.min) === 0)}
                                    placeholder={'Min credits'}
                                    onChange={(e) => this.onChangeAction('tbl', e)} autoComplete={'off'}
                                    readOnly={reacOnlyCondition}/>,
                        max: <>
                            <Input name={`${i}-max`} value={item.max}
                                   invalid={clError.dataValues && (item.max === '' || Number(item.max) === 0 || Number(item.min) > Number(item.max))}
                                   placeholder={'Max credits'}
                                   onChange={(e) => this.onChangeAction('tbl', e)} autoComplete={'off'}
                                   readOnly={reacOnlyCondition}/>
                            {
                                clError.dataValues && (item.max === '' || Number(item.max) === 0 || Number(item.min) > Number(item.max)) &&
                                <p style={{color: 'red', fontSize: '9px', position: 'absolute'}}>Value must be greater
                                    than min credit</p>
                            }
                        </>,
                        total: <Input name={`${i}-total`} value={item.total}
                                      invalid={clError.dataValues && item.total === ''}
                                      placeholder={'Total grade average'}
                                      onChange={(e) => this.onChangeAction('tbl', e)} autoComplete={'off'}
                                      readOnly={reacOnlyCondition}/>,
                        remove: <MinusCircle className={'remove-icon'}
                                             onClick={reacOnlyCondition ? null : () => this.removeRowAction(i)}/>
                    }
                )
            })
        }

        return (<>
            <Modal
                isOpen={this.props.visible}
                // toggle={() => this.toggleModal()}
                className={`modal-dialog-centered modal-lg`}
                style={{maxWidth: '1000px'}}
            >
                <ModalBody className={'course-modal'}>
                    <Row className={'heading-div'}>
                        <Col
                            xs={10}><Label>{this.props.manageType !== 'edit' ? 'Add New Course' : !allowEdit ? 'Course Information' : 'Edit Course Information'}</Label></Col>
                        <Col xs={2}>
                            {
                                this.props.manageType === 'edit' && !allowEdit &&
                                <Button className='me-1' outline color='primary'
                                        onClick={() => this.handleAllowEdit(true)}>
                                    <Edit size={13} id={'edit-icon'}/>Edit</Button>
                            }
                            <X id={'close-icon'} onClick={() => this.toggleModal()}/>
                        </Col>
                    </Row>
                    <Fragment>
                        <div className={'course-form'}>
                            <Row>
                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={4}><Label>Course Name<span>*</span></Label></Col>
                                        <Col xs={8}><Input value={courseName} name='courseName'
                                                           readOnly={reacOnlyCondition}
                                                           onChange={(e) => this.onChangeAction('fld', e)}
                                                           placeholder={'Course name'}
                                                           invalid={error.courseName && courseName === ''}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={4}><Label>Course Code<span>*</span></Label></Col>
                                        <Col xs={8}><Input value={courseCode} name='courseCode'
                                                           readOnly={reacOnlyCondition}
                                                           onChange={(e) => this.onChangeAction('fld', e)}
                                                           placeholder={'Course code'}
                                                           invalid={error.courseCode && courseCode === ''}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row className={'field-row'}>
                                        <Col xs={2}><Label>Course Description</Label></Col>
                                        <Col xs={10}><Input type='textarea' value={description}
                                                            name='description'
                                                            maxLength={250}
                                                            readOnly={reacOnlyCondition}
                                                            placeholder={'Course description'}
                                                            onChange={(e) => this.onChangeAction('fld', e)}/>
                                            <span className='wordCount'>{`${description.length}/250`}</span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={4}><Label>Type of course<span>*</span></Label></Col>
                                        <Col xs={8}>
                                            <Select
                                                theme={selectThemeColors}
                                                className={classnames('react-select', {'is-invalid': error.courseType && courseType.length === 0})}
                                                classNamePrefix='select'
                                                // defaultValue={programOptions[0]}
                                                value={courseType}
                                                options={COURSE_TYPES}
                                                isClearable={false}
                                                onChange={(e) => this.onDropDownHandler('courseType', 0, e)}
                                                placeholder={'Select type'}
                                                isDisabled={reacOnlyCondition}
                                            />
                                        </Col>
                                    </Row>
                                </Col>

                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={4}><Label>Programme<span>*</span></Label></Col>
                                        <Col xs={8}>
                                            <Select
                                                theme={selectThemeColors}
                                                className={classnames('react-select', {'is-invalid': error.school && school.length === 0})}
                                                classNamePrefix='select'
                                                // defaultValue={programOptions[0]}
                                                value={school}
                                                options={schoolOption}
                                                isClearable={false}
                                                onChange={(e) => this.onDropDownHandler('school', 0, e)}
                                                placeholder={'Select programme'}
                                                isDisabled={reacOnlyCondition}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={4}><Label>Study Mode<span>*</span></Label></Col>
                                        <Col xs={8}>
                                            <Select
                                                theme={selectThemeColors}
                                                className={classnames('react-select', {'is-invalid': error.school && school.length === 0})}
                                                classNamePrefix='select'
                                                // defaultValue={programOptions[0]}
                                                value={school}
                                                options={schoolOption}
                                                isClearable={false}
                                                onChange={(e) => this.onDropDownHandler('school', 0, e)}
                                                placeholder={'Select study mode'}
                                                isDisabled={reacOnlyCondition}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={4}><Label>Total Credits<span>*</span></Label></Col>
                                        <Col xs={8}><Input value={programCode} name='programCode'
                                                           readOnly={reacOnlyCondition}
                                                           placeholder={'Program code'}
                                                           onChange={(e) => this.onChangeAction('fld', e)}
                                                           invalid={error.programCode && programCode === ''}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={6}>
                                    <Row className={'field-row'}>
                                        <Col xs={4}><Label>Elective
                                            Module<span>*</span></Label></Col>
                                        <Col xs={8}><Input value={minEM} name='minEM'
                                                           readOnly={reacOnlyCondition}
                                                           placeholder={'Minimum elective module'}
                                                           onChange={(e) => this.onChangeAction('fld', e)}
                                                           invalid={error.minEM && minEM === ''}/>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        <div className={'btn-div'}>
                            {tabType === 1 && <Button outline color='primary' size={'md'} className='me-1'
                                                      onClick={() => this.toggleModal()}>Cancel</Button>}
                            {tabType === 2 && <Button outline color='primary' size={'md'} className='me-1'
                                                      onClick={() => this.handleTabType(1)}>Back</Button>}
                            {tabType === 1 &&
                                <Button color='primary' size={'md'} onClick={() => this.handleTabType(2)}>Next</Button>}
                            {this.props.manageType === 'add' && tabType === 2 &&
                                <Button color='primary' size={'md'}
                                        onClick={() => this.checkValidation()}>Save</Button>}
                            {this.props.manageType === 'edit' && tabType === 2 && this.state.allowEdit &&
                                <Button color='primary' size={'md'} onClick={() => this.checkLevelIsChanged()}>Save
                                    Changes</Button>}
                        </div>
                    </Fragment>
                </ModalBody>
            </Modal>
        </>)
    }
}

export default CourseModal
