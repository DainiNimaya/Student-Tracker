export const BANK_TRANSFER_TABLE_COLUMN = [
    {
        name: 'NAME',
        selector: row => row.name,
        minWidth: '250px',
        wrap: true
    }, {
        name: 'CONTACT',
        selector: row => row.contact,
        width: '200px'
    }, {
        name: 'Request Date',
        selector: row => row.requestDate,
        width: '150px'
    },{
        name: 'COURSE',
        selector: row => row.course,
        minWidth: '200px',
        wrap: true
    }, {
        name: 'STATUS',
        selector: row => row.status,
        width: '250px'
    }
]
