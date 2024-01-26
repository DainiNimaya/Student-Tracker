// ** React Imports
import {useEffect} from 'react'
import {NavLink} from 'react-router-dom'

// ** Dark Theme
import {useSkin} from '@hooks/useSkin'

// ** Icons Imports
import {X, Lock, Unlock} from 'react-feather'

// ** Config
import themeConfig from '@configs/themeConfig'

const VerticalMenuHeader = props => {
    // ** Props
    const {menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover} = props
    const {skin} = useSkin()

    // ** Reset open group
    useEffect(() => {
        if (!menuHover && menuCollapsed) setGroupOpen([])
    }, [menuHover, menuCollapsed])

    // ** Menu toggler component
    const Toggler = () => {
        if (!menuCollapsed) {
            return (
                <Unlock
                    size={20}
                    data-tour='toggle-icon'
                    className='text-primary toggle-icon d-none d-xl-block'
                    onClick={() => setMenuCollapsed(true)}
                />
            )
        } else {
            return (
                <Lock
                    size={20}
                    data-tour='toggle-icon'
                    className='text-primary toggle-icon d-none d-xl-block'
                    onClick={() => setMenuCollapsed(false)}
                />
            )
        }
    }

    const logo = menuCollapsed ? themeConfig.app.appLogoFavImage : (skin === 'dark' ? themeConfig.app.appLogoSide : themeConfig.app.appLogoSide)

    return (
        <div className='navbar-header' style={{paddingLeft: menuCollapsed ? 16 : '3.6rem'}}>
            <ul className='nav navbar-nav flex-row'>
                <li className='nav-item me-auto col-9'>
                    <NavLink to='/' className='navbar-brand'>
            <span className='brand-logo'>
              <img src={logo} alt='logo' width={menuCollapsed ? 50 : 'auto'}/>
            </span>
                    </NavLink>
                </li>
                <li className='nav-item nav-toggle'>
                    <div className='nav-link modern-nav-toggle cursor-pointer'>
                        <Toggler/>
                        <X onClick={() => setMenuVisibility(false)} className='toggle-icon icon-x d-block d-xl-none'
                           size={20}/>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default VerticalMenuHeader
