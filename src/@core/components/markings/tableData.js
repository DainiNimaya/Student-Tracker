import {basicInfo} from '@configs/basicInfomationConfig'

export const ASSESSMENT_MARKING_SHEET_ENTER_COLUMNS = [
    {
        name: `${basicInfo.regText} / UNI ID`,
        selector: row => row.cbNo,
        width: '180px'
    }, {
        name: 'BATCH',
        selector: row => row.batch,
        width: '150px',
        wrap: true
    }, {
        name: 'MARKS',
        selector: row => row.marks,
        width: '150px',
        right: true
    }, {
        name: 'ABSENT',
        selector: row => row.absent,
        width: '100px'
    // }, {
    //     name: 'MODERATED MARKS',
    //     selector: row => row.moderatedMarks,
    //     width: '190px',
    //     right: true
    // }, {
    //     name: 'ACTUAL MARKS',
    //     selector: row => row.actualMarks,
    //     width: '150px',
    //     right: true
    }, {
        name: 'GRADE',
        selector: row => row.grade,
        width: '100px'
    }, {
        name: 'EXAM STATUS',
        selector: row => row.examStatus,
        width: '150px'
    }, {
        name: 'REMARK',
        selector: row => row.remark,
        width: '300px'
    }
]

export const ASSESSMENT_MARKING_SHEET_VIEW_COLUMNS = [
    {
        name: `${basicInfo.regText} / UNI ID`,
        selector: row => row.cbNo,
        width: '180px'
    }, {
        name: 'BATCH',
        selector: row => row.batch,
        width: '150px',
        wrap: true
    }, {
        name: 'MARKS',
        selector: row => row.marks,
        width: '150px',
        right: true
    }, {
        name: 'ABSENT',
        selector: row => row.absent,
        width: '100px'
    // }, {
    //     name: 'MODERATED MARKS',
    //     selector: row => row.moderatedMarks,
    //     width: '190px',
    //     right: true
    // }, {
    //     name: 'ACTUAL MARKS',
    //     selector: row => row.actualMarks,
    //     width: '150px',
    //     right: true
    }, {
        name: 'GRADE',
        selector: row => row.grade,
        width: '100px'
    }, {
        name: 'EXAM STATUS',
        selector: row => row.examStatus,
        width: '150px'
    }, {
        name: 'REMARK',
        selector: row => row.remark,
        width: '300px'
    }
]

export const ASSESSMENT_MARKING_SHEET_HAA_ENTER_COLUMNS = [
    {
        name: '',
        selector: row => row.selectAll,
        width: '60px'
    }, {
        name: `${basicInfo.regText} / UNI ID`,
        selector: row => row.cbNo,
        width: '180px'
    }, {
        name: 'BATCH',
        selector: row => row.batch,
        minWidth: '150px',
        wrap: true
    }, {
        name: 'FIRST MARKS',
        selector: row => row.marks,
        width: '150px',
        right: true
    }, {
        name: 'ABSENT',
        selector: row => row.absent,
        width: '100px'
    }, {
        name: 'MODERATED MARKS',
        selector: row => row.moderatedMarks,
        width: '190px',
        right: true
    }, {
        name: 'ACTUAL MARKS',
        selector: row => row.actualMark,
        width: '150px',
        right: true
    }, {
        name: 'GRADE',
        selector: row => row.grade,
        width: '100px'
    }, {
        name: 'EXAM STATUS',
        selector: row => row.examStatus,
        width: '150px'
    }, {
        name: 'STATUS',
        selector: row => row.status,
        width: '150px'
    }, {
        name: 'PUBLISH / UNPUBLISH',
        selector: row => row.publishUnpublish,
        width: '200px'
    }, {
        name: 'REMARK',
        selector: row => row.remark,
        width: '300px'
    }
]
