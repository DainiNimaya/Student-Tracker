// ** React Imports
import {useEffect, useState} from 'react'
import { NavLink, useLocation } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

import { useSkin } from '@hooks/useSkin'
import darkManageIcon from "../../../../../assets/images/hos/manageProjectIconDark.png"
import lightManageIcon from "../../../../../assets/images/hos/manageProjectIconLight.png"

const VerticalNavMenuLink = ({
  item,
  activeItem,
  setActiveItem,
  currentActiveItem, items
}) => {

  const skin = useSkin()

  // ** Conditional Link Tag, if item has newTab or externalLink props use <a> tag else use NavLink
  const LinkTag = item.externalLink ? 'a' : NavLink

  // ** Hooks
  const location = useLocation()

  useEffect(() => {
    if (currentActiveItem !== null) {
      setActiveItem(currentActiveItem)

      // if (item.id === 'manage-project') {
      //   item.icon = <img  src={skin.skin === 'dark' ?  darkManageIcon : darkManageIcon} width={20} style={{marginRight : '1.0rem'}}/>
      // } else {
      //   items[7].icon = <img  src={skin.skin === 'dark' ?  darkManageIcon : lightManageIcon} width={20} style={{marginRight : '1.0rem'}}/>
      // }
    }
  }, [location])

  return (
    <li
      className={classnames({
        'nav-item': !item.children,
        disabled: item.disabled,
        active: item.navLink === activeItem
      })}
    >
      <LinkTag
        className='d-flex align-items-center'
        target={item.newTab ? '_blank' : undefined}
        /*eslint-disable */
        {...(item.externalLink === true
          ? {
              href: item.navLink || '/'
            }
          : {
              to: item.navLink || '/',
              isActive: match => {
                if (!match) {
                  return false
                }

                if (
                  match.url &&
                  match.url !== '' &&
                  match.url === item.navLink

                ) {
                  currentActiveItem = item.navLink
                }
              }
            })}
      >

        {item.icon}
        <span className='menu-item text-truncate'>{item.title}</span>
        {item.badge && item.badgeText ? (
          <Badge className='ms-auto me-1' color={item.badge} pill>
            {item.badgeText}
          </Badge>
        ) : null}
      </LinkTag>
    </li>
  )
}

export default VerticalNavMenuLink
