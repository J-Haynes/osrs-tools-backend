const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

const axios = require('axios')

require('dotenv').config()

const middlewares = require('./middlewares')
const api = require('./api')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'urmom lmaooo 😎',
  })
})

app.get('/proxy', async (req, res) => {
  try {
    const response = await axios.get(
      'https://oldschool.runescape.com/slu?order=WMLPA'
    )
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' })
  }
})

app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
