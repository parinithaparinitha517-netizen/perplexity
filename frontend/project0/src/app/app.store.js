import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/feautures/services/auth.slice'
import chatReducer from '../auth/feautures/services/chat.slice'
export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
    },
})