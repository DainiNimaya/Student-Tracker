// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import config from '@storage'

const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    userData: initialUser()
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state[config.accessTokenKeyName] = action.payload[config.accessTokenKeyName]
      state[config.refreshTokenKeyName] = action.payload[config.refreshTokenKeyName]
      localStorage.setItem('userData', JSON.stringify(action.payload))
      localStorage.setItem(config.accessTokenKeyName, JSON.stringify(action.payload.accessToken))
      localStorage.setItem(config.refreshTokenKeyName, JSON.stringify(action.payload.refreshToken))
    },
    handleLogout: state => {
      state.userData = {}
      state[config.accessTokenKeyName] = null
      state[config.refreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem(config.accessTokenKeyName)
      localStorage.removeItem(config.refreshTokenKeyName)
    }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
