import React, { Component } from 'react'
import CanvasJSReact from '@canvasjs/react-charts'
import {Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Row} from "reactstrap"
import moment from "moment"
import classnames from "classnames"
import Select from "react-select"
import {selectThemeColors, findObject, showError} from '@utils'

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart
class ChartSample extends Component {

    state={
        rSelected:'WEEK',
        options: {
            title: {
                text: "Attendance",
                fontFamily: "Montserrat",
                fontSize:14,
                fontWeight:900
            },
            axisY: [
                {
                    title: "Student Count",
                    titleFontFamily: "Montserrat",
                    titleFontSize: 12,
                    gridThickness: 0
                }
            ],
            axisX: [
                {
                    title: "Session Days",
                    titleFontFamily: "Montserrat",
                    titleFontSize: 12
                }
            ],
            data: [
                {
                    color: '#ff8e29',
                type: "column",
                dataPoints: [
                    { label: "Jan 03",  y: 20  },
                    { label: "Jan 10", y: 18  },
                    { label: "Jan 17",  y: 15  },
                    { label: "Jan 24",  y: 10  },
                    { label: "Jan 31",  y: 12  }
                ]
            }
            ]
        }
    }

    render() {
        const {rSelected} = this.state
        const date = new Date()
        return (
            <div>
                <Card className='card-statistics'>
                    <CardHeader>
                        <CardTitle>{
                            rSelected === 'MONTH' ? moment(date).format('YYYY MMMM') :
                                rSelected === 'WEEK' ? `${moment(date).format('YYYY MMM DD')} - ${moment(date.setDate(date.getDate() - 7)).format('YYYY MMM DD')}` :
                                    moment(date).format('YYYY MMM DD')
                        }</CardTitle>
                            <ButtonGroup>
                                <Button color='primary' active={true}  outline>
                                    Daya
                                </Button>
                                <Button color='primary'  outline>
                                    Week
                                </Button>
                                <Button color='primary'  outline>
                                    Month
                                </Button>

                            </ButtonGroup>

                    </CardHeader>
                    <CardBody className='statistics-body pt-0'>
                        <Select
                            theme={selectThemeColors}
                            className={classnames('react-select')}
                            classNamePrefix='select'
                            // value={paymethod}
                            // options={INVOICE_PAYMENT_METHOD}
                            isClearable={false}
                            placeholder={'Select Module'}
                            // onChange={(e) => this.onDropDownHandler(e)}
                        />
                        <CanvasJSChart options = {this.state.options}
                            /* onRef={ref => this.chart = ref} */
                        />
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ChartSample