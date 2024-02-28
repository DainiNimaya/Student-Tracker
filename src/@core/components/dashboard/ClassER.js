import React, { Component } from 'react'
import CanvasJSReact from '@canvasjs/react-charts'
import {Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Row} from "reactstrap"
import moment from "moment"

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart
class ChartSample extends Component {

    state={
        rSelected:'WEEK',
        options: {
            title: {
                text: "Transaction Counts",
                fontFamily: "Montserrat",
                fontSize:14,
                fontWeight:900
            },
            axisY: [
                {
                    title: "No. of payments",
                    titleFontFamily: "Montserrat",
                    titleFontSize: 12,
                    gridThickness: 0
                }
            ],
            axisX: [
                {
                    title: "Days",
                    titleFontFamily: "Montserrat",
                    titleFontSize: 12
                }
            ],
            data: [
                {
                    color: '#50AEF4',
                type: "column",
                dataPoints: [
                    { label: "Jan 03",  y: 10  },
                    { label: "Jan 04", y: 25  },
                    { label: "Jan 05",  y: 15  },
                    { label: "Jan 06",  y: 28  },
                    { label: "Jan 07",  y: 10  },
                    { label: "Jan 08",  y: 45  },
                    { label: "Jan 09", y: 23  }
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

                                <Button color='primary' active={true} outline>
                                    Week
                                </Button>
                                <Button color='primary' outline>
                                    Month
                                </Button>

                            </ButtonGroup>

                    </CardHeader>
                    <CardBody className='statistics-body'>
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