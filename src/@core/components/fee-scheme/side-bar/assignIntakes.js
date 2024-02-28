import React, {useEffect, useState} from "react"
import Sidebar from '@components/sidebar'
import {Label, Row, Col, Input, Badge, Button, Alert} from "reactstrap"
import Select from 'react-select'
import {selectThemeColors, showError, findObject} from '@utils'
import classnames from "classnames"
import Required from "@components/required"
import {assignIntakeErrors} from "@formError/headOfFinance"
import {AlertCircle} from "react-feather"
import './../scss/_repeatSidebar.scss'
import {assignIntakeValidation} from '@validations/headOfFinance'
import ConfirmBox from "@components/confirm-box"
import * as hofApi from '@api/hof'
import themeConfig from '@configs/themeConfig'


class AssignIntakes extends React.Component {

    state = {
        error: assignIntakeErrors,
        intake: [],
        modalStatus: false,
        alertStatus:false
    }


    componentDidMount() {
       this.setState({
           intake:this.props.data
        })
    }


    handleIntakeDropdown = (e) => {
       if (!this.props.isNewScheme && e.length < this.state.intake.length) {
           this.state.intake.map(async intake => {
               const dataObject = findObject(e, intake.value)
               if (dataObject === undefined) {
                   const schemeId = this.props.editSchemeId.viewData.paymentSchemeId
                   const result = await hofApi.checkWhetherIntakeAssignToBatch(schemeId, intake.value)
                   if (result) {
                       this.setState({alertStatus: true})
                   } else {
                       this.setState({intake: e})
                       this.props.changeList('intake', e)
                       this.setState({alertStatus: false})
                   }
               }
           })
       } else {
           this.setState({intake: e})
           this.props.changeList('intake', e)
           this.setState({alertStatus: false})
       }
    }

    validateIntake = () => {
        const res = assignIntakeValidation(this.state.intake)
        this.setState({error: res})
        for (const key in res) {
            if (res[key]) {
                showError()
                return
            }
        }
        this.setState({modalStatus: true})
    }


    render() {

        return (
            <Sidebar
                size='lg'
                open={this.props.open}
                title='Assign Fee Scheme'
                headerClassName='mb-1'
                contentClassName='p-0'
                toggleSidebar={this.props.toggleSidebar}
                className={'course-sidebar'}
            >

                {/*<div className={'heading'}>*/}
                    {/*<Label>Intakes</Label>*/}
                {/*</div>*/}
                <Row>
                    <Col xs={12}>
                        <Label>Intake<Required/></Label>
                        <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            value={this.state.intake}
                            name='colors'
                            options={this.props.intakeList}
                            className={classnames('react-select', {'is-invalid': this.state.error.intake})}
                            classNamePrefix='select'
                            onChange={(e) => this.handleIntakeDropdown(e)}
                            placeholder={'Select Intake'}
                            isDisabled={!this.props.edit}
                            isMulti
                        />
                    </Col>

                    <Col xs={12}>
                        <Label>Programme<Required/></Label>
                        <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            value={this.state.intake}
                            name='colors'
                            options={this.props.intakeList}
                            className={classnames('react-select', {'is-invalid': this.state.error.intake})}
                            classNamePrefix='select'
                            onChange={(e) => this.handleIntakeDropdown(e)}
                            placeholder={'Select Programme'}
                            isDisabled={!this.props.edit}
                            isMulti
                        />
                    </Col>

                    <Col xs={12}>
                        <Label>Course<Required/></Label>
                        <Select
                            isClearable={false}
                            theme={selectThemeColors}
                            value={this.state.intake}
                            name='colors'
                            options={this.props.intakeList}
                            className={classnames('react-select', {'is-invalid': this.state.error.intake})}
                            classNamePrefix='select'
                            onChange={(e) => this.handleIntakeDropdown(e)}
                            placeholder={'Select Course'}
                            isDisabled={!this.props.edit}
                            isMulti
                        />
                    </Col>

                    <Col md={12}>
                        {
                            this.state.alertStatus &&
                            <Alert color='danger' isOpen={true}>
                                <div className='alert-body'>
                                    <AlertCircle size={15}/>
                                    <span className='ms-1'>If there is any batch assigned, unable to remove intake.</span>
                                </div>
                            </Alert>
                        }
                    </Col>
                </Row>

                <div className={'btn-div'}>
                    <Button className='me-1' color='primary' outline onClick={this.props.toggleSidebar}>Cancel</Button>
                    <Button type='submit' color='primary' disabled={!this.props.edit}
                            onClick={() => this.validateIntake()}>Publish</Button>
                </div>

                {
                    this.state.modalStatus &&
                    <ConfirmBox
                        isOpen={true}
                        toggleModal={() => this.setState({modalStatus: false})}
                        yesBtnClick={() => this.props.publishAction()}
                        noBtnClick={() => this.setState({modalStatus: false})}
                        title={`Confirmation`}
                        message={"Are you sure to publish the fee scheme?"}
                        yesBtn="Yes"
                        noBtn="No"
                        icon={<AlertCircle size={40} color={themeConfig.color.primary}/>}
                    />
                }

            </Sidebar>
        )
    }
}

export default AssignIntakes
