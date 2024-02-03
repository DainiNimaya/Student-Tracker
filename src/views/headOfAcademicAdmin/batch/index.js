import React, {Fragment} from "react"
import {Button, Card, CardBody, CardHeader, CardTitle} from "reactstrap"
import {ChevronDown, HelpCircle, Plus, Upload} from "react-feather"
import BatchModal from '@components/batch-modal'
import {BATCHES_EXPORT_TEMPLATE_CSV_HEADER, FILTER_TYPES, FILTERS, STUDY_MODES} from '@const'
import * as Api from "@api/haa_"
import DataTable from "react-data-table-component"
import CustomPagination from "@components/customPagination"
import {ALL_BATCH_TABLE_COLUMNS} from "./tableData"
import Filter from "@components/filter"
import * as ApiC from "@api/counselor_"
import {connect} from "react-redux"
import {handleFilter} from '@store/filter'
import rs from '@routes'
import {CSVLink} from "react-csv"
import {toast} from "react-toastify"
import ConfirmBox from "@components/confirm-box"
import ExportMenu from '@components/export-menu'


const all = {value: null, label: 'All'}

class App extends React.Component {

    csvLinkEl = React.createRef()
    state = {
        modelOpen: undefined,
        openMessage: false,
        batchId: false,
        intakes: [],
        batches: [],
        exportData: [],

        currentPage: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0,
        offset: 0,
        showFilter: false
    }

    async componentWillMount() {
        if (this.props.filter.route === undefined) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.haaBatch}))
        } else if (this.props.filter.route !== rs.haaBatch) {
            await this.props.dispatch(handleFilter({...FILTERS, route: rs.haaBatch}))
        }

        this.setState({ showFilter: true })
        let intakes = [all]
        const INTAKES = await ApiC.getAllIntakes()
        intakes = INTAKES.map(item => {
            return {label: item.intakeCode, value: item.intakeId}
        })
        await this.setState({intakes})
        await this.getAllBatches()

    }

    toggleModel = async (onSave) => {
        await this.setState({modelOpen: !this.state.modelOpen})
        if (onSave) {
            await this.getAllBatches()
        }
    }

    onFilterHandler = async (data) => {
        this.setState({ currentPage: 0 })
        await this.props.dispatch(handleFilter({...data, route: rs.haaBatch}))
        await this.getAllBatches()
    }

    getStudentByBatchId = async (id) => {
         let isStudentFound = false
        const res = await Api.getNoOfStudentInBatch()
        res.content.map((item) => {
            if (item.batchId === id) {
               if (item.noOfStudents > 0) {
                  isStudentFound = true
               } else {
                   isStudentFound = false
               }
            }
        })
        return isStudentFound === true ? isStudentFound : false

        // console.log(res)
        // if (res.content.noOfStudents > 0) {
        //     return true
        // } else {
        //     return false
        // }
    }

    getAllBatches = async () => {
        const res = await Api.getAllBatches(this.createUrl(10, this.state.currentPage, this.props.filter, true))
        if (res) {
            let count = 0
            this.setState({
                data: res.content.map((item, index) => {
                    const d = {
                        ...item,
                        count,
                        index
                    }
                    count > 6 ? count = 0 : count += 1
                    return d
                }),
                numberOfElements: res.numberOfElements,
                totalElements: res.totalElements,
                totalPages: res.totalPages,
                offset: res.pageable.offset,
                pageSize: res.pageable.pageSize
            })
        }
    }

    createUrl = (size, index, filters, dataNeeded) => {
        let url = `batches?size=${size}&index=${index}&dataNeeded=${dataNeeded}`
        if (filters.batchCode && !filters.batchCode.isEmpty()) {
            url += `&batchCode=${filters.batchCode}`
        }

        if (filters.studyMode && filters.studyMode.value !== null) {
            url += `&studyMood=${filters.studyMode.value}`
        }

        if (filters.intake && filters.intake.value !== null) {
            url += `&intake=${filters.intake.value}`
        }
        return url
    }

    handlePagination = async (val) => {
        await this.setState({currentPage: (val.selected)})
        await this.getAllBatches()
    }

    onRowSelect = async (id) => {
        this.setState({batchId: id})
        await this.toggleModel()

        // if (id !== undefined) {
        //     // const res = await this.getStudentByBatchId(id)
        //     if (res) {
        //         this.setState({openMessage: true})
        //     } else {
        //         await this.toggleModel()
        //     }
        // } else {
        //
        // }
    }

    exportData = async (type, size, page, isGetPages) => {
        const res = await Api.getAllBatches(this.createUrl(size ? size : 10, page !== undefined ? page : this.state.currentPage, this.props.filter, !isGetPages))
        if (res?.content && res?.content.length > 0) {
            await this.setState({exportData: res.content})
        }
        return res
    }

    render() {
        const {currentPage, numberOfElements, totalElements, totalPages, offset} = this.state

        return <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle style={{lineHeight: 2}} tag='h4'>Batch</CardTitle>

                    <div className='d-flex align-items-center'>
                        <Button onClick={async () => this.onRowSelect(undefined, undefined)} size='sm' type='button' className="me-1"
                                color='primary'>
                            <Plus size={15}/>
                            Add New Batch
                        </Button>

                        <ExportMenu
                            headers={BATCHES_EXPORT_TEMPLATE_CSV_HEADER}
                            filename={'batches'}
                            data={this.state.exportData}
                            onClick={this.exportData}
                            btnText={'Export'}
                            outline
                            size={'sm'}
                        />
                        {/*<CSVLink*/}
                        {/*    headers={BATCHES_EXPORT_TEMPLATE_CSV_HEADER}*/}
                        {/*    data={this.state.exportData}*/}
                        {/*    ref={this.csvLinkEl}*/}
                        {/*    filename={"batches.csv"}*/}
                        {/*/>*/}
                        {/*<Button onClick={this.exportData} className={'top-custom-btn ms-1'} color='primary' size='sm'*/}
                        {/*        outline>*/}
                        {/*    <Upload size={15}/>*/}
                        {/*    <span className='align-middle ml-50'> Export </span>*/}
                        {/*</Button>*/}
                    </div>
                </CardHeader>

                <CardBody>
                    {
                        this.state.showFilter &&
                        <Filter
                            list={[
                                {
                                    type: FILTER_TYPES.input,
                                    name: 'batchCode',
                                    label: ' Batch Code',
                                    placeholder: '2021690'
                                },
                                {
                                    type: FILTER_TYPES.dropDown,
                                    name: 'intake',
                                    label: ' Intake',
                                    placeholder: 'All',
                                    options: this.state.intakes
                                }
                                // {
                                //     type: FILTER_TYPES.dropDown,
                                //     name: 'studyMode',
                                //     label: "Study Mode",
                                //     placeholder: 'All',
                                //     options: [{label: "All", value: null}, ...STUDY_MODES]
                                // }
                            ]}
                            onFilter={this.onFilterHandler}
                        />
                    }
                </CardBody>

                <div className='react-dataTable mt-2'>
                    <DataTable
                        noHeader
                        pagination
                        data={this.state.data}
                        columns={ALL_BATCH_TABLE_COLUMNS(this.onRowSelect)}
                        className='react-dataTable'
                        sortIcon={<ChevronDown size={10}/>}
                        paginationDefaultPage={this.state.currentPage + 1}
                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                        paginationComponent={() => CustomPagination({
                            currentPage,
                            numberOfElements,
                            totalElements,
                            totalPages,
                            offset,
                            handlePagination: page => this.handlePagination(page)
                        })}
                    />
                </div>

            </Card>

            {
                this.state.modelOpen && <BatchModal
                    visible={this.state.modelOpen}
                    toggleModal={() => this.toggleModel(false)}
                    title={this.state.batchId ? "Edit Batch" : 'Create Batch'}
                    batchId={this.state.batchId}
                    onSave={() => this.toggleModel(true)}
                />
            }

            <ConfirmBox
                isOpen={this.state.openMessage}
                toggleModal={() => this.setState({openMessage: false})}
                yesBtnClick={async () => {
                    this.setState({openMessage: false})
                    await this.toggleModel()
                }
                }
                noBtnClick={() => {
                    this.setState({openMessage: false})
                }}
                title={'Warning'}
                message={'There are assigned students in this batch'}
                yesBtn="Ok"
                noBtn="Cancel"
                icon={<HelpCircle size={40} color="#FF9F43"/>}
            />

        </Fragment>
    }
}

const mapStateToProps = (state) => ({
    filter: state.filter.filter
})

export default connect(mapStateToProps)(App)
