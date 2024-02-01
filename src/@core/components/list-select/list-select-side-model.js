import {Alert, Button, CardTitle, Col, Input, Label, Offcanvas, OffcanvasBody, OffcanvasHeader, Row} from 'reactstrap'
import React, {useEffect, useState} from "react"
import {MinusCircle, PlusCircle, Info, AlertCircle} from "react-feather"
import Avatar from '@components/avatar'
import AvatarII from '@components/avatar/avatar'
import './_courseSetup.scss'
import Flatpickr from 'react-flatpickr'
import {classSetupNewClassError} from "@formError/headOfAcademicAdmin"
import {
    addClassValidation,
    assessmentValidation,
    changeClassValidation,
    addModuleGpaNonGpaValidation
} from "@validations/headOfAcademicAdmin"
import Select from "react-select"
import classnames from "classnames"
import {findObject, selectThemeColors, showError, titleCase, findFileDataUrl} from '@utils'
import Required from "@components/required"
import {gpaNonGpa, manageSetup} from '@strings'
import {toast} from "react-toastify"
import {MODULE_TYPE} from '@const'
import ConfirmBox from "@components/confirm-box"
import themeConfig from '@configs/themeConfig'
import FileUploader from '@components/file-uploader/FileUploaderMultiple'

export default ({
                    toggleOpen,
                    open,
                    title,
                    subTitle,
                    onAdd,
                    inputPlaceholder,
                    list,
                    list2,
                    onSave,
                    avatar,
                    startAndEnd,
                    changeClass,
                    classSetup,
                    selectedValue,
                    batches,
                    module,
                    assessment,
                    lecturers,
                    moderators,
                    courseSetup,
                    selectedAssessmentDate,
                    selectedClass,
                    showGpaCalculation,
                    gpaCalculationData,
                    totalCredits,
                    refreshLevels,
                    isLevelWiseOrientation,
                    onListSelect
                }) => {

    const [data, setData] = useState([])
    const [tempData, setTempData] = useState(data)
    const [newClass, setClass] = useState({
        startDate: undefined,
        endDate: undefined,
        autoAdd: true,
        classCode: '',
        classId: '',
        batchId: [],
        class: undefined,
        className: ''
    })
    const [assessmentDate, setAssessmentDate] = useState({
        assessmentCode: '',
        assessmentDateId: undefined,
        uploader: undefined,
        moderator: undefined,
        issueDate: undefined,
        submissionDate: undefined,
        returnDate: undefined
    })

    const [error, setError] = useState(classSetupNewClassError)
    const [totalFinalGpaCredit, setTotalFinalGpaCredit] = useState(totalCredits ? totalCredits.totalGpa : 0)
    const [totalFinalElectiveGpaCredit, setTotalFinalElectiveGpaCredit] = useState(totalCredits ? totalCredits.totalElectiveGpa : 0)
    const [totalFinalNonGpaCredit, setTotalFinalNonGpaCredit] = useState(totalCredits ? totalCredits.totalNonGpa : 0)
    const [totalFinalElectiveNonGpaCredit, setTotalFinalElectiveNonGpaCredit] = useState(totalCredits ? totalCredits.totalElectiveNonGpa : 0)
    const [updateConfirmation, setUpdateConfirmation] = useState(false)
    const [imgFile, setImgFile] = useState([])
    const courseAppliedStatus = ['light-warning', 'light-success', 'light-danger', 'light-info', 'light-secondary']

    useEffect(() => {
        if (list) {
            const data = list.map(item => {
                return {...item, selected: false}
            })
            setData(data)
            tempData.length === 0 && setTempData(data)
        }
        if (selectedAssessmentDate) {
            setAssessmentDate({
                assessmentCode: selectedAssessmentDate.code,
                assessmentDateId: selectedAssessmentDate.assessmentDateId,
                uploader: findObject(lecturers, selectedAssessmentDate.uploaderId),
                moderator: findObject(moderators, selectedAssessmentDate.modaratorId),
                issueDate: selectedAssessmentDate.issueDate,
                submissionDate: selectedAssessmentDate.submissionDate,
                returnDate: selectedAssessmentDate.returnDate
            })
        }
        if (selectedClass) {
            const tempBatch = selectedClass.batches.map(item => {
                return findObject(batches, item)
            })

            setClass({
                isStudentAssigned: selectedClass.studentAssigned,
                startDate: selectedClass.from,
                autoAdd: selectedClass.autoAdd,
                endDate: selectedClass.to,
                classCode: selectedClass.classCode,
                classId: selectedClass.classId,
                batchId: tempBatch[0] ? tempBatch : [],
                class: undefined,
                className: selectedClass.className
            })
        }
    }, [])

    const onSearchHandler = async (e) => {
        const val = e.target.value.trim()
        if (val === '') {
            await setTempData(data)
        } else {
            const filtered = await data.filter(i => {
                return i.name.toLowerCase().includes(val.toLowerCase()) || (i.code && i.code.toLowerCase().includes(val.toLowerCase()))
            })
            await setTempData(filtered)
        }
    }

    const onChangeValue = async e => {
        const name = e.target.name
        switch (name) {
            case 'imageFile':
                const result = await findFileDataUrl(e.target.files)
                setImgFile(result.files)
                break
        }
    }

    const getRandomInt = () => {
        const min = Math.ceil(0)
        const max = Math.floor(courseAppliedStatus.length - 1)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const save = async () => {
        if (list) {
            if (showGpaCalculation) {
                const res = addModuleGpaNonGpaValidation(totalFinalGpaCredit, totalFinalNonGpaCredit, totalFinalElectiveGpaCredit, totalFinalElectiveNonGpaCredit, gpaCalculationData)
                for (const key in res) {
                    if (res[key]) {
                        return
                    }
                }
            }

            const arr = []
            tempData.map(item => item.selected && arr.push(item))
            await onSave(arr)

            if (showGpaCalculation) {
                await refreshLevels()
            }
        }
        if (classSetup) {
            const res = addClassValidation(newClass)
            setError(res)
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }
            newClass.isStudentAssigned ? setUpdateConfirmation(true) : onSave(newClass)
        }
        if (assessment) {
            const res = assessmentValidation(assessmentDate)
            setError(res)
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }
            onSave(assessmentDate)
        }
        if (changeClass) {
            const res = changeClassValidation(newClass)
            setError(res)
            for (const key in res) {
                if (res[key]) {
                    showError()
                    return
                }
            }
            onSave(newClass.class)
        }
    }

    let count = 0
    tempData.map(item => {
        item.selected ? count += 1 : null
    })

    let min = undefined, max = undefined
    if (classSetup) {
        const st = [], en = []
        newClass.batchId.map(item => {
            const batch = findObject(batches, item.value)
            st.push(batch.startDate)
            en.push(batch.endDate)
        })

        if (st.length > 0) {
            min = st.reduce((a, b) => (new Date(a) > new Date(b) ? a : b))
            max = en.reduce((a, b) => (new Date(a) < new Date(b) ? a : b))
        }
    }

    const addModule = (index, item) => {
        if (showGpaCalculation) {
            const tempGpa = totalCredits.totalGpa + item.noOfCredits
            const tempNonGpa = totalCredits.totalNonGpa + item.noOfCredits
            let isValidated = false

            if (item.moduleType === MODULE_TYPE[0].value) {
                if (item.consideringForGpaCalculation) {
                    if (tempGpa > gpaCalculationData.minCreditLimit) {
                        if (!item.used) {
                            toast.warning(gpaNonGpa.gpaCreditExceeded, {icon: true, hideProgressBar: true})
                        } else {
                            isValidated = true
                        }
                    } else {
                        if (!item.used) {
                            totalCredits.totalGpa = totalCredits.totalGpa + item.noOfCredits
                            setTotalFinalGpaCredit(totalFinalGpaCredit + item.noOfCredits)
                        }
                        isValidated = true
                    }
                } else {
                    if (tempNonGpa > (gpaCalculationData.maxCreditLimit - gpaCalculationData.minCreditLimit)) {
                        if (!item.used) {
                            toast.warning(gpaNonGpa.nonGpaCreditExceeded, {icon: true, hideProgressBar: true})
                        } else {
                            isValidated = true
                        }
                    } else {
                        if (!item.used) {
                            totalCredits.totalNonGpa = totalCredits.totalNonGpa + item.noOfCredits
                            setTotalFinalNonGpaCredit(totalFinalNonGpaCredit + item.noOfCredits)
                        }
                        isValidated = true
                    }
                }
            } else {
                if (item.consideringForGpaCalculation) {
                    if (!item.used) {
                        totalCredits.totalElectiveGpa = totalCredits.totalElectiveGpa + item.noOfCredits
                        setTotalFinalElectiveGpaCredit(totalFinalElectiveGpaCredit + item.noOfCredits)
                    }
                } else {
                    if (!item.used) {
                        totalCredits.totalElectiveNonGpa = totalCredits.totalElectiveNonGpa + item.noOfCredits
                        setTotalFinalElectiveNonGpaCredit(totalFinalElectiveNonGpaCredit + item.noOfCredits)
                    }
                }
                isValidated = true
            }

            if (isValidated) {
                const arr = [...tempData]
                arr[index].selected = !arr[index].selected
                setData(arr)
            }
        } else {
            const arr = [...tempData]
            arr[index].selected = !arr[index].selected
            setData(arr)
        }
    }

    const removeModule = (index, item) => {
        if (showGpaCalculation) {
            if (item.moduleType === MODULE_TYPE[0].value) {
                if (item.consideringForGpaCalculation) {
                    if (!item.used) {
                        totalCredits.totalGpa = totalCredits.totalGpa - item.noOfCredits
                        setTotalFinalGpaCredit(totalFinalGpaCredit - item.noOfCredits)
                    }
                } else {
                    if (!item.used) {
                        totalCredits.totalNonGpa = totalCredits.totalNonGpa - item.noOfCredits
                        setTotalFinalNonGpaCredit(totalFinalNonGpaCredit - item.noOfCredits)
                    }
                }
            } else {
                if (item.consideringForGpaCalculation) {
                    if (!item.used) {
                        setTotalFinalGpaCredit(totalFinalGpaCredit - item.noOfCredits)
                    }
                } else {
                    if (!item.used) {
                        setTotalFinalNonGpaCredit(totalFinalNonGpaCredit - item.noOfCredits)
                    }
                }
            }

            const arr = [...tempData]
            arr[index].selected = !arr[index].selected
            setData(arr)
        } else {
            const arr = [...tempData]
            arr[index].selected = !arr[index].selected
            setData(arr)
        }
    }

    return <Offcanvas
        scrollable={true}
        backdrop={true}
        direction='end'
        isOpen={open}
        toggle={toggleOpen}>
        <OffcanvasHeader toggle={toggleOpen}>{title}</OffcanvasHeader>
        <OffcanvasBody className='mx-0 flex-grow-0 overflow-auto'>
            <Row>
                {
                    module && <CardTitle className="cardTitle mb-05" tag='h4'>{module}</CardTitle>
                }
                {
                    subTitle &&
                    <div className="d-flex flex-row justify-content-between align-items-center mb-2">

                        <CardTitle className="cardTitle-sm mb-0" tag='h4'>{subTitle}</CardTitle>
                        {
                            showGpaCalculation && <div className={'gpa-calculation-container align-items-right'}>
                                <Label>Core GPA {totalCredits.totalGpa}/{gpaCalculationData.minCreditLimit}</Label>
                                <Label>Core Non
                                    GPA {totalCredits.totalNonGpa}/{(gpaCalculationData.maxCreditLimit - gpaCalculationData.minCreditLimit)}</Label>
                            </div>
                        }

                        {
                            onAdd && <Button size='sm' color='primary' type='button'
                                             onClick={onAdd}>+ {isLevelWiseOrientation ? 'Create' : 'Add'}</Button>
                        }
                    </div>
                }

                {
                    list &&
                    <Col sm={12} className="mb-2">
                        <Input
                            placeholder={inputPlaceholder}
                            onChange={onSearchHandler}
                        />
                    </Col>
                }

                {
                    courseSetup && tempData.map((item, index) => {

                        return <Col
                            key={index}
                            sm={12}
                            className="mb-05 cursor-pointer pl-1 pr-1">
                            <div
                                className="d-flex flex-row justify-content-between align-items-center border p-1 item-hover">
                                <div style={{maxWidth: '90%'}}>
                                    <AvatarII count={item.count} name={item.name}
                                              code={`${titleCase(item.moduleType)} (${item.noOfCredits} Credits)`}/>
                                    <div style={{
                                        marginLeft: 40,
                                        fontSize: 14
                                    }}>{item.consideringForGpaCalculation ? 'GPA Calculated' : 'GPA Not Calculated'}</div>
                                </div>
                                {/*<p className="mb-0">{item.name}</p>*/}
                                {
                                    !item.selected ?
                                        <PlusCircle onClick={() => addModule(index, item)} size={20} color={themeConfig.color.primary}/> :
                                        <MinusCircle onClick={() => removeModule(index, item)} size={20}
                                                     color='#EA5455'/>
                                }
                            </div>
                        </Col>
                    })
                }

                {
                    (!avatar && !courseSetup) && tempData.map((item, index) => {

                        return <Col
                            key={index}
                            sm={12}
                            className="mb-05 cursor-pointer pl-1 pr-1">
                            <div
                                className="d-flex flex-row justify-content-between align-items-center border p-1 item-hover"
                                onClick={() => {
                                    if (isLevelWiseOrientation) {
                                        onListSelect(item)
                                    } else {
                                        const arr = [...tempData]
                                        arr[index].selected = !arr[index].selected
                                        setData(arr)
                                    }
                                }}
                            >
                                <p className="mb-0">{item.name}</p>
                                {
                                    !item.selected ?
                                        <PlusCircle size={20} color={themeConfig.color.primary}/> :
                                        <MinusCircle size={20} color='#EA5455'/>
                                }
                            </div>

                            {
                                (startAndEnd && item.selected) &&
                                <Row>
                                    <Col sm={6} className="mt-1 mb-1">
                                        <Label className='form-label' for='basicInput'>
                                            Start Date
                                        </Label>
                                        <Flatpickr
                                            className='form-control'
                                            value={item.startDate}
                                            placeholder="From"
                                            options={{
                                                minDate: list ? item.startDate : 'today',
                                                maxDate: list || item.endDate ? item.endDate : undefined
                                            }}
                                            onChange={value => {
                                                const arr = [...tempData]
                                                arr[index].startDate = value[0]
                                                setData(arr)
                                            }}
                                            id='from'/>
                                    </Col>
                                    <Col sm={6} className="mt-1 mb-1">
                                        <Label className='form-label' for='basicInput'>
                                            End Date
                                        </Label>
                                        <Flatpickr
                                            className='form-control'
                                            value={item.endDate}
                                            placeholder="To"
                                            options={{
                                                minDate: list ? item.startDate : item.startDate ?? 'today'
                                            }}
                                            onChange={value => {
                                                const arr = [...tempData]
                                                arr[index].endDate = value[0]
                                                setData(arr)
                                            }}
                                            id='to'/>
                                    </Col>
                                </Row>
                            }
                        </Col>
                    })
                }

                {
                    avatar && tempData.map((item, index) => {
                        let con = item.name.split(' ')[0]

                        if (item.name.split(' ').length > 1) {
                            con = `${item.name.split(' ')[0]} ${item.name.split(' ')[1]}`
                        }
                        return <Col
                            key={index}
                            sm={12}
                            className="mb-05 cursor-pointer pl-1 pr-1 item-hover">
                            <div
                                className="d-flex flex-row justify-content-between align-items-center pt-1 pb-1"
                                onClick={() => {
                                    const arr = [...tempData]
                                    arr[index].selected = !arr[index].selected
                                    setData(arr)
                                }}
                            >
                                <div className="d-flex flex-row align-items-center">
                                    <div className={'initial-round mr-05'}>
                                        <Avatar color={courseAppliedStatus[getRandomInt()]} content={con} initials/>
                                    </div>
                                    <div className={'text-content'}>
                                        <div className={'content-name'}>{item.name}</div>
                                        {
                                            item.code && <span className={'content-name'}>{item.code}</span>
                                        }
                                    </div>
                                </div>
                                {
                                    !item.selected ?
                                        <PlusCircle size={20} color={themeConfig.color.primary}/> :
                                        <MinusCircle size={20} color='#EA5455'/>
                                }

                            </div>
                        </Col>
                    })
                }

                {
                    assessment && <>
                        <Col className='mb-1' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                Assignment Code<Required/>
                            </Label>
                            <Input
                                type='text'
                                placeholder="Enter assignment code"
                                value={assessmentDate.assessmentCode}
                                onChange={e => {
                                    const arr = {...assessmentDate}
                                    arr.assessmentCode = e.target.value
                                    setAssessmentDate(arr)
                                }}
                                invalid={error.assessmentCode}
                            />
                        </Col>

                        <Col className='mb-1' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                Assignment Creator<Required/>
                            </Label>
                            <Select
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                value={assessmentDate.uploader}
                                onChange={e => {
                                    const arr = {...assessmentDate}
                                    arr.uploader = e
                                    setAssessmentDate(arr)
                                }}
                                className={classnames('react-select', {'is-invalid': error.uploader})}
                                theme={selectThemeColors}
                                classNamePrefix='select'
                                options={lecturers}
                                isClearable={false}
                                placeholder="Select Creator"
                            />
                        </Col>

                        <Col className='mb-1' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                Verifier<Required/>
                            </Label>
                            <Select
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                value={assessmentDate.moderator}
                                onChange={e => {
                                    const arr = {...assessmentDate}
                                    arr.moderator = e
                                    setAssessmentDate(arr)
                                }}
                                className={classnames('react-select', {'is-invalid': error.moderator})}
                                theme={selectThemeColors}
                                classNamePrefix='select'
                                options={moderators}
                                isClearable={false}
                                placeholder="Select Verifier"
                            />
                        </Col>

                        <Col sm={12} className="mb-1">
                            <Label className='form-label' for='basicInput'>
                                Issue Date<Required/>
                            </Label>
                            <Flatpickr
                                className={`form-control not-disabled ${error.issueDate ? 'validation-error-date-picker' : ''}`}
                                value={assessmentDate.issueDate}
                                placeholder="Issue date"
                                options={{minDate: selectedAssessmentDate ? '' : 'today'}}
                                onChange={value => {
                                    const arr = {...assessmentDate}
                                    arr.issueDate = value[0]
                                    setAssessmentDate(arr)
                                }}/>
                        </Col>
                        <Col sm={12} className="mb-1">
                            <Label className='form-label' for='basicInput'>
                                Submission Date<Required/>
                            </Label>
                            <Flatpickr
                                className={`form-control not-disabled ${error.submissionDate ? 'validation-error-date-picker' : ''}`}
                                value={assessmentDate.submissionDate}
                                placeholder="Submission date"
                                options={{minDate: selectedAssessmentDate ? assessmentDate.issueDate : (assessmentDate.issueDate ?? 'today')}}
                                onChange={value => {
                                    const arr = {...assessmentDate}
                                    arr.submissionDate = value[0]
                                    setAssessmentDate(arr)
                                }}/>
                        </Col>
                        <Col sm={12} className="mb-1">
                            <Label className='form-label' for='basicInput'>
                                Return Date<Required/>
                            </Label>
                            <Flatpickr
                                className={`form-control not-disabled ${error.returnDate ? 'validation-error-date-picker' : ''}`}
                                value={assessmentDate.returnDate}
                                placeholder="Return date"
                                options={{minDate: selectedAssessmentDate ? assessmentDate.submissionDate : (assessmentDate.submissionDate ?? 'today')}}
                                onChange={value => {
                                    const arr = {...assessmentDate}
                                    arr.returnDate = value[0]
                                    setAssessmentDate(arr)
                                }}/>
                        </Col>
                        <Col lg={12}>
                            <Label>Attachment</Label>
                            <FileUploader
                                uploaderType={'student'}
                                onSelect={files => onChangeValue({target: {name: 'imageFile', files}})}
                            />
                        </Col>
                    </>
                }

                {
                    classSetup && <>
                        <Col className='mb-1' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                Class Code
                            </Label>
                            <Input
                                type='text'
                                placeholder="Enter class code"
                                value={newClass.classCode}
                                onChange={e => {
                                    const arr = {...newClass}
                                    arr.classCode = e.target.value
                                    setClass(arr)
                                }}
                                invalid={error.classCode}
                            />
                        </Col>

                        <Col className='mb-1' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                Class Name
                            </Label>
                            <Input
                                type='text'
                                placeholder="Enter class name"
                                value={newClass.className}
                                onChange={e => {
                                    const arr = {...newClass}
                                    arr.className = e.target.value
                                    setClass(arr)
                                }}
                                invalid={error.className}
                            />
                        </Col>
                        <Col className='mb-1' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                Batch
                            </Label>
                            <Select
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                value={newClass.batchId}
                                onChange={e => {
                                    const arr = {...newClass}
                                    arr.batchId = e
                                    arr.startDate = undefined
                                    arr.endDate = undefined
                                    setClass(arr)
                                }}
                                className={classnames('react-select', {'is-invalid': error.batchId})}
                                theme={selectThemeColors}
                                classNamePrefix='select'
                                options={batches}
                                isMulti
                                isClearable={false}
                                placeholder="Select Batch"
                            />
                        </Col>
                        {
                            newClass.batchId.length > 0 &&
                            <>
                                <Col sm={6} className="mb-1">
                                    <Label className='form-label' for='basicInput'>
                                        Start Date
                                    </Label>
                                    <Flatpickr
                                        className={`form-control not-disabled ${error.startDate ? 'validation-error-date-picker' : ''}`}
                                        value={newClass.startDate}
                                        placeholder="From"
                                        options={{
                                            minDate: min,
                                            maxDate: max
                                        }}
                                        onChange={value => {
                                            const arr = {...newClass}
                                            arr.startDate = value[0]
                                            setClass(arr)
                                        }}
                                        id='from'/>
                                </Col>
                                <Col sm={6} className="mb-1">
                                    <Label className='form-label' for='basicInput'>
                                        End Date
                                    </Label>
                                    <Flatpickr
                                        className={`form-control not-disabled ${error.endDate ? 'validation-error-date-picker' : ''}`}
                                        value={newClass.endDate}
                                        placeholder="To"
                                        options={{
                                            minDate: newClass.startDate ?? min,
                                            maxDate: max
                                        }}
                                        onChange={value => {
                                            const arr = {...newClass}
                                            arr.endDate = value[0]
                                            setClass(arr)
                                        }}
                                        id='to'/>
                                </Col>

                                <div className='mt-1 mb-1'>
                                    <Label className='form-label' for='basicInput'>
                                        Assign students to class
                                    </Label>

                                    <div className='form-check mb-05 mt-05'>
                                        <Input type='radio' id={`auto`} name='auto'
                                               onChange={e => {
                                                   const arr = {...newClass}
                                                   arr.autoAdd = true
                                                   setClass(arr)
                                               }}
                                               checked={newClass.autoAdd}
                                               invalid={error.studyMode}/>
                                        <Label className='form-check-label' for={`auto`}>
                                            Automatically
                                        </Label>
                                    </div>
                                    <div className='form-check mb-05'>
                                        <Input type='radio' id={`manual`} name='manual'
                                               onChange={e => {
                                                   const arr = {...newClass}
                                                   arr.autoAdd = false
                                                   setClass(arr)
                                               }}
                                               checked={!newClass.autoAdd}
                                               invalid={error.studyMode}/>
                                        <Label className='form-check-label' for={`manual`}>
                                            Manual
                                        </Label>
                                    </div>
                                </div>
                            </>
                        }
                    </>
                }

                {
                    changeClass && <>
                        <Col className='mb-1' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                Current Class
                            </Label>
                            <Input
                                type='text'
                                placeholder="Enter class"
                                value={selectedValue.name}
                                readOnly
                            />
                        </Col>

                        <Col className='mb-2' sm='12'>
                            <Label className='form-label' for='basicInput'>
                                New Class
                            </Label>
                            <Select
                                menuPortalTarget={document.body}
                                styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                                value={newClass.class}
                                onChange={e => {
                                    const arr = {...newClass}
                                    arr.class = e
                                    setClass(arr)
                                }}
                                className={classnames('react-select', {'is-invalid': error.className})}
                                theme={selectThemeColors}
                                classNamePrefix='select'
                                options={list2}
                                isClearable={false}
                                placeholder="Select class"
                            />
                        </Col>
                    </>
                }

                <Col sm='12'>
                    <div className='d-flex mt-3 justify-content-end pb-3'>
                        <Button className='me-1' outline color='primary' type='button' onClick={toggleOpen}>
                            Cancel
                        </Button>
                        {
                            (count > 0 || (classSetup || changeClass)) &&
                            <Button color='primary' type='button' onClick={save}>Save</Button>
                        }
                        {
                            assessment && <Button color='primary' type='button'
                                                  onClick={save}>{selectedAssessmentDate ? "Save" : "Save & Assign Students"}</Button>
                        }
                    </div>
                </Col>
            </Row>

            {updateConfirmation && <ConfirmBox
                isOpen={updateConfirmation}
                toggleModal={() => setUpdateConfirmation(false)}
                yesBtnClick={() => onSave(newClass)}
                noBtnClick={() => setUpdateConfirmation(false)}
                title={'Confirmation'}
                message={manageSetup.assignStudentsWarning}
                yesBtn="OK"
                noBtn="Cancel"
                icon={<Info size={40} color="#FF9F43"/>}
            />}
        </OffcanvasBody>
    </Offcanvas>
}
