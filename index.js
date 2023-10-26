const express = require('express')
const mongoose = require('mongoose')
const app = express()

require('dotenv').config()
const port = process.env.PORT || 3000

const User = require('./models/user')

const pasteRoutes = require('./routes/pastes')

async function authentication(req, res, next) {
    const apiKey = req.headers["x-api-key"]
    if (apiKey == undefined) {
        res.status(401)
        res.send('Access Forbidden. No API Key Provided')
    } else {
        let response = await User.where('apiKey').equals(apiKey)
        if (response.length == 0) {
            res.status(401)
            res.send('Access Forbidden. Invalid API Key')
        } else {
            next()
        }
    }
}

app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser:true,
	useUnifiedTopology:true
})
const db = mongoose.connection

db.on('error', error => console.log(error));
db.once('open', () => {console.log('Connected to Mongoose')})

// Create API Key
app.get('/generateApiKey', async (req,res) => {
    let response = await User.create({})
    res.send(response)
})

// Auth Middleware
app.use(authentication)

// Paste Routes
app.use('/pastes', pasteRoutes)

// listen to incoming connections
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})