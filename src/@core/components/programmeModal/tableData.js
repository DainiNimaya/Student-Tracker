export const COURSE_LEVEL_TABLE_COLUMN = [
    {
        name: 'LEVEL',
        selector: row => row.level,
        minWidth: '230px'
    }, {
        name: 'MIN CREDIT AMOUNT',
        selector: row => row.min,
        minWidth: '200px'
    }, {
        name: 'MAX CREDIT AMOUNT',
        selector: row => row.max,
        minWidth: '235px'
    }, {
        name: 'TOTAL GRADE AVERAGE',
        selector: row => row.total,
        minWidth: '230px'
    }, {
        name: '',
        selector: row => row.remove,
        minWidth: '70px'
    }
]