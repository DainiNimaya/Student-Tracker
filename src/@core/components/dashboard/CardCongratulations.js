// ** Icons Imports
import {AlertCircle, Award} from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {Card, CardBody, CardText} from 'reactstrap'

import Cookies from "js-cookie"
import config from '@storage'
import moment from "moment"
import React, {useEffect, useState} from "react"


const CardCongratulations = (props) => {
    const username = Cookies.get(config.username).split(' ')[0]
    const role = Cookies.get(config.role)
    const [date, setDate] = useState(moment(new Date()).format('LLLL'))

    const updateTime = () => {
        setDate(moment(new Date()).format('LLLL'))

    }

    if (role === config.hofRole ||
        role === config.hosRole ||
        role === config.studentRole ||
        role === config.haaRole) {
        setInterval(updateTime, 60000)
    }

    return (
        <Card className={'card-congratulations'}>
            <CardBody className='text-center'>
                <Avatar icon={<Award size={17}/>} className='shadow' color={'primary'} size='lg'/>
                <div className='text-center'>
                    {
                        role === config.hocRole &&
                        <>
                            <h3 className='mb-1' style={{color: '#fff'}}>Congrats {username},</h3>
                            <CardText className='m-auto' style={{color: '#fff'}}>
                                You have registered <strong>{props.count}</strong> students withing 7 days.
                            </CardText>
                        </>
                    }
                    {

                        (
                            role === config.hofRole ||
                            role === config.studentRole ||
                            role === config.hosRole ||
                            role === config.haaRole
                        ) &&
                        <>
                            <h3 className='mb-1' style={{color: '#ffffff'}}>Hello {username},</h3>
                            <CardText className='m-auto mt-1' style={{color: '#ffffff'}}>
                                <strong>{date}</strong>
                            </CardText>
                        </>

                    }
                </div>
            </CardBody>
        </Card>
    )
}

export default CardCongratulations
