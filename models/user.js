const mongoose = require('mongoose')
const randomstring = require('randomstring')

const userSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        default: () => randomstring.generate(24)
    },
    creatorId: {
        type: String,
        default: () => randomstring.generate(6)
    },
    joinedOn: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('user', userSchema)