const express = require('express')
const cors = require('cors')
const app = express()

const initializersController = require('./controllers/initializers')
const pasteRoutes = require('./routes/pastes')
const userRoutes = require('./routes/users')

initializersController.start_server(app)
initializersController.load_env_vars()
initializersController.establish_db_connection()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/users', userRoutes)
app.use('/pastes', initializersController.authenticate,  pasteRoutes)