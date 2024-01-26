// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        details : null
    },
    reducers: {
        handleProfile: (state, action) => {
            state.details = action.payload
        }

    }
})

export const {
    handleProfile
} = profileSlice.actions

export default profileSlice.reducer
