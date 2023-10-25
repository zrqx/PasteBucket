const express = require('express')
const mongoose = require('mongoose')
const app = express()

require('dotenv').config()
const port = process.env.PORT || 3000

const Paste = require('./models/paste')
const User = require('./models/user')

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

// Routes
app.get('/pastes', async (req,res) => {
    const apiKey = req.headers["x-api-key"]
    const userdata = await User.where('apiKey').equals(apiKey)
    const creatorId = userdata[0].creatorId
    let response = await Paste.find({'creatorId': creatorId})
    res.send(response)
})

app.post('/pastes', async (req,res) => {
    const apiKey = req.headers["x-api-key"]
    const userdata = await User.where('apiKey').equals(apiKey).limit(1)
    const creatorId = userdata[0].creatorId
    let {message} = req.body
    let response = await Paste.create({
        body: message,
        creatorId
    })
    res.send(response)
})

app.get('/pastes/:pasteId', async (req,res) => {
    const apiKey = req.headers["x-api-key"]
    const userdata = await User.where('apiKey').equals(apiKey).limit(1)
    const creatorId = userdata[0].creatorId
    let {pasteId} = req.params

    let response = await Paste.findOne({'pasteId':pasteId, 'creatorId': creatorId})
    if (response != null) {
        res.send(response)
    } else {
        res.status(403)
        res.send("Paste doesn't exist or it's private")
    }
})

app.patch('/pastes/:pasteId', async (req,res) => {
    const apiKey = req.headers["x-api-key"]
    const userdata = await User.where('apiKey').equals(apiKey).limit(1)
    const creatorId = userdata[0].creatorId
    let {pasteId} = req.params
    let {updatedMessage} = req.body
    let response = await Paste.findOneAndUpdate({'pasteId': pasteId, 'creatorId': creatorId},
        {"$set": {"body": updatedMessage}}
    )
    if (response != null) {
        res.status(201)
        res.send(response)
    } else {
        res.status(403)
        res.send("Invalid Operation. Either Paste doesn't exist OR You aren't the creator of the Paste")
    }
})

app.delete('/pastes/:pasteId', async (req,res) => {
    const apiKey = req.headers["x-api-key"]
    const userdata = await User.where('apiKey').equals(apiKey).limit(1)
    const creatorId = userdata[0].creatorId
    let {pasteId} = req.params
    let response = await Paste.deleteOne({'pasteId': pasteId, 'creatorId': creatorId})
    if (response.deletedCount == 0) {
        res.status(403)
        res.send("Invalid Operation. Either Paste doesn't exist OR You aren't the creator of the Paste")
    } else {
        res.status(200)
        res.send('Paste deleted successfully')
    }
})

// listen to incoming connections
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})