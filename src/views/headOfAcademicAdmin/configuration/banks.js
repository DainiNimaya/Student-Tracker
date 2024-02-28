import React from 'react'
import VenueTable from './commonTbl'
import {BANK_TABLE_COLUMN, VENUE_TABLE_COLUMN} from "./tableData"
import * as apiHaa from '@api/haa'

class Banks extends React.Component {

    state = {
        data: []
    }

    componentDidMount() {
        this.loadBanks()
    }

    loadBanks = async () => {
        const result = await apiHaa.getAllBanks()
        await this.setState({data: result})
    }

    render() {
        return (
            <VenueTable tblData={this.state.data} tblHeader={BANK_TABLE_COLUMN} props={this.props}
                        type={'BANK'} headerLbl={'Bank Details'} btnLbl={'Add Bank'} loadFunction={this.loadBanks}/>
        )
    }

}

export default Banks