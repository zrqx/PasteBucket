const mongoose = require('mongoose')
const randomstring = require('randomstring')

const pasteSchema = new mongoose.Schema({
	body: {
        type: String,
        required: true
    },
    pasteId: {
        type: String,
        default: () => randomstring.generate(6)

    },
    creatorId: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('paste',pasteSchema)