import {Badge, Button, Col, Row} from "reactstrap"
import {Edit, Eye, Trash} from "react-feather"
import React from "react"
import Avatar from '@components/avatar'
import {ASSESSMENT_TABLE_STATUS, DATE_FORMAT_TABLE} from '@const'
import {capitalize} from '@commonFunc'
import './_courseSetup.scss'
import moment from "moment"
import {getCookieUserData} from '@utils'
import config from '@storage'
import themeConfig from '@configs/themeConfig'
import {basicInfo} from '@configs/basicInfomationConfig'

const courseAppliedStatus = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-dark', 'light-primary', 'light-secondary']

export const columns_TableStudent = (onEditCourse) => {
    return [
        {
            name: basicInfo.regText,
            minWidth: '80px',
            selector: row => row.cbNumber
        },
        {
            name: 'STUDENT',
            minWidth: '280px',
            cell: row => {
                let con = row.name.split(' ')[0]

                if (row.name.split(' ').length > 1) {
                    con = `${row.name.split(' ')[0]} ${row.name.split(' ')[1]}`
                }

                return (
                    <div className="d-flex flex-row align-items-center">
                        <div className={'initial-round mr-05'}>
                            <Avatar color={courseAppliedStatus[row.count]}
                                    content={con}
                                    initials/>
                        </div>
                        <div className={'text-content'}>
                            <div className={'content-name'}><strong>{row.name}</strong></div>
                            {
                                row.code && <span className={'content-name'}>{row.courseName}</span>
                            }
                        </div>
                    </div>
                )
            }
        },
        {
            name: 'EDIT',
            maxWidth: '50px',
            allowOverflow: true,
            cell: row => {
                return (
                    <Edit size={15} onClick={() => onEditCourse(row)} color={themeConfig.color.primary}/>
                )
            }
        }
    ]
}

export const columns_TableAssessment = (onEditCourse, onPublish) => {
    return [
        {
            name: 'CODE',
            minWidth: '150px',
            selector: row => row.name
        },
        {
            name: 'ISSUE DATE',
            minWidth: '100px',
            selector: row => {
                return row.issueDate ? row.issueDate : 'N/A'
            }
        },
        {
            name: 'SUBMISSION DATE',
            minWidth: '170px',
            selector: row => {
                return row.submissionDate ? row.submissionDate : 'N/A'
            }
        },
        {
            name: 'RETURN DATE',
            minWidth: '170px',
            selector: row => {
                return row.returnDate ? row.returnDate : 'N/A'
            }
        },
        {
            name: 'STATUS',
            minWidth: '150px',
            selector: row => {
                return <><Badge className='ms-auto me-1'
                                color={
                                    row.status === ASSESSMENT_TABLE_STATUS.pending ? courseAppliedStatus[2]
                                        : courseAppliedStatus[0]}
                                pill>
                    {capitalize(row.status.replaceAll('_', ' ').toLowerCase())}
                </Badge></>
            }
        },
        // {
        //     name: 'PUBLISHED',
        //     minWidth: '170px',
        //     selector: row => {
        //         return <div className='form-check form-switch'>
        //             <Input
        //                 type='switch'
        //                 name='disabilities'
        //                 id='disabilities'
        //                 className="cursor-pointer"
        //                 checked={row.publish}
        //                 onChange={onPublish}
        //             />
        //         </div>
        //     }
        // },
        {
            name: 'ACTION',
            minWidth: '200px',
            allowOverflow: true,
            cell: row => {
                return (<>{row.status === ASSESSMENT_TABLE_STATUS.pending ?
                    <Button style={{width: 200}} onClick={() => onEditCourse(row, 'ENTER')} color='primary' outline
                            className={'btn-enter-marks'}>Enter
                        Marks</Button>
                    : <Button style={{width: 200}} onClick={() => onEditCourse(row, 'VIEW')} color='primary' outline>View
                        Marks</Button>
                }</>)
            }
        }
    ]
}

export const columns_haaTableAssessment = (onEditCourse, onPublish) => {
    return [
        {
            name: 'CODE',
            minWidth: '200px',
            selector: row => row.name
        },
        {
            name: 'ISSUE DATE',
            minWidth: '170px',
            selector: row => {
                return row.issueDate ? moment(row.issueDate).format(DATE_FORMAT_TABLE) : 'N/A'
            }
        },
        {
            name: 'SUBMISSION DATE',
            minWidth: '170px',
            selector: row => {
                return row.submissionDate ? moment(row.submissionDate).format(DATE_FORMAT_TABLE) : 'N/A'
            }
        },
        {
            name: 'RETURN DATE',
            minWidth: '170px',
            selector: row => {
                return row.returnDate ? moment(row.returnDate).format(DATE_FORMAT_TABLE) : 'N/A'
            }
        },
        {
            name: 'STATUS',
            minWidth: '150px',
            selector: row => {
                return <><Badge className='ms-auto me-1'
                                color={
                                    row.status === ASSESSMENT_TABLE_STATUS.pending ? courseAppliedStatus[2]
                                        : courseAppliedStatus[0]}
                                pill>
                    {capitalize(row.status.replaceAll('_', ' ').toLowerCase())}
                </Badge></>
            }
        },
        // {
        //     name: 'PUBLISHED',
        //     minWidth: '170px',
        //     selector: row => {
        //         return <div className='form-check form-switch'>
        //             <Input
        //                 type='switch'
        //                 name='disabilities'
        //                 id='disabilities'
        //                 className="cursor-pointer"
        //                 checked={row.publish}
        //                 onChange={onPublish}
        //             />
        //         </div>
        //     }
        // },
        {
            name: 'ACTION',
            minWidth: '200px',
            allowOverflow: true,
            cell: row => {
                return (<>{(getCookieUserData().role !== config.haaRole) ? (row.status === ASSESSMENT_TABLE_STATUS.pending ?
                        <Button style={{width: 200}} onClick={() => onEditCourse(row, 'ENTER')} color='primary' outline
                                className={'btn-enter-marks'}>Enter
                            Marks</Button>
                        :
                        <Button style={{width: 200}} onClick={() => onEditCourse(row, 'VIEW')} color='primary' outline>View
                            Marks</Button>
                ) : <Button onClick={() => onEditCourse(row, 'HAA_ENTER')} color='primary' outline>Enter
                    Marks</Button>}</>)
            }
        }
    ]
}


export const columns_TableAssessmentDates = (viewStudents, onEdit, onRemove) => {
    return [
        {
            name: 'CODE',
            minWidth: '100px',
            wrap: true,
            selector: row => row.name
        },
        {
            name: 'ISSUE DATE',
            minWidth: '130px',
            selector: row => row.issueDate
        },
        {
            name: 'ACTION',
            minWidth: '350px',
            allowOverflow: true,
            cell: row => {
                return <>
                    <Button className="me-1" onClick={() => viewStudents(row)} color='primary' outline>
                        <Eye size={15} color={themeConfig.color.primary}/> Student List</Button>
                    <Button onClick={() => onEdit(row)} color='primary' outline>
                        <Edit size={15} color={themeConfig.color.primary}/> Edit</Button>
                    <Trash size={20} style={{marginLeft: 10, cursor: 'pointer'}} color={'red'}
                           onClick={() => onRemove(row)}/>
                </>
            }
        }
    ]
}

export const assessmentExpandableTable = ({data}) => {
    return (
        <div className='expandable-content p-2'>
            <Row>
                <Col lg={6}>
                    <p>
                                <span><span className='fw-bold'>Classes : </span>
                                    {data.classes.length > 0 ? data.classes.map((item, i) => {
                                        return ((data.classes.length - 1) === i) ? item : `${item}, `
                                    }) : 'N/A'}
                                </span>
                    </p>
                </Col>

                {/*{(getCookieUserData().role === config.lecturer) && <Col lg={6}>*/}
                {/*    <p>*/}
                {/*                <span><span*/}
                {/*                    className='fw-bold'>Issue Date : </span>{data.issueDate ? data.issueDate : 'N/A'}</span>*/}
                {/*    </p>*/}
                {/*</Col>}*/}

                <Col lg={6}>
                    <p>
                                <span><span className='fw-bold'>Batches : </span>
                                    {data.batches.length > 0 ? data.batches.map((item, i) => {
                                        return ((data.batches.length - 1) === i) ? item : `${item}, `
                                    }) : 'N/A'}
                                </span>
                    </p>
                </Col>

                <Col lg={6}>
                    <p>
                                <span><span
                                    className='fw-bold'>Number of Submissions : </span>{data.submissionPercentage ? `${data.submissionPercentage}%` : 'N/A'}</span>
                    </p>
                </Col>

                <Col lg={6}>
                    <p>
                        <span><span
                            className='fw-bold'>Students : </span>{data.noOfStudents ? data.noOfStudents : 'N/A'}</span>
                    </p>
                </Col>
            </Row>
        </div>
    )
}

export const assessmentDatesExpandableTable = ({data}) => {
    return (
        <div className='expandable-content p-2'>
            <Row>
                <Col lg={6}>
                    <p>
                                <span><span
                                    className='fw-bold'>Submission Date : </span>{data.submissionDate ? data.submissionDate : 'N/A'}</span>
                    </p>
                </Col>
                <Col lg={6}>
                    <p>
                                <span><span
                                    className='fw-bold'>Return Date : </span>{data.returnDate ? data.returnDate : 'N/A'}</span>
                    </p>
                </Col>

                <Col lg={6}>
                    <p>
                        <span><span className='fw-bold'>Uploader : </span>{data.uploaderName}</span>
                    </p>
                </Col>

                <Col lg={6}>
                    <p>
                                <span><span
                                    className='fw-bold'>Moderator : </span>{data.modaratorName}</span>
                    </p>
                </Col>

                {data.classes.length !== 0 && <Col lg={6}>
                    <p>
                                <span><span className='fw-bold'>Classes : </span>
                                    {data.classes.map((item, i) => {
                                        return ((data.classes.length - 1) === i) ? item : `${item}, `
                                    })}
                                </span>
                    </p>
                </Col>}

                {data.batches.length !== 0 && <Col lg={6}>
                    <p>
                                <span><span className='fw-bold'>Batches : </span>
                                    {data.batches.map((item, i) => {
                                        return ((data.batches.length - 1) === i) ? item : `${item}, `
                                    })}
                                </span>
                    </p>
                </Col>}
            </Row>
        </div>
    )
}

export const columns_haaRepeatRecommendationTableAssessment = (onEditCourse) => {
    return [
        {
            name: 'CODE',
            minWidth: '200px',
            selector: row => row.name
        },
        {
            name: 'SUBMISSION DATE',
            minWidth: '170px',
            selector: row => {
                return row.submissionDate ? moment(row.submissionDate).format(DATE_FORMAT_TABLE) : 'N/A'
            }
        },
        {
            name: 'STATUS',
            minWidth: '150px',
            selector: row => {
                return <><Badge className='ms-auto me-1'
                                color={
                                    row.status === ASSESSMENT_TABLE_STATUS.pending ? courseAppliedStatus[2]
                                        : courseAppliedStatus[0]}
                                pill>
                    {capitalize(row.status.replaceAll('_', ' ').toLowerCase())}
                </Badge></>
            }
        },
        {
            name: 'ACTION',
            minWidth: '200px',
            allowOverflow: true,
            cell: row => {
                return (<>{(getCookieUserData().role !== config.haaRole) ? (row.status === ASSESSMENT_TABLE_STATUS.pending ?
                        <Button style={{width: 200}} onClick={() => onEditCourse(row, 'ENTER')} color='primary' outline
                                className={'btn-enter-marks'}>Enter
                            Marks</Button>
                        :
                        <Button style={{width: 200}} onClick={() => onEditCourse(row, 'VIEW')} color='primary' outline>View
                            Marks</Button>
                ) : <Button onClick={() => onEditCourse(row, 'HAA_ENTER')} color='primary' outline>Enter
                    Marks</Button>}</>)
            }
        }
    ]
}

export const repeatRecommendationExpandableTable = ({data}) => {
    return (
        <div className='expandable-content p-2'>
            <Row>
                <Col lg={6}>
                    <p>
                        <span><span className='fw-bold'>Batches : </span>
                            {data.batches.length > 0 ? data.batches.map((item, i) => {
                                return ((data.batches.length - 1) === i) ? item : `${item}, `
                            }) : 'N/A'}
                                </span>
                    </p>
                </Col>

                <Col lg={6}>
                    <p>
                        <span><span
                            className='fw-bold'>Students : </span>{data.noOfStudents}</span>
                    </p>
                </Col>
            </Row>
        </div>
    )
}
