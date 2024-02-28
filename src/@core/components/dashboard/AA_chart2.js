import React, { Component } from 'react'
import CanvasJSReact from '@canvasjs/react-charts'
import {Button, ButtonGroup, Card, CardBody, CardHeader, CardTitle, Row} from "reactstrap"
import moment from "moment"
import AvatarII from '@components/avatar/avatar'

class ChartSample extends Component {

    state={
        rSelected:'MONTH'
    }

    render() {

        const list = [
            {
                moduleName: "Polarity of Molecules and Its Properties",
                startTime: "22:00:00",
                endTime: "23:00:00",
                classDate: "2024-02-11",
                venueName: "Lab 1",
                lecturerName: "Semini kawshalya"
            },
            {
                moduleName: " Polarity of Molecules",
                startTime: "08:21:00",
                endTime: "11:00:00",
                classDate: "2024-02-11",
                venueName: "Lab 1",
                lecturerName: "Harendra Perera"
            }
        ]

        return (
            <Card className='card-tiny-line-stats' style={{minHeight: 400}}>
                <CardHeader>
                    <h4>Today Classes</h4>
                </CardHeader>
                <div className="d-flex flex-column w-100 pt-0">
                    {
                        list.map(item => {
                            return <div
                                className="d-flex flex-row justify-content-between align-items-center item-hover p-1">
                                <div style={{width: '60%'}}>
                                    <AvatarII count={item.count} name={item.moduleName}
                                              code={`${moment(item.startTime, "h:mm:ss").format("HH:mm")} to ${moment(item.endTime, "h:mm:ss").format("HH:mm")}`}/>
                                </div>
                                <div style={{width: '40%', borderLeft: '1px solid black', paddingLeft: 10}}>
                                    <AvatarII noAvatar={true} name={''} code={`${item.lecturerName}`}/>
                                </div>

                            </div>
                        })
                    }
                </div>
            </Card>
        )
    }
}

export default ChartSample