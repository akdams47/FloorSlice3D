import express from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import generateRouter from './routes/generate'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const isProduction = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(express.json())

// API routes
app.use('/api', generateRouter)

// In production, serve the Vite build
if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist')
  app.use(express.static(distPath))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`FloorSlice3D server running on port ${PORT}`)
  if (!isProduction) {
    console.log(`API proxy: http://localhost:${PORT}/api`)
  }
})
