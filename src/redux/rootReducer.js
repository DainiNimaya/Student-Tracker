// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import profile from './profile'
import filter from './filter'
import listSection from './listSection'

const rootReducer = {
    auth,
    navbar,
    filter,
    layout,
    profile,
    listSection
}

export default rootReducer
