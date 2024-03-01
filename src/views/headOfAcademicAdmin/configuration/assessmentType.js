import React from 'react'
import AssessmentTable from './commonTbl'
import {ASSESSMENT_TYPE_TABLE_COLUMN} from "./tableData"
import * as apiHaa from '@api/haa_'

class AssessmentType extends React.Component {

    state = {
        data: []
    }

    componentDidMount() {
        this.loadAssessment()
    }

    loadAssessment = async () => {
        const result = await apiHaa.getAllAssessmentTypes()
        if (result.length !== 0) {
            this.setState({data: result})
        } else {
            this.setState({data: []})
        }
    }

    render() {
        return (
            <AssessmentTable tblData={this.state.data} tblHeader={ASSESSMENT_TYPE_TABLE_COLUMN} props={this.props}
                             type={'ASSESSMENT'} headerLbl={'Assessment Type'} btnLbl={'Create Assessment Type'}
                             loadFunction={this.loadAssessment}/>
        )
    }

}

export default AssessmentType