import {createSlice} from '@reduxjs/toolkit'
import {LIST_SECTION} from '@const'

export const listSlice = createSlice({
    name: 'list',
    initialState: {
        list: LIST_SECTION
    },
    reducers: {
        handleFilter: (state, action) => {
            state.list = action.payload
        }

    }
})

const {actions, reducer} = listSlice
export const {handleFilter} = actions
export default reducer
