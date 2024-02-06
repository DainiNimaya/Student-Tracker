import React from "react"
import {COLOR_STATUS} from '@const'
import './scss/_allInquiries.scss'

export const ALL_INQUIRE_TABLE_COLUMN = [
    {
        name: 'INQUIRY NUMBER',
        selector: row => row.id,
        width: '165px'


    }, {
        name: 'STUDENT NAME',
        selector: row => row.name,
        width: '160px',
        wrap: true

    }, {
        name: 'STATUS',
        selector: row => row.status,
        width: '100px'
    }, {
        name: 'CONTACT',
        selector: row => row.contact,
        width: '200px'
    }, {
        name: 'COURSE',
        selector: row => row.course,
        width: '180px',
        compact : 2,
        wrap: true
    }, {
        name: 'INTAKE',
        selector: row => row.intake,
        width: '130px'

    },
    // {
    //     name: 'INQUIRY TYPE',
    //     selector: row => row.inquiryType,
    //     minWidth: '200px'
    // }, {
    //     name: 'INQUIRY DATE',
    //     selector: row => row.inquiryDate,
    //     minWidth: '200px'
    // },
    {
        name: 'ACTIONS',
        selector: row => row.actions,
        width: '200px'
    }
]
