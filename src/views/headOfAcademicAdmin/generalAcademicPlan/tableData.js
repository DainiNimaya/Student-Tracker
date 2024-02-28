export const GAP_TABLE_COLUMN = [
    {
        name: 'CLASS',
        position: 'fixed',
        width: '220px'
    },
    {
        name: 'MODULE',
        position: 'relative',
        width: '400px'
    },
    {
        name: 'BATCH',
        position: 'relative',
        width: '200px'
    },
    {
        name: '2020',
        position: 'calender'
    }
]

export const CLASS_SLOT_TABLE_COLUMN_1 = [
    {
        name: 'SESSION NAME',
        selector: row => row.slotName,
        width: '200px'
    }, {
        name: 'LECTURER',
        selector: row => row.lecturer,
        minWidth: '250px'
    }, {
        name: 'DAY',
        selector: row => row.day,
        minWidth: '100px'
    }, {
        name: 'TIME DURATION',
        selector: row => row.timeDuration,
        minWidth: '200px'
    }
]

export const CLASS_SLOT_TABLE_COLUMN_2 = [
    {
        name: 'SESSION NAME',
        selector: row => row.slotName,
        width: '200px'
    }, {
        name: 'LECTURER',
        selector: row => row.lecturer,
        minWidth: '250px'
    }, {
        name: 'DAY',
        selector: row => row.day,
        minWidth: '100px'
    }, {
        name: 'TIME DURATION',
        selector: row => row.timeDuration,
        minWidth: '200px'
    }, {
        name: 'ACTION',
        selector: row => row.action,
        minWidth: '200px'
    }
]

export const SLOT_INFO_TABLE_COLUMN = [
    {
        name: '',
        selector: row => row.slotNo,
        width: '100px'
    }, {
        name: 'LECTURER',
        selector: row => row.lecturer,
        minWidth: '250px'
    }, {
        name: 'DATE',
        selector: row => row.date,
        minWidth: '200px'
    }, {
        name: 'TIME DURATION',
        selector: row => row.timeDuration,
        minWidth: '250px'
    }, {
        name: 'VENUE',
        selector: row => row.venue,
        minWidth: '200px'
    }, {
        name: 'AVAILABILITY',
        selector: row => row.availability,
        minWidth: '100px'
    }
]

export const ATTENDANCE_MARKED_STATUS_TABLE_COLUMN = [
    {
        name: '',
        selector: row => row.slotNo,
        width: '100px'
    },
    {
        name: 'DATE',
        selector: row => row.date,
        minWidth: '200px'
    },
    {
        name: 'TIME DURATION',
        selector: row => row.timeDuration,
        minWidth: '250px'
    },
    {
        name: 'VENUE',
        selector: row => row.venue,
        minWidth: '150px'
    },
    {
        name: 'STATUS',
        selector: row => row.attendanceMarkedStatus,
        minWidth: '150px'
    },
    {
        name: 'ATTENDANCE',
        selector: row => row.attendanceMarkingAction,
        width: '200px'
    }
]

export const LECTURE_TABLE_COLUMN = [
    {
        name: 'LECTURER',
        position: 'relative',
        minWidth: '300px'
    },
    {
        name: '2020',
        position: 'calender'
    }
]

export const VENUE_TABLE_COLUMN = [
    {
        name: 'VENUE',
        position: 'relative',
        minWidth: '200px'
    },
    {
        name: 'CAPACITY',
        position: 'relative',
        minWidth: '200px'
    },
    {
        name: '2020',
        position: 'calender'
    }
]

export const SLOT_SETUP_TABLE_COLUMN = [
    {
        name: '',
        selector: row => row.selectAll,
        width: '60px',
        right: true
    },
    {
        name: '',
        selector: row => row.slotNo,
        minWidth: '80px'
    }, {
        name: 'LECTURER',
        selector: row => row.lecturer,
        minWidth: '300px'
    }, {
        name: 'DATE',
        selector: row => row.date,
        minWidth: '200px'
    }, {
        name: 'TIME DURATION',
        selector: row => row.timeDuration,
        minWidth: '300px'
    }, {
        name: 'VENUE',
        selector: row => row.venue,
        minWidth: '300px'
    }, {
        name: 'AVAILABILITY',
        selector: row => row.availability,
        minWidth: '100px'
    }, {
        name: '',
        selector: row => row.action,
        minWidth: '50px'
    }, {
        name: '',
        selector: row => row.remove,
        minWidth: '50px'
    }
]
