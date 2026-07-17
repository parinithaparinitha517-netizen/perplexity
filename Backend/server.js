import dotenv from 'dotenv'
dotenv.config()
import app from './src/app.js'
import connectToDb from './src/config/database.js'
import {initSocket} from './src/socket/socket.service.js'
import Http from 'http'
const Httpserver=Http.createServer(app)
const port = Number(process.env.PORT) || 3000

initSocket(Httpserver)

try {
    await connectToDb()

    Httpserver.listen(port, () => {
        console.log(`server and socket are running on port ${port}`)
    })
} catch (error) {
    console.error('Unable to start server:', error.message)
    process.exitCode = 1
}
