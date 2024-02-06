export const COURSE_TABLE_COLUMN = [
    {
        name: 'CODE',
        selector: row => row.code,
        minWidth: '150px',
        maxWidth: '250px'
    }, {
        name: 'COURSE NAME',
        selector: row => row.name,
        minWidth: '280px'
    }, {
        name: 'Programme',
        selector: row => row.programme,
        minWidth: '150px',
        maxWidth: '250px'
    }, {
        name: 'ADDED DATE',
        selector: row => row.date,
        minWidth: '150px',
        maxWidth: '200px'
    }, {
        name: 'ACTION',
        selector: row => row.action,
        width: '100px'
    }
]
