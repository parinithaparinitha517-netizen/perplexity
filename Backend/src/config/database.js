import mongoose from 'mongoose'

async function connectToDb() {
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not configured')
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to db')
}

export default connectToDb
