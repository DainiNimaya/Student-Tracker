export const GRADING_SCHEME_TABLE_COLUMN = [
    {
        name: 'MARK FROM',
        selector: row => row.markFrom,
        minWidth: '150px'
    }, {
        name: 'MARK TO',
        selector: row => row.markTo,
        minWidth: '150px'
    }, {
        name: 'GRADE',
        selector: row => row.grade,
        width: '100px'
    }, {
        name: 'DESCRIPTION',
        selector: row => row.desc,
        minWidth: '250px'
    },
    {
        name: 'PASS/FAIL',
        selector: row => row.passFail,
        width: '150px'
    },
    {
        name: 'GRADE POINT',
        selector: row => row.gradePoint,
        minWidth: '100px'
    }
]
