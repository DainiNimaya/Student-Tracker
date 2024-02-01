export const MODULE_TABLE_COLUMN = [
    {
        name: 'MODULE',
        selector: row => row.name,
        width: '30%'
    },
    {
        name: 'GRADING SCHEME',
        selector: row => row.grading,
        // width: 'max-content',
        width: '20%'
    },
    {
        name: 'ASSESSMENT SCHEME',
        selector: row => row.assessment,
        width: '20%'
    },
    {
        name: 'MODULE TYPE',
        selector: row => row.type,
        width: '15%'
    },
    {
        name: 'ACTION',
        selector: row => row.action,
        width: '15%'
    }
]
