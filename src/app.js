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

app.get('/toggl', async (req, res) => {
  try {
    const { ticket_description, ticket_id, company_name } = req.query

    const data = {
      created_with: 'API',
      description: `#${ticket_id} ${ticket_description}`,
      tags: [company_name],
      billable: false,
      workspace_id: parseInt(process.env.TOGGL_WORKSPACE_ID, 10),
      duration: -1,
      start: new Date().toISOString(),
      stop: null,
      pid: parseInt(process.env.TOGGL_PROJECT_ID, 10),
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: process.env.TOGGL_API_EMAIL,
        password: process.env.TOGGL_API_PASSWORD,
      },
    }

    const response = await axios.post(
      `https://api.track.toggl.com/api/v9/workspaces/${process.env.TOGGL_WORKSPACE_ID}/time_entries`,
      data,
      config
    )

    res.json(response.data)
  } catch (error) {
    console.error(
      'Error response from Toggl API:',
      error.response ? error.response.data : error.message
    )
    res.status(500).json({ error: 'Error fetching data' })
  }
})

app.use('/api/v1', api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

module.exports = app
