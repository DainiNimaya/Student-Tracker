import React from "react"
import AvatarII from '@components/avatar/avatar'

export const GRADING_TABLE = [
    {
        name: 'MODULE',
        minWidth: '300px',
        cell: row => {
            return row.moduleName && <AvatarII count={row.count} name={row.moduleName} code={`REG-${row.moduleCode}`}/>
        }
    },
    {
        name: 'ASSESSMENT',
        width: '200px',
        cell: item => (
            <div>
                <div className={'content-name'}><strong>{item.assessmentName}</strong></div>
                <span className={'content-name'}>{item.assessmentType}</span>
            </div>
        )
    },
    {
        name: 'MARK',
        selector: row => row.mark,
        width: '100px'
    },
    {
        name: 'GRADE',
        selector: row => row.grade,
        width: '100px'
    },
    {
        name: 'RESULT',
        selector: row => row.result,
        width: '100px'
    },
    {
        name: 'CREDITS',
        selector: row => row.credits,
        width: '100px'
    },
    {
        name: 'ATTEMPT',
        selector: row => row.attempt,
        width: '100px'
    }
]
