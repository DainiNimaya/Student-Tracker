export const REGISTRATION_TABLE_COLUMN = [
    {
        name: `STUDENT ID`,
        selector: row => row.cbNo,
        minWidth: '100px',
        maxWidth: '250px'

    }, {
        name: 'NAME',
        selector: row => row.name,
        minWidth: '250px',
        maxWidth: '350px',
        wrap: true
    }, {
        name: 'CONTACT',
        selector: row => row.contact,
        minWidth: '250px',
        maxWidth: '350px',
        wrap: true
    }, {
        name: 'REGISTERED DATE',
        selector: row => row.registeredDate,
        minWidth: '100px',
        maxWidth: '200px'
    }, {
        name: 'ACTIONS',
        selector: row => row.actions,
        width: '165px'
    }
]
