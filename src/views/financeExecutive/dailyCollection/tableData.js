export const DAILY_TRANSACTION_TABLE_COLUMN = [
    {
        name: 'DATE',
        selector: row => row.date,
        width: '130px'
    }, {
        name: 'RECEIPT',
        selector: row => row.receipt,
        width: '130px',
        wrap: true
    }, {
        name: 'STUDENT NAME',
        selector: row => row.name,
        minWidth: '250px',
        maxWidth:'400px',
        wrap: true
    }, {
        name: 'TRANSACTION TYPE',
        selector: row => row.type,
        width: '180px'
    }, {
        name: 'PAYMENT TYPE',
        selector: row => row.paymentType,
        width: '150px'
    }, {
        name: 'ACTION',
        selector: row => row.action,
        width: '140px'
    }
]
