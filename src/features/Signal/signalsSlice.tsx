import { signalsMock } from '@/assets/mocks'
import { createSlice } from '@reduxjs/toolkit'

const initialState = signalsMock

const signalsSlice = createSlice({
  name: 'signals',
  initialState,
  reducers: {}
})

export default signalsSlice.reducer
