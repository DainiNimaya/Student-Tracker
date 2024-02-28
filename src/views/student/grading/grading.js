import React from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, Label} from 'reactstrap'
import Filter from "@components/filter"
import {COLOR_STATUS, ROLES, FILTERS, FILTER_TYPES, MARK_ATTENDANCE_TEMPLATE_CSV_HEADER} from '@const'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import DataTable from "react-data-table-component"
import {GRADING_TABLE} from './tableData'

class Grading extends React.Component {

    state={
        data:[
            {
                moduleName:'Web Application Project Management',
                moduleCode:'CPU6002',
                assessmentName:'ABC',
                assessmentType:'Project',
                mark:'58',
                grade:'C',
                result:'Pass',
                credits:'20',
                attempt:'1'
            }
        ]
    }


    render() {

        return (
            <Card>
                <CardHeader>
                    <CardTitle tag='h4'>Grading</CardTitle>
                </CardHeader>
                <CardBody>
                    <Filter
                        list={[
                            {
                                type: FILTER_TYPES.dropDown,
                                name: 'module',
                                label: 'Module',
                                placeholder: 'All',
                                options: [],
                                value: this.props.filter.module
                            }
                        ]}
                        onFilter={this.onFilterHandler}
                    />
                    <div className='react-dataTable mt-2'>
                        <DataTable
                            noHeader
                            pagination={false}
                            data={this.state.data}
                            columns={GRADING_TABLE}
                            className='react-dataTable'
                        />
                    </div>
                </CardBody>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(Grading)