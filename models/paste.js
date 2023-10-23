const mongoose = require('mongoose')
const randomstring = require('randomstring')

const pasteSchema = new mongoose.Schema({
	body: {
        type: String,
        required: true
    },
    paste_id: {
        type: String,
        default: () => randomstring.generate(6)

    },
    creator_id: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: () => Date.now()
    }
})

module.exports = mongoose.model('example',pasteSchema)