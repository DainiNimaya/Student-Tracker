// ** Store Imports
import { handleNavBarStatus } from '@store/layout'
import { useDispatch, useSelector } from 'react-redux'

export const useNavbarStatus = () => {
    // ** Hooks
    const dispatch = useDispatch()
    const store = useSelector(state => state.layout)

    // ** Return a wrapped version of useState's setter function
    const setNavbarStatus = value => {
        dispatch(handleNavBarStatus(value))
    }

    return { navbarStatus: store.navbarStatus, setNavbarStatus }
}