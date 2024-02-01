import React, {Component, useEffect, useState} from "react"
import './_courseSetup.scss'
import {Badge, Button, Col, Input, Label, Row} from "reactstrap"
import Avatar from '@components/avatar'
import {ChevronDown, Plus, X, Edit, ChevronRight} from "react-feather"
import classnames from "classnames"
import Select from "react-select"
import {selectThemeColors, getCookieUserData, titleCase, getFirstTwoLetter} from '@utils'
import DataTable from 'react-data-table-component'
import {
    columns_TableStudent,
    columns_TableAssessment,
    assessmentExpandableTable,
    columns_haaTableAssessment,
    columns_TableAssessmentDates, assessmentDatesExpandableTable,
    columns_haaRepeatRecommendationTableAssessment,
    repeatRecommendationExpandableTable
} from "./tableData"
import config from '@storage'
import rs from '@routes'
import moment from "moment"
import themeConfig from '@configs/themeConfig'

const courseAppliedStatus = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-dark', 'light-primary', 'light-secondary']

class ListSelect extends Component {

    // const [tempData, setTempData] = useState([...data])
    // useEffect(() => {
    //     // tempData.length === 0 && setTempData(data)
    //     setTempData(data)
    // })

    state = {
        data: [],
        search: ''
    }

    componentWillMount() {
        this.setState({data: this.props.data})
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({...this.state, data: nextProps.data})
    }

    getRandomInt = () => {
        const min = Math.ceil(0)
        const max = Math.floor(courseAppliedStatus.length - 1)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    onSearchHandler = async (e) => {
        const val = e.target.value.trim()
        this.setState({search: e.target.value})
        if (val === '') {
            this.setState({data: this.props.data})
        } else {
            const filtered = await this.props.data.filter(i => {
                if (i.name.toLowerCase().includes(val.toLowerCase()) || (i.code && i.code.toLowerCase().includes(val.toLowerCase()))) {
                    return i
                }
            })
            this.setState({data: filtered})
        }

    }

    render() {
        const height = (this.props.options || this.props.showCredits) ? 495 : 440
        const isRepeatRecommendation = window.location.pathname === rs.repeatRecommendation
        const nonGpaLimit = (this.props.creditLimits?.maxCreditLimit - this.props.creditLimits?.minCreditLimit)

        const AssessmentExpandableTable = ({data}) => {
            return (
                <div className='expandable-content p-2'>
                    <Row>
                        {(getCookieUserData().role !== config.haaRole) && <Col lg={6}>
                            <p>
                                <span><span
                                    className='fw-bold'>Issue Date : </span>{data.issueDate ? data.issueDate : 'N/A'}</span>
                            </p>
                        </Col>}

                        <Col lg={6}>
                            <p>
                                <span><span className='fw-bold'>Batches : </span>
                                    {data.batches.length > 0 ? data.batches.map((item, i) => {
                                        return ((data.batches.length - 1) === i) ? item : `${item}, `
                                    }) : 'N/A'}
                                </span>
                            </p>
                        </Col>

                        <Col lg={6}>
                            <p>
                                <span><span className='fw-bold'>Classes : </span>
                                    {data.classes.length > 0 ? data.classes.map((item, i) => {
                                        return ((data.classes.length - 1) === i) ? item : `${item}, `
                                    }) : 'N/A'}
                                </span>
                            </p>
                        </Col>

                        <Col lg={6}>
                            <p>
                                <span><span
                                    className='fw-bold'>Students : </span>{data.noOfStudents ? data.noOfStudents : 'N/A'}</span>
                            </p>
                        </Col>

                        <Col lg={6}>
                            <p>
                                <span><span
                                    className='fw-bold'>Number of Submissions : </span>{data.submissionPercentage ? `${data.submissionPercentage}%` : 'N/Addd'}</span>
                            </p>
                        </Col>
                    </Row>
                </div>
            )
        }

        return <div className={'card-border'}>
            <div className={'card-top'}>
                <label className={'card-title'}>{this.props.title}</label>
                {
                    this.props.onAdd &&
                    <Button color='primary' type='button' size="sm" className="p-05" onClick={this.props.onAdd}>
                        <Plus size={15} color='white'/>
                    </Button>
                }

            </div>
            <div className={'hr'}/>

            <div className={'input-search'}>
                {
                    this.props.options &&
                    <div className='mb-1'>
                        <Select
                            menuPortalTarget={document.body}
                            styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                            value={this.props.selectedOption}
                            onChange={value => this.props.onSelectOption(value)}
                            className={classnames('react-select')}
                            theme={selectThemeColors}
                            classNamePrefix='select'
                            options={this.props.options}
                            isClearable
                            placeholder={this.props.selectPlaceholder ?? "Select Course"}
                        />
                    </div>
                }

                {this.props.inputPlaceholder && <Input
                    value={this.state.search}
                    placeholder={this.props.inputPlaceholder}
                    onChange={this.onSearchHandler}
                />}
            </div>

            {
                this.props.showCredits &&
                <div style={{borderBottom: '1px solid #D8D6DE', paddingBottom: 10, paddingLeft: 15, paddingRight: 15}}>
                    <Label>GPA Credits : <span
                        className={'fw-bold'}>{this.props.creditLimits.totalGpa}/{this.props.creditLimits.minCreditLimit}</span></Label>
                    {nonGpaLimit ? <>
                        <br/>
                        <Label>Non GPA Credits : <span
                            className={'fw-bold'}>{this.props.creditLimits.totalNonGpa}/{nonGpaLimit}</span></Label>
                    </> : null}
                </div>
            }

            <div className={'all-courses'}
                 style={{minHeight: window.innerHeight - height, maxHeight: window.innerHeight - height}}>
                {
                    this.props.avatar && <>
                        {
                            this.state.data.map((item, index) => {
                                let con = item.name.split(' ')[0]

                                if (item.name.split(' ').length > 1) {
                                    con = `${item.name.split(' ')[0]} ${item.name.split(' ')[1]}`
                                }
                                return <div key={index}
                                            className={classnames('courses-list', {'is-select': item.id === this.props.selectedValue})}
                                            onClick={() => {
                                                this.setState({search: ''})
                                                this.props.onSelect(item.id, item)
                                            }}>
                                    <div className={'initial-round'}>
                                        <Avatar color={courseAppliedStatus[item.count ?? this.getRandomInt()]}
                                                content={getFirstTwoLetter(con)}
                                                initials/>
                                    </div>
                                    <div className={'text-content'}>
                                        <div className={'content-name'}>{item.name}</div>
                                        {
                                            item.code && <span className={'content-name'}>{item.code}</span>
                                        }
                                        <br/>
                                        {
                                            this.props.typeAndCredit && <span
                                                className={'content-name'}>{`${titleCase(item.moduleType)} ${item.noOfCredits} Credits`}</span>
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </>
                }

                {
                    this.props.withRemove && <>
                        {
                            this.state.data.map((item, index) => (
                                <div key={index}
                                     className={classnames('level-list', {'is-select': item.id === this.props.selectedValue})}>
                                    <label
                                        className="list-label w-95 cursor-pointer"
                                        onClick={() => {
                                            this.setState({search: ''})
                                            this.props.onSelect(item.id)
                                        }}>{item.name}</label>
                                    <X size={15} onClick={() => this.props.onRemove(item.id)} style={{minWidth: 15}}/>
                                </div>
                            ))
                        }
                    </>
                }

                {
                    this.props.withRemoveAndEdit && <>
                        {
                            this.state.data.map((item, index) => (
                                <div key={index}
                                     className={classnames('level-list', {'is-select': item.id === this.props.selectedValue})}>
                                    <label
                                        className="list-label w-95 cursor-pointer"
                                        onClick={() => {
                                            this.setState({search: ''})
                                            this.props.onSelect(item.id)
                                        }}>{item.name}</label>
                                    <Edit size={15} color={themeConfig.color.primary} onClick={() => this.props.onEdit(item)} style={{minWidth: 15}}/>
                                    <X size={15} onClick={() => this.props.onRemove(item.id)} style={{minWidth: 15}}/>
                                </div>
                            ))
                        }
                    </>
                }

                {
                    this.props.startAndEnd && <>
                        {
                            this.state.data.map((item, index) => (
                                <div key={index}
                                     className={classnames('level-list', {'is-select': item.id === this.props.selectedValue})}>
                                    <div className={'text-content d-flex flex-column'}
                                         onClick={() => {
                                             this.setState({search: ''})
                                             this.props.onSelect(item.id)
                                         }}>
                                        <label className="w-95 cursor-pointer text-12">
                                            <strong>{item.name}</strong>
                                        </label>
                                        {
                                            item.startDate &&
                                            <span
                                                className={'content-name text-12'}>From: {moment(item.startDate).format('YYYY/MM/DD')}</span>
                                        }
                                        {
                                            item.endDate &&
                                            <span
                                                className={'content-name text-12'}>To: {moment(item.endDate).format('YYYY/MM/DD')}</span>
                                        }
                                    </div>

                                    {
                                        this.props.onRemove &&
                                        <X size={15} onClick={() => this.props.onRemove(item.id)}
                                           style={{minWidth: 15}}/>
                                    }

                                </div>
                            ))
                        }
                    </>
                }

                {
                    this.props.textOnly && <>
                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <div key={index}
                                         onClick={() => {
                                             this.setState({search: ''})
                                             this.props.onSelect(item)
                                         }}
                                         className={classnames('level-list', {'is-select': item.id === this.props.selectedValue?.id})}>
                                        <label className="cursor-pointer" style={{marginLeft: 5}}>{item.name}</label>
                                        <ChevronRight size={15} style={{minWidth: 15}}/>
                                    </div>
                                )
                            })
                        }
                    </>
                }

                {
                    this.props.withCodeAndDates && <>
                        {
                            this.state.data.map((item, index) => (
                                <div key={index}
                                     className={classnames('level-list', {'is-select': item.id === this.props.selectedValue?.id})}>
                                    <div className={'text-content d-flex flex-column'}
                                         onClick={() => {
                                             this.setState({search: ''})
                                             this.props.onSelect(item)
                                         }}>
                                        <label className="w-95 cursor-pointer text-12">
                                            <strong>{item.name}</strong>
                                        </label>
                                        {
                                            item.code && <span className={'content-name text-12'}>{item.code}</span>
                                        }
                                        {
                                            item.from &&
                                            <span className={'content-name text-12'}>{item.from} - {item.to}</span>
                                        }
                                    </div>

                                    {
                                        this.props.onEdit ?
                                            <Edit size={15} color={themeConfig.color.primary}
                                                  onClick={() => this.props.onEdit(item)} style={{minWidth: 15}}/> :
                                            <Badge color="light-success" pill>View</Badge>
                                    }

                                </div>
                            ))
                        }
                    </>
                }

                {
                    this.props.avatarWithDates && <>
                        {
                            this.state.data.map((item, index) => {
                                let con = item.name.split(' ')[0]

                                if (item.name.split(' ').length > 1) {
                                    con = `${item.name.split(' ')[0]} ${item.name.split(' ')[1]}`
                                }
                                return <div key={index} className={'level-list'}
                                            onClick={() => {
                                                this.setState({search: ''})
                                                this.props.onSelect(item)
                                            }}>
                                    <div className="d-flex flex-row align-items-center">
                                        <div className={'initial-round mr-05'}>
                                            <Avatar color={courseAppliedStatus[item.count ?? this.getRandomInt()]}
                                                    content={con}
                                                    initials/>
                                        </div>
                                        <div className={'text-content d-flex flex-column'}>
                                            <label className="w-95 cursor-pointer text-12">
                                                <strong>{item.name}</strong>
                                            </label>
                                            {
                                                item.code && <span className={'content-name text-12'}>{item.code}</span>
                                            }
                                            {
                                                item.from &&
                                                <span className={'content-name text-12'}>{item.from} - {item.to}</span>
                                            }
                                        </div>
                                    </div>
                                    <Badge color="light-success" pill>View</Badge>
                                </div>
                            })
                        }
                    </>
                }

                {
                    this.props.avatarWithRemove && <>
                        {
                            this.state.data.map((item, index) => {
                                let con = item.name.split(' ')[0]

                                if (item.name.split(' ').length > 1) {
                                    con = `${item.name.split(' ')[0]} ${item.name.split(' ')[1]}`
                                }
                                return <div key={index} className={'level-list'}>
                                    <div className="d-flex flex-row align-items-center">
                                        <div className={'initial-round mr-05'}>
                                            <Avatar color={courseAppliedStatus[item.count ?? this.getRandomInt()]}
                                                    content={con}
                                                    initials/>
                                        </div>
                                        <div className={'text-content'}>
                                            <div className={'content-name'}>{item.name}</div>
                                            {
                                                item.code && <span className={'content-name'}>{item.code}</span>
                                            }
                                            <br/>
                                            {
                                                this.props.typeAndCredit && <span
                                                    className={'content-name'}>{`${titleCase(item.moduleType)} ${item.noOfCredits} Credits`}</span>
                                            }
                                        </div>
                                    </div>
                                    <X size={15} onClick={() => this.props.onRemove(item.id)} style={{minWidth: 15}}/>
                                </div>
                            })
                        }
                    </>
                }

                {
                    this.props.studentTable && <>
                        <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                data={[...this.state.data]}
                                columns={columns_TableStudent(this.props.onSelect)}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10}/>}
                            />
                        </div>
                    </>
                }

                {
                    this.props.assessmentTable && <>
                        <div className='react-dataTable'>
                            <DataTable
                                noHeader
                                data={this.state.data}
                                columns={this.props.isAssessment ? columns_TableAssessmentDates(this.props.viewStudents, this.props.onEdit, this.props.onRemove)
                                    : (getCookieUserData().role === config.haaRole) ? isRepeatRecommendation ? columns_haaRepeatRecommendationTableAssessment(this.props.onSelect) : columns_haaTableAssessment(this.props.onSelect, this.props.onPublish)
                                        : columns_TableAssessment(this.props.onSelect, this.props.onPublish)}
                                className='react-dataTable'
                                sortIcon={<ChevronDown size={10}/>}
                                expandableRows
                                expandableRowsComponent={(isRepeatRecommendation && getCookieUserData().role === config.haaRole) ? repeatRecommendationExpandableTable : this.props.isAssessment ? assessmentDatesExpandableTable : assessmentExpandableTable}
                            />
                        </div>
                    </>
                }

                {
                    this.props.iconWithValue && <>
                        {
                            this.state.data.map((item, index) => {
                                return (
                                    <div key={index}
                                         onClick={() => {
                                             this.setState({search: ''})
                                             this.props.onSelect(item)
                                         }}
                                         className={classnames('level-list', {'is-select': item.id === this.props.selectedValue?.id})}>
                                        <div className={'list-icon'}>{this.props.icon}</div>
                                        <div style={{width: '100%'}}>
                                            <label className="w-95 cursor-pointer"
                                                   style={{fontWeight: 500}}>{item.name}</label>
                                            <label className="w-95 cursor-pointer"
                                                   style={{fontSize: 12}}>{item.nameSub}</label>
                                        </div>
                                        <span className={'list-value'}>{item.value}%</span>
                                    </div>
                                )
                            })
                        }
                    </>
                }

                {
                    !(this.props.assessmentTable || this.props.studentTable) && this.state.data.length === 0 &&
                    <div style={{textAlign: 'center', padding: '20px 0', color: 'gray'}}>There are no records
                        to display</div>
                }
            </div>
        </div>
    }
}

export default ListSelect
