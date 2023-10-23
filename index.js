const express = require('express')
const mongoose = require('mongoose')
const app = express()

require('dotenv').config()
const port = process.env.PORT || 3000

const Paste = require('./models/paste')

app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser:true,
	useUnifiedTopology:true
})
const db = mongoose.connection

db.on('error', error => console.log(error));
db.once('open', () => {console.log('Connected to Mongoose')})

// Routes

app.get('/pastes', async (req,res) => {
    let response = await Paste.find({})
    res.send(response)
})

app.post('/pastes', async (req,res) => {
    let {message, creatorId} = req.body
    let response = await Paste.create({
        body: message,
        creatorId
    })
    res.send(response)
})

app.get('/pastes/:pasteId', async (req,res) => {
    let {pasteId} = req.params
    let response = await Paste.findOne({'pasteId':pasteId})
    res.send(response)
})

app.patch('/pastes/:pasteId', async (req,res) => {
    let {pasteId} = req.params
    let {updatedMessage} = req.body
    await Paste.findOneAndUpdate({'pasteId': pasteId},
        {"$set": {"body": updatedMessage}}
    )
    res.sendStatus(201)
})

app.delete('/pastes/:pasteId', async (req,res) => {
    let {pasteId} = req.params
    let response = await Paste.deleteOne({'pasteId': pasteId})
    res.send(response)
})

// listen to incoming connections
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})