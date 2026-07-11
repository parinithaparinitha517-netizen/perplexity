import dotenv from 'dotenv'
dotenv.config()
import app from './src/app.js'
import connectToDb from './src/config/database.js'
import {initSocket} from './src/socket/socket.service.js'
import Http from 'http'
const Httpserver=Http.createServer(app)

initSocket(Httpserver)

connectToDb()
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
Httpserver.listen(3001,()=>{
    console.log("socket server is running on port 3001")
})