import React, {useEffect, useRef, useState} from 'react'
import {CSVLink} from "react-csv"
import './style.scss'
import {utils, writeFile} from 'xlsx'
import {getHeadersData, selectThemeColors} from '@utils'
import {Button, Col, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap"
import {EXPORT_TYPES, EXPORT_SIZES, EXPORT_FORMATS} from '@const'
import classnames from "classnames"
import Select from "react-select"
import {toast} from "react-toastify"
import {CommonToast} from "../../../utility/toast"
import themeConfig from '@configs/themeConfig'

const MenuBasic = (props) => {
    const {
        headers,
        data,
        filename,
        onClick,
        btnText,
        outline,
        className,
        textOnly,
        style,
        template,
        csvOnly,
        disabled,
        size
    } = props
    const csvLinkEl = useRef(null)
    const [optionModal, setOptionModal] = useState(false)
    const [exportType, setExportType] = useState(EXPORT_TYPES.CURRENT)
    const [rowSize, setRowSize] = useState(null)
    const [rowRanges, setRowRanges] = useState([])
    const [rowRange, setRowRange] = useState(null)
    const [format, setFormat] = useState(EXPORT_FORMATS[0])

    useEffect(() => {
        clearForm()
    }, [optionModal])

    const onExport = async (type) => {
        if (onClick) {
            const res = await onClick(type, rowSize?.value, rowRange?.value)
            if (res?.content?.length > 0) {
                csvLinkEl.current.link.click()
            } else {
                toast(<CommonToast type={'warning'} desc={"No data to export"}/>, {
                    icon: true,
                    hideProgressBar: true
                })
            }
        } else if (template) {
            csvLinkEl.current.link.click()
        }
    }

    const exportAsExcel = async (type) => {
        if (onClick) {
            const res = await onClick(type, rowSize?.value, rowRange?.value)
            if (res?.content?.length > 0) {
                exportXlsx(res.content)
            } else {
                toast(<CommonToast type={'warning'} desc={"No data to export"}/>, {
                    icon: true,
                    hideProgressBar: true
                })
            }
        } else {
            const tempData = {}
            headers.map(item => {
                tempData[item.key] = ''
            })

            exportXlsx([tempData])
        }
    }

    const exportXlsx = async (data) => {
        const wb = utils.book_new()
        const ws = utils.json_to_sheet(await getHeadersData(headers, data))
        utils.book_append_sheet(wb, ws, filename)
        writeFile(wb, `${filename}.xlsx`)
    }

    const generateRanges = (e) => {
        const a = []
        for (let i = 0; i < e; i++) {
            a.push({
                label: i + 1,
                value: i
            })
        }
        if (a.length > 0) {
            setRowRange(a[0])
        } else {
            setRowRange(null)
        }
        setRowRanges(a)
    }

    const validate = async () => {
        switch (format) {
            case EXPORT_FORMATS[0]:
                await onExport(exportType)
                break

            case EXPORT_FORMATS[1]:
                await exportAsExcel(exportType)
                break
        }
    }

    const getTotalPages = async (e) => {
        setRowSize(e)
        const res = await onClick(EXPORT_TYPES.ALL, e.value, 0, true)
        if (res) {
            generateRanges(res.totalPages)
        }
    }

    const clearForm = () => {
        setRowSize(null)
        setRowRange(null)
        setRowRanges([])
    }

    const exportTemplate = async () => {
        await onExport()
    }

    return (<>
        <div className={`export-btn-container ${className}`} style={style}>
            <CSVLink
                headers={headers}
                data={data}
                ref={csvLinkEl}
                filename={`${filename}.csv`}
            />
            {/*<Menu*/}
            {/*    menuButton={<button*/}
            {/*        className={`btn ${outline ? 'btn-outline-primary' : textOnly ? 'txt-btn' : 'btn-primary'} expand-button  ${size === 'sm' && 'sm-size'}`}>{btnText}*/}
            {/*        {' '}<ChevronDown size={15}/>*/}
            {/*    </button>}*/}
            {/*    transition>*/}
            {/*    <MenuItem onClick={onExport}>*/}
            {/*        <FontAwesomeIcon icon={faFileCsv}/>*/}
            {/*        <label className={'btn-menu'}>csv</label>*/}
            {/*    </MenuItem>*/}

            {/*    <MenuItem onClick={exportAsExcel}>*/}
            {/*        <FontAwesomeIcon icon={faFileExcel}/>*/}
            {/*        <label className={'btn-menu'}>xlsx</label>*/}
            {/*    </MenuItem>*/}
            {/*</Menu>*/}
            {textOnly && <label
                style={{
                    color: themeConfig.color.primary,
                    textDecoration: 'underline',
                    padding: '8px 20px',
                    cursor: 'pointer'
                }} onClick={() => {
                if (csvOnly) {
                    exportTemplate()
                } else {
                    setOptionModal(true)
                }
            }}>{btnText}</label>}

            {!textOnly && <Button className={`expand-button ${textOnly && 'txt-btn'} ${size && 'sm-padding'}`}
                                  style={{color: `${themeConfig.color.primary} !important`}}
                                  color={'primary'}
                                  onClick={() => {
                                      if (csvOnly) {
                                          exportTemplate()
                                      } else {
                                          setOptionModal(true)
                                      }
                                  }}
                                  size={size}
                                  outline={outline} disabled={disabled}>{btnText}</Button>}
        </div>

        {optionModal && <div className='vertically-centered-modal'>
            <Modal isOpen={optionModal} toggle={() => setOptionModal(false)}
                   className='modal-dialog-centered modal-md'
            >
                <ModalHeader toggle={() => setOptionModal(false)}>
                    Export Option
                </ModalHeader>
                <ModalBody>
                    <Row className={'mt-1'}>
                        <Col md={6}>
                            <div>
                                <Input type='radio' id={'current'} checked={exportType === EXPORT_TYPES.CURRENT}
                                       onChange={() => {
                                           clearForm()
                                           setExportType(EXPORT_TYPES.CURRENT)
                                       }}/>{' '}
                                <Label className='form-check-label' for={'current'}>Current Data</Label>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div>
                                <Input type='radio' id={'all'} checked={exportType === EXPORT_TYPES.ALL}
                                       onChange={() => {
                                           clearForm()
                                           setExportType(EXPORT_TYPES.ALL)
                                       }}/>{' '}
                                <Label className='form-check-label' for={'all'}>All Data</Label>
                            </div>
                        </Col>

                        <Col md={exportType === EXPORT_TYPES.ALL ? 4 : 12} className={'mt-2'}>
                            <Label>Format</Label>
                            <Select
                                className={classnames('react-select', {'is-invalid': false})}
                                theme={selectThemeColors}
                                classNamePrefix='select'
                                value={format}
                                options={EXPORT_FORMATS}
                                isClearable={false}
                                onChange={(e) => setFormat(e)}
                                placeholder={'Format'}
                            />
                        </Col>

                        {exportType === EXPORT_TYPES.ALL && <Col md={(rowRanges.length > 0) ? 4 : 8} className={'mt-2'}>
                            <Label>Size</Label>
                            <Select
                                className={classnames('react-select', {'is-invalid': false})}
                                theme={selectThemeColors}
                                classNamePrefix='select'
                                value={rowSize}
                                options={EXPORT_SIZES}
                                isClearable={false}
                                onChange={getTotalPages}
                                placeholder={'Size'}
                            />
                        </Col>}

                        {(exportType === EXPORT_TYPES.ALL && rowRanges.length > 0) && <Col md={4} className={'mt-2'}>
                            <Label>Page</Label>
                            <Select
                                className={classnames('react-select', {'is-invalid': false})}
                                theme={selectThemeColors}
                                classNamePrefix='select'
                                value={rowRange}
                                options={rowRanges}
                                isClearable={false}
                                onChange={(e) => setRowRange(e)}
                                placeholder={'Rows range'}
                            />
                        </Col>}
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color={'primary'} className={'w-100 m-0'} onClick={validate}
                            disabled={(exportType === EXPORT_TYPES.ALL && rowRange === null)}>Export</Button>
                </ModalFooter>
            </Modal>
        </div>}
    </>)
}

export default MenuBasic
