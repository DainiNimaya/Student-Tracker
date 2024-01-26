// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import {FILTERS} from '@const'

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        filter : FILTERS
    },
    reducers: {
        handleFilter: (state, action) => {
            state.filter = action.payload
        }

    }
})

const { actions, reducer } = filterSlice
export const { handleFilter } = actions
export default reducer
