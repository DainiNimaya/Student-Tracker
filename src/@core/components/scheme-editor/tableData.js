export const GRADING_SCHEME_TABLE_COLUMN = [
    {
        name: 'MARK FROM',
        selector: row => row.markFrom,
        minWidth: '130px'
    }, {
        name: 'MARK TO',
        selector: row => row.markTo,
        minWidth: '130px'
    }, {
        name: 'GRADE',
        selector: row => row.grade,
        width: '100px'
    }, {
        name: 'DESCRIPTION',
        selector: row => row.desc,
        minWidth: '200px'
    },
    {
        name: 'PASS/FAIL',
        selector: row => row.passFail,
        minWidth: '210px'
    },
    {
        name: 'GRADE POINT',
        selector: row => row.gradePoint,
        minWidth: '150px'
    }, {
        name: '',
        selector: row => row.remove,
        minWidth: '50px'
    }
]
