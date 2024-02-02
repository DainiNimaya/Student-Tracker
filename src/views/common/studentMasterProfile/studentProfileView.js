import React, {createContext, useContext} from 'react'
import {Card, CardBody, Row, Col, CardTitle, Button, CardHeader} from 'reactstrap'
import GeneralInformation from "@components/student/generalInformation"
import StudentProfileStepper from '@components/student-profile-stepper'
import rs from '@routes'
import {User, X, Edit} from "react-feather"
import './scss/_studentProfileView.scss'
import Cookies from "js-cookie"
import config from '@storage'
import {SMP_EDIT_ACCESS_ROLES, SMP_FINANCE_EDIT_ACCESS_ROLES} from '@const'

class StudentProfileView extends React.Component {
    state = {
        studentId: '',
        cb: '',
        editMode: false,
        role: JSON.parse(Cookies.get(config.user)).role,
        generalData: null
    }

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.setState({
                studentId: this.props.location.state.studentId,
                cb: this.props.location.state.cb,
                editMode: SMP_FINANCE_EDIT_ACCESS_ROLES.includes(this.state.role)
            })
        }
    }

    onEditMode = () => {
        this.setState({editMode: !this.state.editMode})
    }

    onLoadPropData = (data) => {
        this.setState({
            ...this.state,
            generalData: data
        })
    }

    render() {
        const {role} = this.state

        return (
            <div>
                <StudentProfileStepper props={{...this.props, ...this.state.generalData}}
                                       studentId={this.state.studentId} cb={this.state.cb}
                                       edit={this.state.editMode}/>
            </div>
        )
    }
}

export default StudentProfileView
