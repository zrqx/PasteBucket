const mongoose = require('mongoose')
const User = require('../models/user')

const start_server = (app) => {
    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is Up')
    })
}

const load_env_vars = () => {
    if (process.env.ENVIRONMENT != 'production') {
        require('dotenv').config()
    }
}

const establish_db_connection = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    const db = mongoose.connection
    db.on('error', error => console.log(error));
    db.once('open', () => {console.log('Connected to Mongoose')})
}

const authenticate = async (req, res, next) => {
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

module.exports = {
    start_server,
    load_env_vars,
    establish_db_connection,
    authenticate
}