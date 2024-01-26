// ** React Imports
import React, {Fragment, useState} from 'react'

// ** Dropdowns Imports
import UserDropdown from './UserDropdown'

// ** Third Party Components
import { Sun, Moon, Plus } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink, Button} from 'reactstrap'
import Cookies from "js-cookie"
import config from '@storage'
import rs from '@routes'
import TransactionModal from '@components/new-transaction'
import {isMobile} from "react-device-detect"
import NotificationDropdown from "./NotificationDropdown"


const NavbarUser = props => {
  // ** Props
  const { skin, setSkin } = props

  const [transactionModal,setTransactionModal] = useState(false)

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' onClick={() => setSkin('dark')} />
    }
  }

  const userRole = Cookies.get(config.role)

  const handleTransModal = () => {
      setTransactionModal(!transactionModal)
  }

  return (
    <Fragment>
      <div className='bookmark-wrapper d-flex align-items-center'>
          {
              userRole === config.feRole && <Button color='primary' onClick={() => handleTransModal()}><Plus size={16}/> New Transaction</Button>
          }
          {
              ((userRole === config.counsellorRole || userRole === config.hocRole) && window.location.pathname === rs.dashboard) &&
              <Button color='primary' onClick={() => props.props.history.push(rs.newInquiry)}><Plus size={16}/> New Inquiry</Button>
          }

      </div>
      {
        userRole &&
          <ul className='nav navbar-nav align-items-center ms-auto'>
              <NavItem className='d-none d-lg-block'>
                  <NavLink className='nav-link-style'>
                      <ThemeToggler />
                  </NavLink>
              </NavItem>
              {
                  userRole !== 'GUEST' && <>
                  {!isMobile &&  <NotificationDropdown /> }
                      <UserDropdown props={props.props}/>
                  </>
              }
          </ul>
      }
      {
          transactionModal && <TransactionModal close={handleTransModal} visible={transactionModal} props={props.props}/>
      }

   </Fragment>
  )
}
export default NavbarUser
