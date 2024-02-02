/**
 * @author Sahan Dinuka
 * @CreatedBy IntelliJ IDEA
 * @created 21/01/2022 - 11:46 AM
 */
import Required from "@components/required"
import React from "react"
import {COLOR_STATUS} from '@const'
import Avatar from '@components/avatar'
import moment from "moment"
import {Eye} from "react-feather"
import {Button, Input, UncontrolledTooltip} from "reactstrap"
import './scss/_allInquiries.scss'

export const ALL_INQUIRE_TABLE_COLUMN = [
    {
        name: 'INQUIRY NUMBER',
        selector: row => row.id,
        width: '165px'


    }, {
        name: 'STUDENT NAME',
        selector: row => row.name,
        minWidth: '300px',
        maxWidth : '350px',
        wrap: true

    }, {
        name: 'STATUS',
        selector: row => row.status,
        minWidth: '200px',
        maxWidth : '300px'
    }, {
        name: 'CONTACT',
        selector: row => row.contact,
        minWidth: '200px',
        maxWidth : '300px'
    }, {
        name: 'COURSE',
        selector: row => row.course,
        minWidth: '230px',
        compact : 2,
        wrap: true
    }, {
        name: 'INTAKE',
        selector: row => row.intake,
        minWidth: '100px',
        maxWidth: '140px'

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
