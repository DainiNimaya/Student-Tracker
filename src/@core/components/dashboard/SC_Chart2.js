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
            animationEnabled: true,
            title: {
                text: "Inquiry Types",
                fontFamily: "Montserrat",
                fontSize:14,
                fontWeight:900
            },
            subtitles: [
                {
                    text: "",
                    verticalAlign: "center",
                    fontSize: 24,
                    dockInsidePlotArea: true
                }
            ],
            legend:{
                verticalAlign: "bottom",
                horizontalAlign: "center",
                fontFamily: "Montserrat"
            },
            data: [
                {
                    indexLabelFontFamily: "Montserrat",
                    type: "pie",
                    showInLegend: true,
                    indexLabel: "{name}: {y}",
                    yValueFormatString: "#,###'%'",
                    dataPoints: [
                        { name: "Phone In", y: 40, color:"#ff0000"},
                        { name: "E-Mail", y: 31, color:"#ff8e29" },
                        { name: "Friend", y: 10, color:"#ffb800" },
                        { name: "Walk In", y: 5, color:"#3ab011" },
                        { name: "Exhibition", y: 10, color:"#50AEF4" },
                        { name: "Website", y: 15, color:"#890c85" }
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