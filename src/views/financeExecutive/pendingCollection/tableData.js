
export const PENDING_COLLECTION_TABLE_COLUMN = [
   {
        name: 'STUDENT NAME',
        selector: row => row.name,
        minWidth: '280px',
        maxWidth: '400px',
        wrap: true
    }, {
        name: 'DUE DATE',
        selector: row => row.duedate,
        minWidth: '150px',
        maxWidth: '250px'
    },{
        name: 'AMOUNT',
        selector: row => row.amount,
        minWidth: '150px',
        maxWidth: '300px'
    },{
        name: 'LATE FEE',
        selector: row => row.lateFee,
        minWidth: '150px',
        maxWidth: '250px'
    }, {
        name: 'ACTION',
        selector: row => row.action,
        minWidth: '250px'
    }
]