import 'dotenv/config'
import { globSync } from 'glob'
import express from 'express'
import mime from 'mime'

// Instantiate Express.
const app = express()

// Static routes.
app.use(express.static('node_modules'))
app.use(express.static('public'))

// Processing routes.
globSync('routes/**.mjs').forEach(async route => {
  app.use('/api', (await import(`./${route}`)).default)
})

// Start server.
app.listen(process.env.PORT)
