export const PAYMENT_PLAN_TABLE_COLUMN_1 = (currency) => [
  {
        name: 'FEE DESCRIPTION',
        selector: row => row.feeDescription,
        width: '200px'
    }, {
        name: 'FEE TYPE',
        selector: row => row.feeType,
        width: '250px'
    }, {
        name: 'DUE DATE',
        selector: row => row.dueDate,
        width: '150px'
    }, {
        name: `AMOUNT(${currency})`,
        selector: row => row.amount,
        width: '150px',
        right: true
    }, {
        name: 'LATE FEE',
        selector: row => row.duePayment,
        width: '150px',
        right: true
    }, {
        name: `TAX AMOUNT(${currency})`,
        selector: row => row.tax,
        width: '180px'
    }, {
        name: `AMOUNT PAYABLE(${currency})`,
        selector: row => row.payable,
        width: '210px',
        right: true
    }, {
        name: 'BANK SLIP',
        selector: row => row.receipt,
        width: '120px'
    }, {
        name: `PAID AMOUNT(${currency})`,
        selector: row => row.payment,
        width: '180px',
        right: true
    }, {
        name: 'ACTION',
        selector: row => row.action,
        width: '340px'
    }
]