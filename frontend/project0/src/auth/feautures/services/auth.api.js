import axios from 'axios'
const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const api = axios.create({
    baseURL: serverUrl,
    withCredentials: true
})
export async function register({ username, email, password }) {
    const response = api.post('/auth/api/register', { username, email, password })
    return (await response).data
}
export async function login({ email, password }) {
    const response = api.post('/auth/api/login', { email, password })
    return (await response).data
}
export async function getme() {
    const response = await api.get('/auth/api/get-me')
    return response.data
}

export async function logout() {
    const response = await api.post('/auth/api/logout')
    return response.data
}
