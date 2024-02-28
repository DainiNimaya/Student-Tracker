import React from 'react'
import './scss/_configuration.scss'
import IntakeTable from './commonTbl'
import {INTAKE_TABLE_COLUMN} from "./tableData"
import * as apiHaa from '@api/haa'

class Intake extends React.Component {

    state={
        data:[]
    }

    componentDidMount() {
        this.loadIntake()
    }

    loadIntake = async() => {
        const result = await apiHaa.getAllIntakes()
        if (result.length !== 0) {
            this.setState({ data: result })
        } else { this.setState({ data: [] }) }
    }

    changeOngoingStatus = async (data) => {
        const updatedData = { id: data.intakeId, type: 'INTAKE', name:data.intakeName, code:data.intakeCode, ongoing:!data.ongoing }
        const result = await apiHaa.createEditConfig(updatedData)
        if (result === 0) {
            this.loadIntake()
        }
        return result
    }

    render() {
        return (
            <IntakeTable tblData={this.state.data} tblHeader={INTAKE_TABLE_COLUMN} props={this.props}
                         handleOngoing={this.changeOngoingStatus} type={'INTAKE'} headerLbl={'Intake'}
                         btnLbl={'Create an Intake'} loadFunction={this.loadIntake}/>
        )
    }

}

export default Intake