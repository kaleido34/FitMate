require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')
const userRoutes = require('./routes/user')

// express app
const app = express()

// middleware
app.use(express.json())

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'FitMate API is running!', 
    endpoints: [
      'GET /api/workouts',
      'POST /api/workouts',
      'DELETE /api/workouts/:id',
      'POST /api/user/signup',
      'POST /api/user/login'
    ]
  })
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

// configure mongoose for serverless
mongoose.set('bufferCommands', false)
mongoose.set('bufferMaxEntries', 0)

// Connection reuse for serverless
let cachedConnection = null

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
      maxPoolSize: 1, // Maintain up to 1 socket connection
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      heartbeatFrequencyMS: 30000, // Send a ping every 30 seconds
    })
    
    cachedConnection = connection
    console.log('connected to db')
    return connection
  } catch (error) {
    console.log('Database connection error:', error)
    throw error
  }
}

// Initialize connection
connectToDatabase()

// For local development
if (require.main === module) {
  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log('Server running on port', port)
  })
}

// Export the Express app for Vercel
module.exports = app