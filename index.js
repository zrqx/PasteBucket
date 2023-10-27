const express = require('express')
const app = express()

const initializersController = require('./controllers/initializers')
const pasteRoutes = require('./routes/pastes')
const userRoutes = require('./routes/users')

initializersController.start_server(app)
initializersController.load_env_vars()
initializersController.establish_db_connection()

app.use(express.urlencoded({extended: true}))
app.use(initializersController.authenticate)

app.use('/users', userRoutes)
app.use('/pastes', pasteRoutes)