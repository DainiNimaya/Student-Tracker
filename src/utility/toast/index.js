// ** React Imports
import {Fragment} from 'react'

// ** Custom Components
import Avatar from '@components/avatar'
import './style.scss'

// ** Third Party Components
import { Check, X, AlertTriangle } from 'react-feather'


const SuccessToast = (props) => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' className="avatar-container" color='success' icon={<Check size={12} />} />
                <h6 className='toast-title' style={{color:'#28c76f'}}>Success!</h6>
            </div>
            <small className='text-muted'></small>
        </div>
        <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
          {props.desc}
      </span>
        </div>
    </Fragment>
)

const WarningToast = (props) => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' className="avatar-container" color='warning' icon={<AlertTriangle size={12}/>}/>
                <h6 className='toast-title' style={{color:'#ff9f43'}}>Warning!</h6>
            </div>
            <small className='text-muted'></small>
        </div>
        <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
          {props.desc}
      </span>
        </div>
    </Fragment>
)

const ErrorToast = (props) => (
    <Fragment>
        <div className='toastify-header'>
            <div className='title-wrapper'>
                <Avatar size='sm' className="avatar-container"  color='danger' icon={<X size={12}/>}/>
                <h6 className='toast-title' style={{color:'#ea5455'}}>Error!</h6>
            </div>
            <small className='text-muted'></small>
        </div>
        <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
        {props.desc}
      </span>
        </div>
    </Fragment>
)

const CommonToast = (props) => (
    <Fragment>
        <div className='toastify-header'>
            {
                props.type === 'success' && <div className='title-wrapper'>
                    <Avatar size='sm' className="avatar-container" color='success' icon={<Check size={12}/>}/>
                    <h6 className='toast-title'>Success!</h6>
                </div>
            }

            {
                props.type === 'warning' &&  <div className='title-wrapper'>
                    <Avatar size='sm' className="avatar-container" color='warning' icon={<AlertTriangle size={12}/>}/>
                    <h6 className='title-warning toast-title'>Warning!</h6>
                </div>
            }

            {
                props.type === 'danger' && <div className='title-wrapper'>
                    <Avatar size='sm' className="avatar-container"  color='danger' icon={<X size={12}/>}/>
                    <h6 className='title-danger toast-title'>Error!</h6>
                </div>
            }
            <small className='text-muted'></small>
        </div>
        <div className='toastify-body'>
      <span role='img' aria-label='toast-text'>
        {props.desc}
      </span>
        </div>
    </Fragment>
)

export {SuccessToast, WarningToast, ErrorToast, CommonToast}
