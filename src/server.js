import express, { Router } from 'express'
import ErrorMiddleware from './middlewares/error'
import LoggerMiddleware from './middlewares/logger'


// Options configuration
const PORT = process.env.port || 3000

// App creation
const app = express()

// Middlewares
app.use(LoggerMiddleware)
app.use(ErrorMiddleware)

// Router
// TODO @Nico : replace by react router
const router = Router()
router.get('/', (req, res, next) => {
  res.send('hello world')
})

app.use('/', router)

app.listen(PORT, () => console.log(`Listenning to ${PORT}`)) // eslint-disable-line
