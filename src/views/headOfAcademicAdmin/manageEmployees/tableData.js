
export const EMPLOYEE_INFORMATION_TABLE_COLUMN = [
    {
        name: 'NAME',
        selector: row => row.name,
        minWidth: '350px'
    }, {
        name: 'USER ROLE',
        selector: row => row.userRole,
        minWidth: '250px'
    }, {
        name: 'STATUS',
        selector: row => row.status,
        minWidth: '70px'
    }, {
        name: 'ACTION',
        selector: row => row.action,
        minWidth: '100px'
    }
]
