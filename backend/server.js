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

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to db')
  })
  .catch((error) => {
    console.log(error)
  })

// For local development
if (require.main === module) {
  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log('Server running on port', port)
  })
}

// Export the Express app for Vercel
module.exports = app