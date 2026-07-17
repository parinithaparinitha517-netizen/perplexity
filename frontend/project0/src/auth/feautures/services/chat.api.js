import axios from 'axios'

const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
    baseURL: serverUrl,
    withCredentials: true
})

export async function sendMessage({ message, chatId }) {
    const response = api.post('/chat/api/message', { message, chatId })
    return (await response).data
}

export async function getChats() {
    const response = await api.get('/chat/api/')
    return response.data
}

export async function getMessagesByChatId(chatId) {
    const response = await api.get(`/chat/api/messages/${chatId}`)
    return response.data
}

export async function deleteChat(chatId) {
    const response = await api.delete(`/chat/api/chats/${chatId}`)
    return response.data
}
