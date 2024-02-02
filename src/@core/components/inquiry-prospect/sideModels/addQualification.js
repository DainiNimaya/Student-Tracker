import {Button, CardTitle, Col, Form, Input, Label, Offcanvas, OffcanvasBody, OffcanvasHeader, Row} from 'reactstrap'
import {Award, MinusCircle} from "react-feather"

import Select from "react-select"
import {
    addZero,
    createAddQualificationDataObject,
    findFileDataUrl,
    findObject,
    isNULL,
    selectThemeColors,
    viewResume
} from '@utils'
import {FILE_TYPES} from "@const"
import {useEffect, useState} from "react"
import * as Api from "@api/counsellor"
import {DatePicker} from "antd"
import {inquiryProspectAddQualification} from "@formError/counsellor"
import classnames from "classnames"
import moment from "moment"
import {inquiryProspectAddQualificationValidation} from "@validations/counsellor"
import Required from "@components/required"
import config from '@storage'
import {getLoggedUserData} from '@commonFunc'
import {qualification_list, accessList} from '@configs/basicInfomationConfig'

const REQUIRED_LIST = [config.counsellorRole, config.hocRole]
export default (props) => {
    const {open, toggleOpen, inquiryId, selectedQualification, qualificationModelAction, loadQualifications} = props
    const [qualification, setQualification] = useState(undefined)
    const [otherQualification, setOtherQualification] = useState('')
    const [school, setSchool] = useState('')
    const [indexNo, setIndexNo] = useState('')
    const [level, setLevel] = useState('')
    const [year, setYear] = useState('')
    const [comment, setComment] = useState('')

    const [transcript, setTranscript] = useState('')
    const [transcriptFile, setTranscriptFile] = useState(undefined)
    const [transcriptBlob, setTranscriptBlob] = useState(undefined)

    const [otherAttachment, setOtherAttachment] = useState('')
    const [otherAttachmentFile, setOtherAttachmentFile] = useState(undefined)
    const [otherAttachmentBlob, setOtherAttachmentBlob] = useState(undefined)

    const [results, setResults] = useState([])

    const [error, setError] = useState(inquiryProspectAddQualification)

    const [isOtherQualification, setIsOtherQualification] = useState(false)

    useEffect(async () => {
        open && await loadDetails()
    }, [open])

    const loadDetails = async () => {
        if (selectedQualification) {

            if (selectedQualification.qualification) {
               const response = findObject(qualification_list , selectedQualification.qualification)
                if (response) {
                    setQualification(response)
                    setIsOtherQualification(false)
                    setOtherQualification('')
                } else {
                    setQualification(accessList.allowAptitudeTestForQualification ? qualification_list[16] : qualification_list[15])
                    setIsOtherQualification(true)
                    setOtherQualification(selectedQualification.qualification)
                }

            }
            //setQualification({...findObject(qualification_list, selectedQualification.qualification)})
            setSchool(isNULL(selectedQualification.school))
            setIndexNo(isNULL(selectedQualification.indexNo))
            setLevel(isNULL(selectedQualification.level))
            setYear(isNULL(selectedQualification.year))
            setComment(isNULL(selectedQualification.comment))
            setTranscriptBlob(selectedQualification.transcript !== null ? selectedQualification.transcript : undefined)
            setOtherAttachmentBlob(selectedQualification.otherAttachment !== null ? selectedQualification.otherAttachment : undefined)
            const data = []
            selectedQualification.results.map((item, index) => {
                data.push({
                    resultId: item.resultId,
                    subjectName: item.subjectName,
                    result: item.result
                })
            })
            setResults(data)
        }
    }

    const onChangeValue = async (e) => {
        const name = e.target.name
        const value = e.target.value
        let result
        switch (name) {
            case 'qualification':
                setQualification(value)
                const temp  = accessList.allowAptitudeTestForQualification ? qualification_list[16] : qualification_list[15]
                value === temp ? setIsOtherQualification(true) :
                    setIsOtherQualification(false)
                break
            case 'school':
                setSchool(value)
                break
            case 'indexNo':
                setIndexNo(value)
                break
            case 'level':
                setLevel(value)
                break
            case 'year':
                setYear(value)
                break
            case 'comment':
                setComment(value)
                break
            case 'transcript':
                setTranscript(value)
                result = await findFileDataUrl(e.target.files)
                setTranscriptFile(result.files[0])
                setTranscriptBlob(result.data[0])
                break
            case 'otherAttachment':
                setOtherAttachment(value)
                result = await findFileDataUrl(e.target.files)
                setOtherAttachmentFile(result.files[0])
                setOtherAttachmentBlob(result.data[0])
                break
            case 'otherQualification':
                setOtherQualification(value)
                break
        }
    }

    const onResultChange = (value, type, index) => {
        const data = []
        results.map((item, i) => {
            if (i !== index) {
                data.push(item)
            } else {
                const obj = {
                    resultId: item.resultId ?? undefined,
                    subjectName: type === 'subjectName' ? value : item.subjectName,
                    result: type === 'result' ? value : item.result
                }
                data.push(obj)
            }
        })
        setResults(data)
    }

    const addResult = () => {
        const data = [...results]
        data.push({
            subjectName: '',
            result: ''
        })
        setResults(data)
    }

    const removeResult = (index) => {
        const data = [...results]
        data.splice(index, 1)
        setResults(data)
    }

    const onSave = async () => {
        const studentId = props.isMasterProfile && JSON.parse(sessionStorage.getItem('STUDENT_DETAILS')).studentId
        let res = inquiryProspectAddQualificationValidation(qualification, school, indexNo, level, year, results, {isOtherQualification, otherQualification})
        setError(res)
        for (const key in res) {
            if (res[key]) {
                if (key === 'results') {
                    if (res[key].length > 0) {
                        return
                    }
                } else {
                    return
                }
            }
        }
        const qualificationObj = {qualification , isOtherQualification , otherQualification}
        const body = createAddQualificationDataObject(selectedQualification, qualificationObj, school, indexNo, level, year, results, comment)
        res = props.isMasterProfile ? await Api.saveQualificationsMaster(studentId, body) : await Api.saveQualifications(inquiryId, body)
        if (res) {
            if (transcriptFile || otherAttachmentFile) {
                let files = []
                transcriptFile && files.push({
                    type: FILE_TYPES[6],
                    file: transcriptFile,
                    extra: {name: 'qualificationId', value: res.qualificationId}
                })

                let saveFiles = props.isMasterProfile ? await Api.saveFilesMaster(studentId, files) : await Api.saveFiles(inquiryId, files)
                if (saveFiles.length > 0) {
                    files = []
                    otherAttachmentFile && files.push({
                        type: FILE_TYPES[7],
                        file: otherAttachmentFile,
                        extra: {name: 'qualificationId', value: res.qualificationId}
                    })
                    saveFiles = props.isMasterProfile ? await Api.saveFilesMaster(studentId, files) : await Api.saveFiles(inquiryId, files)
                    if (saveFiles.length > 0) {
                        toggleOpen()
                        loadQualifications(selectedQualification ? 'EDIT' : 'ADD')
                    }
                }
            } else {
                toggleOpen()
                loadQualifications(selectedQualification ? 'EDIT' : 'ADD')
            }
        }
    }

    return <Offcanvas
        scrollable={true}
        backdrop={true}
        direction='end'
        isOpen={open}
        toggle={toggleOpen}
    >
        <OffcanvasHeader toggle={toggleOpen}>{selectedQualification ? 'Edit' : 'Add'} Qualification</OffcanvasHeader>
        <OffcanvasBody className='mx-0 flex-grow-0'>
            <Form>
                <Row>
                    <CardTitle tag='h4' className="mt-1"><Award size={20}/> &nbsp;Qualification Details</CardTitle>

                    <Col className='mb-2 mt-05' sm='12'>
                        <Label className='form-label' for='basicInput'>
                            Qualification<Required/>
                        </Label>
                        <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            theme={selectThemeColors}
                            value={qualification}
                            onChange={value => onChangeValue({target: {name: 'qualification', value}})}
                            className={classnames('react-select', {'is-invalid': error.qualification})}
                            classNamePrefix='select'
                            options={qualification_list}
                            isClearable={false}
                            placeholder="Select Qualification"
                        />
                    </Col>

                    {isOtherQualification &&
                        <Col className='mb-2' sm='12'>
                            <Label className='form-label' for='otherQualification'>
                                Other<Required/>
                            </Label>
                            <Input type='textarea'
                                   value={otherQualification}
                                   invalid={error.otherQualification}
                                   onChange={onChangeValue}
                                   maxLength={250}
                                   rows={5}
                                   id='otherQualification' name='otherQualification' placeholder="Enter Other Qualification"/>
                            <span className="wordCount"><span>{otherQualification.length}</span>/250</span>
                        </Col>
                    }

                    <Col className='mb-2' sm='12'>
                        <Label className='form-label' for='school'>
                            Place of Study or Awarding Institute<Required/>
                        </Label>
                        <Input type='text'
                               value={school}
                               invalid={error.school}
                               onChange={onChangeValue}
                               id='school' name='school' placeholder="Enter School Name"/>
                    </Col>

                    <Col className='mb-2' sm='12'>
                        <Label className='form-label' for='indexNo'>
                            Index Number {/*{REQUIRED_LIST.includes(getLoggedUserData().role) && <Required/>}*/}
                            {/*{getLoggedUserData().role !== config.guest && <Required/>}*/}
                        </Label>
                        <Input type='text'
                               value={indexNo}
                               invalid={error.indexNo}
                               onChange={onChangeValue}
                               id='indexNo' name='indexNo' placeholder="Enter Index No"/>
                    </Col>

                    <Col className='mb-2' sm='12'>
                        <Row>
                            <Col className='mb-2' sm='6'>
                                <Label className='form-label' for='level'>
                                    Level {getLoggedUserData().role !== config.guest && <Required/>}
                                </Label>
                                <Input type='text'
                                       value={level}
                                       invalid={error.level}
                                       onChange={onChangeValue}
                                       id='level' name='level' placeholder="Enter Level"/>
                            </Col>
                            <Col className='mb-2' sm='6'>
                                <Label className='form-label' for='year'>
                                    Year {/*{REQUIRED_LIST.includes(getLoggedUserData().role) && <Required/>}*/}<Required/>
                                </Label>
                                <DatePicker
                                    className = {'ant-DatePicker'}
                                    picker="year"
                                    value={year === "" ? year : moment(year)}
                                    style={error.year ? {border: '1px solid #ea5455'} : {}}
                                    onChange={value => onChangeValue({
                                        target: {
                                            name: 'year',
                                            value: value === null ? "" : moment(value).format('YYYY')
                                        }
                                    })}/>
                            </Col>
                        </Row>
                    </Col>

                    <Col className='mb-2' sm='12'>
                        <Label className='form-label' for='comment'>
                            Special Comments
                        </Label>
                        <Input type='textarea' id='comment'
                               value={comment}
                               maxLength="250"
                               onChange={onChangeValue}
                               name='comment' placeholder="Enter Some Comment" rows={5}/>
                        <span className="wordCount"><span>{comment.length}</span>/250</span>
                    </Col>

                    <CardTitle tag='h4' className="mt-1">Results</CardTitle>

                    <Col sm='12'>
                        {
                            results.map((item, index) => (
                                <Row key={index}>
                                    <Col className='mb-05' xs='8'>
                                        <Label className='form-label' for='comment'>
                                            Subject {addZero(index + 1)}
                                        </Label>
                                        <Input
                                            type='text'
                                            id='level'
                                            name='subjectName'
                                            value={item.subjectName}
                                            invalid={error.results.filter(e => e === item.resultId).length > 0 && item.subjectName.trim() === ""}
                                            onChange={event => onResultChange(event.target.value, 'subjectName', index)}
                                            placeholder="Subject Name"/>
                                    </Col>
                                    <Col className='mb-05' xs='3'>
                                        <Label className='form-label' for='comment'>
                                            Grade
                                        </Label>
                                        <Input
                                            type='text'
                                            id='level'
                                            name='result'
                                            value={item.result}
                                            invalid={error.results.filter(e => e === item.resultId).length > 0 && item.result.trim() === ""}
                                            onChange={event => onResultChange(event.target.value, 'result', index)}
                                            placeholder="A"/>
                                    </Col>
                                    <Col className='mb-05 pl-0' xs='1'>
                                        <MinusCircle
                                            size={25}
                                            onClick={() => removeResult(index)}
                                            className='cursor-pointer mt-c2'
                                            color="#EA5455"/>
                                    </Col>
                                </Row>
                            ))
                        }
                    </Col>

                    <Col className='mb-2 d-flex justify-content-start' sm='12'>
                        <Label className='form-label text-14 text-success cursor-pointer' onClick={addResult}>
                            + Add Result
                        </Label>
                    </Col>

                    <CardTitle tag='h4' className="mt-1">Certificate or Transcript</CardTitle>

                    <Col className='mb-2' sm='12'>
                        <p>Upload a scanned PDF copy of result sheet.</p>
                        <Input type='file' id='resultSheet'
                               value={transcript}
                               onChange={onChangeValue}
                               name='transcript' accept='application/pdf'/>
                        {
                            transcriptBlob &&
                            <p
                                onClick={() => viewResume(transcriptBlob)}
                                className="mt-05 text-decoration-underline cursor-pointer text-success">View File</p>
                        }
                    </Col>

                    <CardTitle tag='h4' className="mt-1">Other Attachment</CardTitle>

                    <Col className='mb-2' sm='12'>
                        <p>Upload PDF, DOC or JPG file of your document</p>
                        <Input type='file' id='otherAttachment'
                               value={otherAttachment}
                               onChange={onChangeValue}
                               name='otherAttachment'
                               accept='application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*'/>
                        {
                            otherAttachmentBlob &&
                            <p
                                onClick={() => viewResume(otherAttachmentBlob)}
                                className="mt-05 text-decoration-underline cursor-pointer text-success">View File</p>
                        }
                    </Col>

                    <Col sm='12'>
                        <div className='d-flex mt-3 justify-content-end pb-3'>
                            <Button className='me-1' outline color='primary' type='button' onClick={toggleOpen}>
                                Cancel
                            </Button>
                            <Button color='primary' type='button' onClick={onSave}>
                                {selectedQualification ? 'Update' : 'Add'}
                            </Button>
                        </div>
                    </Col>

                </Row>
            </Form>

        </OffcanvasBody>
    </Offcanvas>
}
