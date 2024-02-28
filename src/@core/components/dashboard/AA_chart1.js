import React, { Component } from 'react'
import CanvasJSReact from '@canvasjs/react-charts'
import {Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Row} from "reactstrap"
import moment from "moment"

const CanvasJS = CanvasJSReact.CanvasJS
const CanvasJSChart = CanvasJSReact.CanvasJSChart
class ChartSample extends Component {

    state={
        rSelected:'MONTH',
        options:  {
            theme: "light2",
            animationEnabled: true,
            exportEnabled: false,
            title: {
                text: "Registration Counts",
                fontFamily: "Montserrat",
                fontSize:14
            },
            axisY: {
                title: "No. of students",
                titleFontFamily: "Montserrat",
                titleFontSize: 12,
                gridThickness: 0
            },
            toolTip: {
                shared: true
            },
            legend: {
                verticalAlign: "bottom",
                horizontalAlign: "bottom",
                reversed: true,
                cursor: "pointer",
                itemclick: this.toggleDataSeries
            },
            data: [
                {
                    type: "spline",
                    name: "IT",
                    color: '#50AEF4',
                    showInLegend: true,
                    xValueFormatString: "YYYY",
                    dataPoints: [
                        {x: new Date(2023, 11, 0), y: 50},
                        {x: new Date(2023, 12, 0), y: 75},
                        {x: new Date(2024, 1, 0), y: 90},
                        {x: new Date(2024, 2, 0), y: 30}
                    ]
                },
                {
                    type: "spline",
                    name: "Engineering",
                    color:"#3ab011",
                    showInLegend: true,
                    xValueFormatString: "YYYY",
                    dataPoints: [
                        {x: new Date(2023, 11, 0), y: 20},
                        {x: new Date(2023, 12, 0), y: 25},
                        {x: new Date(2024, 1, 0), y: 20},
                        {x: new Date(2024, 2, 0), y: 10}
                    ]
                },
                {
                    type: "spline",
                    name: "Business",
                    color:"#ffb800",
                    showInLegend: true,
                    xValueFormatString: "YYYY",
                    dataPoints: [
                        {x: new Date(2023, 11, 0), y: 30},
                        {x: new Date(2023, 12, 0), y: 40},
                        {x: new Date(2024, 1, 0), y: 35},
                        {x: new Date(2024, 2, 0), y: 20}
                    ]
                },
                {
                    type: "spline",
                    name: "Accountancy",
                    color:"#ff8e29",
                    showInLegend: true,
                    xValueFormatString: "YYYY",
                    dataPoints: [
                        {x: new Date(2023, 11, 0), y: 35},
                        {x: new Date(2023, 12, 0), y: 50},
                        {x: new Date(2024, 1, 0), y: 40},
                        {x: new Date(2024, 2, 0), y: 30}
                    ]
                },
                {
                    type: "spline",
                    color:"#ff0000",
                    name: "Master Business",
                    showInLegend: true,
                    xValueFormatString: "YYYY",
                    dataPoints: [
                        {x: new Date(2023, 11, 0), y: 10},
                        {x: new Date(2023, 12, 0), y: 40},
                        {x: new Date(2024, 1, 0), y: 20},
                        {x: new Date(2024, 2, 0), y: 5}
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

                                <Button color='primary'  outline>
                                    Week
                                </Button>
                                <Button color='primary' active={true} outline>
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