export const STUDENT_PROFILE_TABLE_COLUMN = [
    {
        name: 'NAME',
        selector: row => row.name,
        minWidth: '300px',
        maxWidth: '370px',
        wrap: true
    },
    {
        name: 'CONTACT',
        selector: row => row.contact,
        minWidth: '225px',
        maxWidth: '280px'
    },
    {
        name: 'COURSE NAME',
        selector: row => row.course,
        minWidth: '225px',
        maxWidth: '300px',
        wrap: true
    }, {
        name: 'BATCH',
        selector: row => row.batch,
        minWidth: '180px',
        wrap: true
    }, {
        name: 'ACTION',
        selector: row => row.action,
        width: '145px'
    }
]