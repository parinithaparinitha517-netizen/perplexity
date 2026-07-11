import {configureStore} from '@reduxjs/toolkit'
import {authReducer} from '../../auth/feautures/services/auth.slice'
const store=configureStore({
    reducer:{
        auth:authReducer
    }
})