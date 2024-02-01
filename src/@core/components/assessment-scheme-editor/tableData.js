export const ASSESSMENT_TABLE_COLUMN = [
    {
        name: 'ASSESSMENT TYPE',
        selector: row => row.assessmentType,
        minWidth: '200px'
    }, {
        name: 'Name',
        selector: row => row.name,
        minWidth: '200px'
    }, {
        name: 'PERCENTAGE (100%)',
        selector: row => row.percentage,
        minWidth: '200px'
    }, {
        name: '',
        selector: row => row.remove,
        maxWidth: '50px'
    }
]
