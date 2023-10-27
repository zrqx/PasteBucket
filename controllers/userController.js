const User = require('../models/user')

const create_user = async () => {
    let response = await User.create({})
    res.send(response)
}

module.exports = {
    create_user
}