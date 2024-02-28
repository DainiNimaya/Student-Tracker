import React, {Component} from "react"
import {Calendar, ChevronDown, Plus} from "react-feather"
import {Button} from "reactstrap"
import './classSlot.scss'
import DataTable from "react-data-table-component"
import {getCookieUserData} from '@utils'
import config from '@storage'

class classSlot extends Component {
    render() {
        return <>
            <div className={'class-slot-section'}>
                <div className={'top-header'}>
                    <div className="d-flex align-items-center">
                        <Calendar size={20} className="me-1"/> <label className={'lbl-class'}>{this.props.title}</label>
                    </div>
                    {
                        getCookieUserData().role === config.haaRole &&
                    <Button size={'sm'} onClick={this.props.addSlot} color={'primary'} outline><Plus
                        size={15}/> {this.props.btnLbl}</Button>
                    }
                </div>
                <div className='react-dataTable'>
                    <DataTable
                        noHeader
                        data={this.props.data}
                        columns={this.props.tblColumns}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10}/>}
                    />
                </div>
            </div>
        </>
    }
}

export default classSlot
