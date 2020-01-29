const mongoose = require('mongoose');
const moment = require('moment');
const now = moment(); 

var UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        trim: true,                                         
        unique: true, 
        required: 'Email is required'
    },
    username: {
        type: String, 
        unique: true, 
        trim: true, 
        required: 'Username is required'
    },
    photo: {
        type: String, 
        default: ''
    },
    password: {
        type: String, 
        required: 'Password is required'
    }, 
    userCreated: {
        type: String, 
        default: now.format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
});

module.exports = mongoose.model('User', UserSchema);

