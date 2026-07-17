import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { register, login, getme, logout } from '../services/auth.api'
import { setUser, setLoading, setError, logoutUser } from '../services/auth.slice'

export function useAuth() {
    const dispatch = useDispatch()

    const handleRegister = useCallback(async ({ username, email, password }) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({ username, email, password })
            return data
        } catch (error) {
            dispatch(setError(error.response?.data?.message ?? error.message ?? 'Registration failed'))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const handleLogin = useCallback(async ({ email, password }) => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({ email, password })
            dispatch(setUser(data.data))
            return data
        } catch (error) {
            dispatch(setError(error?.message ?? 'Login failed'))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const fetchMe = useCallback(async () => {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getme()
            dispatch(setUser(data.data))
            return data
        } catch {
            dispatch(setUser(null))
        } finally {
            dispatch(setLoading(false))
        }
    }, [dispatch])

    const handleLogout = useCallback(async () => {
        try {
            await logout()
        } finally {
            dispatch(logoutUser())
        }
    }, [dispatch])

    return useMemo(() => ({
        handleRegister,
        handleLogin,
        fetchMe,
        handleLogout,
    }), [handleRegister, handleLogin, fetchMe, handleLogout])
}
