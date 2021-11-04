import {configureStore} from '@reduxjs/toolkit'
import {goalReducer} from '../GlobalState/CreateSlice'
import {userReducer} from '../GlobalState/UserSideSlice'
import logger from 'redux-logger'


export const store = configureStore({
    reducer:{
     goalReducer,
     userReducer,
    //  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    }
})