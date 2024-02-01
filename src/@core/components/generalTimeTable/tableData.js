import moment from "moment"
import {DATE_FORMAT} from '@const'
import React from "react"
import AvatarII from '@components/avatar/avatar'

export const UPCOMING_CLASS_TABLE_COLUMN = [
    {
        name: 'DATE',
        cell: row => <div>{moment(row.actualDate).format(DATE_FORMAT)}</div>,
        width: '130px'
    },
    {
        name: 'DAY',
        cell: row => <div>{moment(row.actualDate).format('dddd')}</div>,
        width: '125px'
    },
    {
        name: 'TIME',
        cell: row => <div>{row.classTime}</div>,
        width: '150px'
    },
    {
        name: 'LECTURER',
        selector: row => row.lectureName,
        minWidth: '150px',
        maxWidth: '200px',
        wrap: true
    },
    {
        name: 'BATCHES',
        minWidth: '150px',
        maxWidth: '200px',
        cell: row => <div>
            {
                row.details.map((item) => {
                    return item
                })
            }
            {
                row.details.length === 0 && 'N/A'
            }
        </div>,
        wrap: true
    },
    {
        name: 'MODULE',
        cell: row => <AvatarII noAvatar={true} name={row.moduleName} code={row.moduleCode}/>,
        minWidth: '300px'
    },
    {
        name: 'CLASS',
        selector: row => row.className,
        minWidth: '150px',
        maxWidth: '350px',
        wrap: true
    },
    {
        name: 'CLASS SLOT',
        selector: row => row.slotName,
        minWidth: '100px',
        maxWidth: '200px',
        wrap: true
    }
]
