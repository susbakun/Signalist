import { usersMock } from '@/assets/mocks'
import { RootState } from '@/shared/types'
import { createSlice } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

const initialState = usersMock

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default usersSlice.reducer
