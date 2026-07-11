import axios from 'axios'
const api=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})
export async function register({username,email,password}){
    const response=api.post('/auth/api/register',{username,email,password})
    return (await response).data
}
export async function login({email,password}){
    const response=api.post('/auth/api/login',{email,password})
    return (await response).data
}
export async function getme(){
    const response=api.post('/auth/api/get-me')
    return (await response).data
}
