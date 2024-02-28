export const ENROLLMENT_REQUESTS_TABLE_COLUMN = [
    {
        name: 'NAME',
        selector: row => row.name,
        minWidth: '250px',
        maxWidth: '400px',
        wrap: true
    }, {
        name: 'CONTACT',
        selector: row => row.contact,
        minWidth: '200px',
        maxWidth: '300px'
    }, {
        name: 'Request Date',
        selector: row => row.requestDate,
        minWidth: '150px',
        maxWidth: '250px'
    }, {
        name: 'COURSE',
        selector: row => row.course,
        minWidth: '200px',
        maxWidth: '350px',
        wrap: true
    // }, {
    //     name: 'STATUS',
    //     selector: row => row.status,
    //     minWidth: '130px',
    //     maxWidth: '250px'
    }
    // {
    //     name: 'FEE TYPE',
    //     selector: row => row.feeType,
    //     minWidth: '200px'
    // },
    // {
    //     name: 'ACTIONS',
    //     selector: row => row.actions,
    //     width: '200px'
    // }
]
