import React, {useEffect, useRef, useState} from 'react'
import './scss/_style.scss'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Button, Label, Input} from 'reactstrap'
import DataTable from "react-data-table-component"
import {PROGRAMME_TABLE_COLUMN} from "./tableData"
import CustomPagination from "@components/customPagination"
import {Plus, Edit, Upload, X} from 'react-feather'
import Avatar from '@components/avatar'
import ProgrammeModal from '@components/programmeModal'
import * as apiHaa from "@api/haa_"
import {getFirstTwoLetter} from '@utils'


const ProgrammeDetail = (props) => {

    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [offset, setOffset] = useState(0)
    const [numberOfElements, setNumberOfElements] = useState(0)
    const [programmeOpen, setProgrammeOpen] = useState(false)
    const [manageType, setManageType] = useState('')
    const [programmeList, setProgrammeList] = useState([])
    const [editProgrammeId, setEditProgrammeId] = useState(undefined)
    const [name, setName] = useState('')

    useEffect(() => {
        loadProgrammeData()
    }, [])

    const loadProgrammeData = async () => {
        const programmes =  await apiHaa.getAllProgramme(name,currentPage, 10)

        if (programmes !== undefined && programmes.length !== 0) {
            setProgrammeList(programmes.content)
            setTotalElements(programmes.totalElements)
            setTotalPages(programmes.totalPages)
            setNumberOfElements(programmes.numberOfElements)
            setOffset(programmes.pageable.offset)
        }

    }

    const loadData = () => {
        const tableData = []
        if (programmeList.length !== 0) {
            programmeList.map(programme => {
                tableData.push(
                    {
                        name:<div className='d-flex align-items-center'>
                            <Avatar color={`light-primary`} content={getFirstTwoLetter(programme.name ? programme.name : 'N')} initials/>
                            <div className='user-info text-truncate ms-1' id={'name-div'}>
                                <span className='d-block fw-bold text-truncate'>{programme.name}</span>
                            </div>
                        </div>,
                        description:programme.desc,
                        action: <Edit size={16} className={'edit-icon'} onClick={() => handleModals({type:'edit',id:programme.programmeId})}/>
                    }
                )
            })
        }
        return tableData
    }

    const handleModals = (data) => {
        switch (data.type) {
            case 'add':
                setManageType('add')
                setProgrammeOpen(true)
                break
            case 'edit':
                setManageType('edit')
                setEditProgrammeId(data.id)
                setProgrammeOpen(true)
                break
            case 'close':
                setEditProgrammeId(undefined)
                setProgrammeOpen(false)
                break

        }
    }

    const programmeSaved = () => {
        setEditProgrammeId(undefined)
        setProgrammeOpen(false)
        loadProgrammeData()
    }


    return (
        <Card className={'haa-courses'} style={{height:'100%'}}>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                <CardTitle tag='h4'>Programmes</CardTitle>
                <div className='d-flex mt-md-0 mt-1'>
                    <Button className='ms-2' color='primary' size={'sm'} onClick={() => handleModals({type:'add'})}>
                        <Plus size={15} />
                        <span className='align-middle ms-50'>Add Programme</span>
                    </Button>
                </div>
            </CardHeader>
            <Row className='justify-content-start mx-0'>
                <Col className='mt-1' md='3' sm='12' style={{paddingLeft:'1.5rem'}}>
                    <Label>Programme</Label>
                    <Input
                        className='mb-0'
                        type='text'
                        id='search-input'
                        placeholder={'Search by Name'}
                        name={'name'} value={name}
                        // onChange={(e) => setName(e.target.value)} onKeyDown={onChangeText}
                    />
                </Col>
                <Col xs={9} className='pl-0'>
                    <Button className='course-custom-btn-clear me-1' size='sm'>
                        <span className='align-middle ml-50'> Clear</span>
                    </Button>

                    <Button className='course-custom-btn mt-2' color='primary' size='sm'>
                        <span className='align-middle ml-50'> Filter</span>
                    </Button>
                </Col>
            </Row>
            <div className='react-dataTable'>
                <DataTable
                    noHeader
                    pagination
                    columns={PROGRAMME_TABLE_COLUMN}
                    paginationPerPage={40}
                    className='react-dataTable'
                    paginationDefaultPage={currentPage + 1}
                    paginationComponent={() => CustomPagination({
                        currentPage,
                        numberOfElements,
                        totalElements,
                        totalPages,
                        offset,
                        handlePagination: page => handlePagination(page)
                    })}
                    data={loadData()}
                />
            </div>
            {
                programmeOpen && <ProgrammeModal visible={programmeOpen} modalFunction={handleModals} manageType={manageType}
                                           programmeId={editProgrammeId} callback={programmeSaved}/>
            }
        </Card>
    )

}

export default ProgrammeDetail
