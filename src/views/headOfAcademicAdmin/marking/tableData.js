export const MARKINGS_TABLE_COLUMN = [
    {
        name: 'BATCH',
        selector: row => row.batch,
        minWidth: '100px',
        maxWidth: '200px'
    }, {
        name: 'MODULE',
        selector: row => row.module,
        minWidth: '150px',
        maxWidth: '250px'
    }, {
        name: 'COURSE',
        selector: row => row.course,
        minWidth: '150px',
        maxWidth: '250px'
    }, {
        name: 'ACTION',
        selector: row => row.action,
        width: '120px'
    }
]


export const STUDENT_MARKINGS_TABLE_COLUMN = [
    {
        name: 'NAME',
        selector: row => row.name,
        minWidth: '150px'
    }, {
        name: 'BATCH',
        selector: row => row.batch,
        width: '150px'
    }
    // {
    //     name: 'DIAGNOSTIC ASSESSMENT (%)',
    //     selector: row => row.diagnostic,
    //     minWidth: '250px'
    // }, {
    //     name: 'FORMATIVE ASSESSMENT (%)',
    //     selector: row => row.formative,
    //     minWidth: '250px'
    // }, {
    //     name: 'SUMMARY ASSESSMENT (%)',
    //     selector: row => row.summary,
    //     width: '250px'
    // }
]
