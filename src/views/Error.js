// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Styles
import '@styles/base/pages/page-misc.scss'
import themeConfig from '@configs/themeConfig'

const Error = () => {
  // ** Hooks
  const { skin } = useSkin()
    const logo = (skin === 'dark' ? themeConfig.app.appLogoDarkImage : themeConfig.app.appLogoImage)

  const illustration = skin === 'dark' ? 'not-authorized-dark.svg' : 'not-authorized.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
          <img style={{width : '155px'}} src={logo} alt='logo' />
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>Page Not Found</h2>
          <p className='mb-2'>Oops! The requested URL was not found on this server.</p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            Back to home
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
