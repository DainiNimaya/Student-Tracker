import React from "react"
import {ATTENDANCE_STATUS, COLOR_STATUS} from '@const'
import Avatar from '@components/avatar'
import {Button, Input} from "reactstrap"
import classnames from "classnames"

export const MARK_ATTENDANCE_TABLE = (onChange, edit, isHaa) => {

    return [
        {
            name: 'INDEX',
            maxWidth: '120px',
            selector: row => row.no,
            cell: row => <strong className="ml-1 text-primary">{row.no}</strong>
        },
        {
            name: 'NAME',
            minWidth: '250px',
            selector: row => {
                row.studentName !== null ? row.studentName : "N/A"
            },
            cell: row => <div>
                <div className="d-flex flex-row align-items-center">
                    <Avatar
                        className="height-fit"
                        color={`light-${COLOR_STATUS[row.count]}`} content={row.studentName} initials/>
                    <div className="ms-1">
                        <strong>{row.studentName}</strong>
                        <p className="mb-0">{row.cbNumber}</p>
                    </div>
                </div>
            </div>
        },
        {
            name: 'BATCH',
            minWidth: '200px',
            selector: row => row.batchCode
        },
        {
            name: 'PRESENCE',
            minWidth: '100px',
            selector: row => row.status,
            cell: row => <div className="d-flex flex-row">
                {
                    isHaa ? row.status : <>
                        <Button size={"sm"}
                                onClick={() => onChange(row, 'status', ATTENDANCE_STATUS[0])}
                                outline={row.status !== ATTENDANCE_STATUS[0]}
                                className={classnames(' me-1 nonFocus', {'btn-present': row.status === ATTENDANCE_STATUS[0]})}>
                            P
                        </Button>

                        <Button size={"sm"}
                                onClick={() => onChange(row, 'status', ATTENDANCE_STATUS[1])}
                                outline={row.status !== ATTENDANCE_STATUS[1]}
                                className={classnames(' me-1 nonFocus', {'btn-absence': row.status === ATTENDANCE_STATUS[1]})}>
                            A
                        </Button>

                        <Button size={"sm"}
                                onClick={() => onChange(row, 'status', ATTENDANCE_STATUS[2])}
                                outline={row.status !== ATTENDANCE_STATUS[2]}
                                className={classnames(' nonFocus', {'btn-late': row.status === ATTENDANCE_STATUS[2]})}>
                            L
                        </Button>
                    </>
                }
            </div>
        },
        {
            name: 'REMARK',
            minWidth: '100px',
            cell: row => <>
                {
                    isHaa ? row.remark : <Input
                        readOnly={!edit}
                        type="text" value={row.remark} onChange={e => onChange(row, 'remark', e.target.value)}/>
                }
            </>
        }

    ]
}
