import React from "react"
import {Button, Col, FormGroup, Input, Label, Row} from "reactstrap"
import {FILTER_TYPES, DATE_RANGE_FORMAT, FILTERS} from '@const'
import {selectThemeColors} from '@utils'
import Flatpickr from "react-flatpickr"
import Select from "react-select"
import { TimePicker } from 'antd'
import {X, ChevronRight, ChevronUp} from "react-feather"
import './style.scss'

class App extends React.Component {

    state = {
        isAdvancedFilter: false
    }

    async UNSAFE_componentWillMount() {
        await this.initState()
    }

    initState = async () => {
        const data = {}
        this.props.list.map(item => {
            if (item.type === FILTER_TYPES.input || item.type === FILTER_TYPES.number) data[item.name] = item.value ?? ''
            if (item.type === FILTER_TYPES.rangePicker || item.type === FILTER_TYPES.dropDown || item.type === FILTER_TYPES.timeRangePicker) data[item.name] = item.value ?? null
        })
        await this.setState({...data})

    }

    onChange = async (e) => {
        await this.setState({[e.target.name]: e.target.value})
    }

    dateRangeHandler = async (date, name) => {
        if (date.length === 2) {
            await this.setState({[name]: date})
            this.props.onFilter(this.state)
        }
    }

    dateHandler = async (date, name) => {
        if (date.length === 1) {
            await this.setState({[name]: date})
            this.props.onFilter(this.state)
        }
    }

    timeRangeHandler = async (timeString, name) => {
        if (timeString.length === 2) {
            await this.setState({[name]: timeString})
            this.props.onFilter(this.state)
        }
    }

    onDropDownHandler = async (name, e) => {
        await this.setState({[name]: e.value === 'ALL' ? null : e})
        this.props.onFilter(this.state)
    }

    clearFilter = async () => {
        this.props.onFilter(FILTERS, true)
        const data = {}
        this.props.list.map(item => {
            if ((item.type === FILTER_TYPES.input || item.type === FILTER_TYPES.number) && !item.readOnly) data[item.name] = ''
            if (item.type === FILTER_TYPES.rangePicker || item.type === FILTER_TYPES.dropDown || item.type === FILTER_TYPES.timeRangePicker) data[item.name] = item.select ?? null
            if (item.type === FILTER_TYPES.dropDown) {
                if (item.name === 'level' && this.props.isProgressionApproval) {
                    data[item.name] = item.select ?? {value: null, label: item.options[0].label }
                } else {
                    data[item.name] = item.select ?? {value: null, label: 'All'}
                }
            }
        })
        await this.setState({...data})
    }

    render() {
        const {list, onFilter} = this.props

        const state = this.state
        const length = list.length % 4
        const col = length === 0 ? 12 : length === 1 ? 9 : length === 2 ? 6 : 3
        const colFilter = length === 0 ? 12 : length === 1 ? 3 : length === 2 ? 6 : 9
        const colFilterTemp = length === 0 ? 12 : length === 1 ? 9 : length === 2 ? 6 : 3

        return state && <Row className='mt-1 mb-50'>
            {
                list.map((item, index) => {

                    return <>
                        {(this.state.isAdvancedFilter ? true : index < 8) && <>
                            <Col sm={3}>
                                <div className={'mb-1'}>
                                    <Label for={item.name}>{item.label}</Label>

                                    {
                                        item.type === FILTER_TYPES.input &&
                                        <Input
                                            id={item.name}
                                            placeholder={item.placeholder}
                                            onChange={this.onChange}
                                            onKeyDown={(e) => e.keyCode === 13 && onFilter(state)}
                                            name={item.name}
                                            readOnly={item.readOnly}
                                            value={state[item.name]}
                                        />
                                    }

                                    {
                                        item.type === FILTER_TYPES.rangePicker &&
                                        <Flatpickr
                                            className='form-control'
                                            value={state[item.name]}
                                            onChange={item.isSingleDate ? date => this.dateHandler(date, item.name) : date => this.dateRangeHandler(date, item.name)}
                                            id={item.name}
                                            placeholder={item.placeholder}
                                            options={{
                                                dateFormat: DATE_RANGE_FORMAT,
                                                mode: item.isSingleDate ? 'single' : 'range'
                                            }}
                                        />
                                    }

                                    {
                                        item.type === FILTER_TYPES.dropDown &&
                                        <Select
                                            theme={selectThemeColors}
                                            className='react-select'
                                            classNamePrefix='select'
                                            placeholder={item.placeholder}
                                            value={item.default ? item.default : state[item.name]}
                                            options={item.options}
                                            isClearable={false}
                                            menuPortalTarget={document.body}
                                            onChange={(e) => this.onDropDownHandler(item.name, e)}
                                        />
                                    }

                                    {
                                        item.type === FILTER_TYPES.timeRangePicker &&
                                        <TimePicker.RangePicker
                                            format={'HH:mm'}
                                            className='form-control'
                                            value={state[item.name]}
                                            onChange={time => this.timeRangeHandler(time, item.name)}
                                            id={item.name}
                                            placeholder={item.placeholder}
                                        />
                                    }

                                    {
                                        item.type === FILTER_TYPES.number &&
                                        <Input
                                            id={item.name}
                                            placeholder={item.placeholder}
                                            onChange={this.onChange}
                                            onKeyDown={(e) => e.keyCode === 13 && onFilter(state)}
                                            name={item.name}
                                            type='number'
                                            value={state[item.name]}
                                        />
                                    }
                                </div>
                            </Col>
                        </>}
                    </>
                })
            }

            {list.length > 8 && <>
                {this.state.isAdvancedFilter && <Col sm={colFilterTemp}></Col>}
                <Col sm={colFilter} className={'label-advanced'}
                     onClick={() => this.setState({isAdvancedFilter: !this.state.isAdvancedFilter})}>
                    {!this.state.isAdvancedFilter ? <ChevronRight/> :
                        <ChevronUp/>}
                    <span>Advanced Filtration</span>
                </Col>
            </>}

            <Col align={'right'} sm={col} >

                <Button onClick={this.clearFilter} className='custom-btn-clear me-1'>
                    <span className='align-middle ml-50'> Clear</span>
                </Button>

                <Button onClick={() => onFilter(state)} className='custom-btn mt-2' color='primary'>
                    <span className='align-middle ml-50'> Filter</span>
                </Button>

            </Col>
        </Row>
    }
}

export default App
