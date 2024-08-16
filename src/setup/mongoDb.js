import mongoose from 'mongoose'

export async function connectToMongoDb() {
  try {
    const mongClient = await mongoose.connect(process.env.MONGO_URI)
    logger.info('Connected to mongodb')
    return mongClient
  } catch (error) {
    logger.error('Could not connect to MongoDB', error)
    process.exit(1)
  }
}
