// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a  rel='noopener noreferrer' className="text-primary">
          Amrak
        </a>
      </span>
      <span className='float-md-end d-none d-md-block'>
        Developed by <a href={'https://ceyentra.com'} target='_blank'>Ceyentra Technologies</a>
      </span>
    </p>
  )
}

export default Footer
