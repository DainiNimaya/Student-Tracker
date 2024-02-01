export const ASSESSMENT_TABLE_COLUMN = [
    {
        name: 'ASSESSMENT TYPE',
        selector: row => row.assessmentType,
        minWidth: '150px'
    }, {
        name: 'Name',
        selector: row => row.name,
        minWidth: '150px'
    }, {
        name: 'PERCENTAGE (100%)',
        selector: row => row.precentage,
        maxWidth: '500px'
    }
]
