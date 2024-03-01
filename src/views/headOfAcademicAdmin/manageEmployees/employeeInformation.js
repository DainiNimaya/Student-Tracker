import React, {Fragment} from 'react'
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Label, Row, UncontrolledTooltip} from 'reactstrap'
import {EMPLOYEE_INFORMATION_TABLE_COLUMN} from './tableData'

import './scss/_employeeInformation.scss'
import Select from 'react-select'
import {selectThemeColors} from '@utils'
import DataTable from 'react-data-table-component'
import Avatar from '@components/avatar/avatar'
import {COLOR_STATUS, ROLES, FILTERS, FILTER_TYPES} from '@const'
import {AlertTriangle, X} from 'react-feather'
import {Number_REGEX} from '@validations/itAdmin'
import EditView from './userCreate'
import CustomPagination from "@components/customPagination"
import rs from '@routes'
import ConfirmBox from "@components/confirm-box"

// service
import * as employeInfoApi from '@api/haa_'
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import Filter from "@components/filter"
import Switch from "@components/switch"
import themeConfig from '@configs/themeConfig'

const all = {label: 'All', value: 'All'}
class EmployeeInformation extends React.Component {

    state = {
        data: [],
        schoolOption: [],
        departmentOption: [],
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        editMode: false,
        editProfile: null,
        offset: 0,
        numberOfElements: 0,
        isConfirm:false,
        changeId:'',
        changeStatus:'',
        showFilter: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.employeeInformation}))
        } else if (this.props.filter.route !== rs.employeeInformation) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.employeeInformation}))
        }
        this.setState({ showFilter:true })
        await this.loadSelectionValues()
    }

    onFilterHandler = async (data) => {
        await this.setState({ currentPage: 0 })
        await this.props.dispatch(handleFilter({...data, route: rs.employeeInformation}))
        this.onFilterAction(0)
    }

    loadSelectionValues = async () => {
        console.log('de')
        const userList = await employeInfoApi.filterUser(this.props.filter, this.state.currentPage)
        this.setState({
            data: userList.dataList,
            totalPages: userList.pages,
            totalElements: userList.elements,
            offset: userList.offset,
            numberOfElements: userList.numberOfElements
        })
    }

    handlePagination = async (val) => {
        await this.onFilterAction(val.selected)
        this.setState({
            currentPage: (val.selected)
        })
    }

    onFilterAction = async (page) => {
        const result = await employeInfoApi.filterUser(this.props.filter, page)
        this.setState({
            data: result.dataList,
            totalPages: result.pages,
            totalElements: result.elements,
            offset: result.offset,
            numberOfElements: result.numberOfElements
        })
    }

    editProfile = (data) => {
        this.props.history.push({pathname:rs.userEdit, state:data})
    }

    changeStatus = async (id, status) => {
        // const result = await employeInfoApi.updateUserStatus(id, status)
        // if (result === 0) {
        //     this.onFilterAction(this.state.currentPage)
        //     this.setState({ isConfirm:false })
        // }
    }

    handleConfirm = (type,id,status) => {
        switch (type) {
            case 'open':
                this.setState({ changeId:id, changeStatus:status, isConfirm:true })
                break
            case 'close':
                this.setState({ isConfirm:false })
                break
        }
    }

    render() {

        const {filter, currentPage, totalElements, totalPages, offset, numberOfElements, isConfirm, changeId, changeStatus} = this.state
        const tableData = []
        const roleOption = [{label: 'All', value: 'All'}]
        const departmentOption = [{label: 'All', value: 'All'}]
        const schoolOption = [{label: 'All', value: 'All'}]
        let count = 0

        if (this.state.data.length !== 0) {
            this.state.data.map((item, i) => {
                tableData.push({
                    name: <Avatar count={count} name={item.name} code={`EMP: ${item.employeeNo}`}/>,
                    department: <div className={'tbl-data'}>{item.department !== null ? item.department.departmentName : 'N/A'}</div>,
                    // school: item.school.length !== 0 ? <>
                    //         <div id={`positionBottom${i}`} className={'tbl-data'}>{item.school.length > 1 ? `${item.school[0].label}...` : item.school[0].label}</div>
                    //     {
                    //         item.school.length > 1 &&
                    //         <UncontrolledTooltip placement='bottom' target={`positionBottom${i}`}>
                    //             {
                    //                 item.school.map(item => {
                    //                     return <div className={'tbl-data'}>{item.label}</div>
                    //                 })
                    //             }
                    //         </UncontrolledTooltip>
                    //     }
                    // </> : 'N/A',
                    userRole: item.roleList.length !== 0 ? <>
                        <div id={`positionBottom${i}`} className={'tbl-data'}>{item.roleList.length > 1 ? `${item.roleList[0].label}...` : item.roleList[0].label}</div>
                        {
                            item.roleList.length > 1 &&
                            <UncontrolledTooltip placement='bottom' target={`positionBottom${i}`}>
                                {
                                    item.roleList.map(item => {
                                        return <div className={'tbl-data'}>{item.label}</div>
                                    })
                                }
                            </UncontrolledTooltip>
                        }
                    </> : 'N/A',
                    action: <Button outline className={'edit-btn'} size={'sm'}
                                    onClick={() => this.editProfile(item)}>Edit</Button>,
                    status:<Switch checked={item.status === 'ACTIVE'}
                                   onChangeAction={() => this.handleConfirm('open', item.id, item.status)}/>
                })
                count > 5 ? count = 0 : count += 1
            })
        }
        const rolesArray = Object.values(ROLES)
        rolesArray.map((item, i) => {
            roleOption.push({label: item.label, value: item.value})
        })

        this.state.schoolOption.map((item, i) => {
            schoolOption.push({label: item.label, value: item.value})
        })

        this.state.departmentOption.map((item, i) => {
            departmentOption.push({label: item.label, value: item.value})
        })


        return (
            <Fragment>
                {!this.state.editMode ?
                    <Card className='employee-info'>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4' className={'heading-empInfo'}>Employee Information</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {
                                this.state.showFilter &&
                                <Filter
                                    list={[
                                        {
                                            type: FILTER_TYPES.input,
                                            name: 'name',
                                            label: 'Employee Name',
                                            placeholder: 'Search by Employee Name',
                                            value: this.props.filter.name
                                        },
                                        {
                                            type: FILTER_TYPES.input,
                                            name: 'employeeNo',
                                            label: 'Employee Number',
                                            placeholder: 'Search by Employee Number',
                                            value: this.props.filter.employeeNo
                                        },
                                        {
                                            type: FILTER_TYPES.dropDown,
                                            name: 'role',
                                            label: 'User Role',
                                            placeholder: 'All',
                                            options: roleOption,
                                            value: this.props.filter.role
                                        }
                                    ]}
                                    onFilter={this.onFilterHandler}
                                />
                            }
                        </CardBody>
                        <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                pagination
                                columns={EMPLOYEE_INFORMATION_TABLE_COLUMN}
                                paginationPerPage={10}
                                className='react-dataTable'
                                paginationDefaultPage={this.state.currentPage + 1}
                                paginationComponent={() => CustomPagination({
                                    currentPage,
                                    numberOfElements,
                                    totalElements,
                                    totalPages,
                                    offset,
                                    handlePagination: page => this.handlePagination(page)
                                })}
                                data={tableData}
                            />
                        </div>
                    </Card> :
                    <EditView editData={this.state.editProfile} backAction={this.editProfile}
                              filterData={this.state.filter} page={this.state.currentPage}
                              reload={this.onFilterAction}/>
                }
                <ConfirmBox
                    isOpen={isConfirm}
                    toggleModal={() => this.handleConfirm('close', changeId, changeStatus)}
                    yesBtnClick={() => this.changeStatus(changeId, changeStatus)}
                    noBtnClick={() => this.handleConfirm('close', changeId, changeStatus)}
                    title={'Confirmation'}
                    message={'Are you sure to change the user status?'}
                    yesBtn="Yes"
                    noBtn="No"
                    icon={<AlertTriangle size={40} color={themeConfig.color.primary}/>}
                />

            </Fragment>
        )
    }

}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(EmployeeInformation)
