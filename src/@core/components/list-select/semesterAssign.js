import {Button, Card, Col, Input, Label, Offcanvas, OffcanvasBody, OffcanvasHeader, Row} from 'reactstrap'
import Required from "@components/required"
import React, {useState} from "react"
import {X} from 'react-feather'
import Flatpickr from "react-flatpickr"
import {showError} from '@utils'

export default ({open, toggleOpen, onSuccess, batch, levelData}) => {
    const [semesters, setSSemesters] = useState([])

    const [error, setError] = useState([])

    const handleArray = (action, index) => {
        if (action === 'ADD') {
            setSSemesters([
                ...semesters,
                {
                    name: '',
                    startDate: undefined,
                    endDate: undefined
                }
            ])
        } else {
            const data = []
            semesters.map((item, i) => index !== i && data.push(item))
            setSSemesters([...data])
        }
    }

    const onSave = () => {
        const valid = []
        semesters.map((item, index) => {
            if (item.name.isEmpty() || item.startDate === undefined || item.endDate === undefined) {
                valid.push(index)
            }
        })
        setError([...valid])
        if (valid.length > 0) {
            showError()
            return
        }
        onSuccess(semesters)
    }

    return <Offcanvas
        scrollable={true}
        backdrop={true}
        direction='end'
        isOpen={open}
        toggle={toggleOpen}
    >
        <OffcanvasHeader toggle={toggleOpen}>Add Semester</OffcanvasHeader>
        <OffcanvasBody className='mx-0 flex-grow-0 min-h-100'>
            <Row>

                {
                    semesters.map((item, index) => {
                        const invalid = error.filter((e, i) => e === index).length > 0
                        return (
                            <Card key={index}>
                                <div className='d-flex justify-content-end mr-1 mt-1'>
                                    <X size={15} onClick={() => handleArray('REMOVE', index)}
                                       className="cursor-pointer"/>
                                </div>
                                <Row>
                                    <Col className='mb-1' sm='12'>

                                        <Label className='form-label mb-0' for='basicInput'>Semester
                                            Name<Required/></Label>

                                        <Input type='input'
                                               placeholder="Semester Name"
                                               value={item.name}
                                               invalid={invalid}
                                               onChange={e => {
                                                   const arr = [...semesters]
                                                   arr[index].name = e.target.value
                                                   setSSemesters(arr)
                                               }}/>
                                    </Col>

                                    <Col sm={6} className="mb-1">
                                        <Label className='form-label' for='basicInput'>
                                            Start Date
                                        </Label>
                                        <Flatpickr
                                            className={`form-control ${invalid ? 'validation-error-date-picker' : 'validation-ok-dp'}`}
                                            value={item.startDate}
                                            placeholder="From"
                                            options={{
                                                minDate: levelData.startDate,
                                                maxDate: levelData.endDate
                                            }}
                                            onChange={value => {
                                                const arr = [...semesters]
                                                arr[index].startDate = value[0]
                                                setSSemesters(arr)
                                            }}
                                            id='from'/>
                                    </Col>
                                    <Col sm={6} className="mb-1">
                                        <Label className='form-label' for='basicInput'>
                                            End Date
                                        </Label>
                                        <Flatpickr
                                            className={`form-control ${invalid ? 'validation-error-date-picker' : 'validation-ok-dp'}`}
                                            value={item.endDate}
                                            placeholder="To"
                                            options={{
                                                minDate: item.startDate ?? levelData.startDate,
                                                maxDate: levelData.endDate
                                            }}
                                            onChange={value => {
                                                const arr = [...semesters]
                                                arr[index].endDate = value[0]
                                                setSSemesters(arr)
                                            }}
                                            id='to'/>
                                    </Col>
                                </Row>
                            </Card>
                        )
                    })
                }

                <div className='d-flex mt-1 mb-2 justify-content-center'>
                    <Button className='me-1' outline color='primary' type='button'
                            onClick={() => handleArray('ADD')}>
                        + Add Semester
                    </Button>
                </div>

                {
                    semesters.length > 0 &&
                    <Col sm='12'>
                        <div className='d-flex mt-3 justify-content-end pb-5'>
                            <Button className='me-1' outline color='primary' type='button' onClick={toggleOpen}>
                                Cancel
                            </Button>
                            <Button color='primary' type='button' onClick={() => onSave()}>
                                Save
                            </Button>
                        </div>
                    </Col>
                }
            </Row>
        </OffcanvasBody>

    </Offcanvas>
}
