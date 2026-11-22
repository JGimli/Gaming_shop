const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
    password_hash: {
        type: String,
        required: true,
        min: 8,
        max: 100

    }
})

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password_hash: Joi.string().min(8).max(100).required()
    })
    return schema.validate(user)
}

const User = mongoose.model('User', userSchema)
module.exports.validate = validateUser
module.exports.User = User