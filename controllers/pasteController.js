const Paste = require('../models/paste')
const User = require('../models/user')

const paste_index = async (req,res) => {
    const apiKey = req.headers["x-api-key"]
    const userdata = await User.where('apiKey').equals(apiKey)
    const creatorId = userdata[0].creatorId
    let response = await Paste.find({'creatorId': creatorId})
    res.send(response)
}

const paste_create = async (req,res) => {
    const apiKey = req.headers["x-api-key"]
    const userdata = await User.where('apiKey').equals(apiKey).limit(1)
    const creatorId = userdata[0].creatorId
    let {message} = req.body
    let response = await Paste.create({
        body: message,
        creatorId
    })
    res.send(response)
}

const paste_raw = async (req,res) => {
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
}

const paste_update = async (req,res) => {
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
}

const paste_delete = async (req,res) => {
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
}

module.exports = {
    paste_index,
    paste_create,
    paste_raw,
    paste_update,
    paste_delete
}