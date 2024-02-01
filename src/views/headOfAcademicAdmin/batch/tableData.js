import {Edit} from "react-feather"

export const ALL_BATCH_TABLE_COLUMNS = (onEdit) => {

    return [
        {
            name: 'INTAKE CODE',
            minWidth: '100px',
            selector: row => row.intakeCode,
            cell: row => <strong className="text-primary">{row.intakeCode}</strong>
        },
        {
            name: 'BATCH CODE',
            minWidth: '100px',
            maxWidth: '200px',
            selector: row => row.batchCode
        },
        {
            name: 'BATCH NAME',
            minWidth: '120px',
            selector: row => row.displayName
        },
        {
            name: 'START DATE',
            minWidth: '120px',
            selector: row => row.startDate
        },
        {
            name: 'END DATE',
            minWidth: '120px',
            selector: row => row.endDate
        },
        {
            name: 'ACTIONS',
            width: '120px',
            allowOverflow: true,
            cell: row => {
                return (
                    <div className='d-flex align-items-center'>
                        <Edit size={20}  className="cursor-pointer ms-2"
                              onClick={() => {
                                  onEdit(row.batchId)
                              }}/>
                    </div>
                )
            }
        }
    ]
}
