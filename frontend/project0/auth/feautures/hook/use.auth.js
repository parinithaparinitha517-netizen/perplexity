import { useDispatch } from 'react-redux'
import { register, login, getme } from '../services/auth.api'
import { setUser, setLoading, setError } from '../services/auth.slice'

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ username, email, password })
            dispatch(setUser(data.user ?? data))
            return data
        } catch (error) {
            dispatch(setError(error?.message ?? 'Registration failed'))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user ?? data))
            return data
        } catch (error) {
            dispatch(setError(error?.message ?? 'Login failed'))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function fetchMe() {
        try {
            dispatch(setLoading(true))
            const data = await getme()
            dispatch(setUser(data.user ?? data))
            return data
        } catch (error) {
            dispatch(setError(error?.message ?? 'Unable to fetch user'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        fetchMe,
    }
}
