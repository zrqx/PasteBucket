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
    let {message, creator_id} = req.body
    let response = await Paste.create({
        body: message,
        creator_id
    })
    res.send(response)
})

app.patch('/pastes', async (req,res) => {
    let {paste_id, updated_message} = req.body
    console.log(`${paste_id} and ${updated_message}`)
    let response = await Paste.findOneAndUpdate({'paste_id': paste_id},
        {"$set": {"body": updated_message}}
    )
    res.send(response)
})

app.delete('/pastes/:paste_id', async (req,res) => {
    let {paste_id} = req.params
    let response = await Paste.deleteOne({'paste_id': paste_id})
    res.send(response)
})

// listen to incoming connections
app.listen(port, () => {
	console.log(`Listening on port ${port}`)
})