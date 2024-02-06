import {PlusCircle, MinusCircle, Eye} from "react-feather"
import React from "react"
import Avatar from '@components/avatar/avatar'
import {Button, Col, Row} from "reactstrap"
import {addZero} from "@utils"

const courseAppliedStatus = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-dark', 'light-primary', 'light-secondary']

export const columns_TableAllClasses = (onView) => {
    return [
        {
            name: 'ClASS CODE',
            minWidth: '150px',
            maxWidth: '200px',
            wrap: true,
            selector: row => row.classCode
        },
        {
            name: 'MODULE',
            minWidth: '200px',
            selector: row => row.moduleName,
            cell: row => <Avatar count={row.count} name={row.moduleName} code={row.moduleCode}/>
        },
        {
            name: 'COURSE',
            minWidth: '200px',
            selector: row => row.courseName,
            cell: row => row.courseName && <Avatar name={row.courseName} code={row.courseCode} noAvatar={true}/>
        },
        {
            name: 'STARTING AND ENDING',
            minWidth: '150px',
            maxWidth: '300px',
            selector: row => row.from,
            cell: row => {
                return <div>{`${row.from} to ${row.to}`}</div>
            }
        },
        {
            name: 'ACTION',
            minWidth: '150px',
            maxWidth: '200px',
            // allowOverflow: true,
            cell: row => {
                return <Button onClick={() => onView(row)}
                               className={'top-custom-btn'}
                               size='sm'
                               color='primary' outline>
                    <Eye size={15}/>
                    <span className='m-md-1 align-middle ml-50'>View</span>
                </Button>
            }
        }
    ]
}

export const allClassesExpandableTable = ({data}) => {
    return (
        <div className='expandable-content p-2'>
            <Row>
                <Col sm={8}>
                    <p><span className='fw-bold'>Lecturer(s):</span>&nbsp; {data.lecturers.length > 0 ?
                        data.lecturers.map((item, index) => {
                            return `${item.lecturerName}${(data.lecturers.length > 1 && index !== data.lecturers.length - 1) ? ', ' : ''}`
                        })
                        : "N/A"}</p>
                </Col>
                <Col sm={4}>
                    <p><span className='fw-bold'>Batch(es):</span>&nbsp; {data.batchCode.length > 0 ?
                        data.batchCode.map((item, index) => {
                            return `${item}${(data.batchCode.length > 1 && index !== data.batchCode.length - 1) ? ', ' : ''}`
                        })
                        : "N/A"}</p>
                </Col>
            </Row>


        </div>
    )
}
