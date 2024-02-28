import {useState} from 'react'

// ** Third Party Components
import classnames from 'classnames'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import {Button, ButtonGroup, Card, CardBody, CardHeader, CardText, CardTitle, Col, Row} from 'reactstrap'
import moment from "moment"
import Cookies from "js-cookie"
import config from '@storage'

const StatsCard = ({cols, data, loadStats, props}) => {
    const role = Cookies.get(config.role)
    const [rSelected, setRSelected] = useState('DAY')
    const [mobile] = useState(window.innerWidth <= 991)

    const renderData = () => {
        return data?.map((item, index) => {
            const colMargin = Object.keys(cols)
            const margin = index === 2 ? 'sm' : colMargin[0]
            return (
                <Col style={{padding: '0', display: 'flex', flexWrap: 'wrap'}}
                     key={index}
                     {...cols}
                     className={classnames({
                         [`mb-2 mb-${margin}-0`]: index !== data.length - 1
                     })}
                >
                    <div className='d-flex align-items-start'>
                        <Avatar color={item.color} icon={item.icon} className='me-1'
                                onClick={() => props.history.push(item.url)}/>
                        <div className='my-auto'>
                            <h4 className='fw-bolder mb-0'>{`${item.title ? item.title : 0}`}</h4>
                            <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
                        </div>
                    </div>
                </Col>
            )
        })
    }

    const date = new Date()

    return (
        <Card className='card-statistics'>
            <CardHeader>
                <CardTitle style={{fontSize: mobile && '1rem'}}>{!loadStats ? 'Statistics' :
                    rSelected === 'MONTH' ? moment(date).format('YYYY MMMM') :
                        rSelected === 'WEEK' ? `${moment(date).format('YYYY MMM DD')} - ${moment(date.setDate(date.getDate() - 7)).format('YYYY MMM DD')}` :
                            moment(date).format('YYYY MMM DD')
                }</CardTitle>
                {
                    loadStats &&
                    <ButtonGroup style={mobile ? {width: '100%', marginTop: 10} : null}>
                        <Button size={mobile && 'sm'} color='primary' onClick={() => {
                            setRSelected('DAY')
                            loadStats('DAY')
                        }} active={rSelected === 'DAY'} outline>
                            Day
                        </Button>

                        <Button size={mobile && 'sm'} color='primary' onClick={() => {
                            setRSelected('WEEK')
                            loadStats('WEEK')
                        }} active={rSelected === 'WEEK'} outline>
                            Week
                        </Button>
                        <Button size={mobile && 'sm'} color='primary' onClick={() => {
                            setRSelected('MONTH')
                            loadStats('MONTH')
                        }} active={rSelected === 'MONTH'} outline>
                            Month
                        </Button>

                    </ButtonGroup>
                }
            </CardHeader>
            <CardBody className='statistics-body'>
                <Row>{renderData()}</Row>
            </CardBody>
        </Card>
    )
}

export default StatsCard
