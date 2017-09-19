const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true,
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    dateLastAccess: {
        type: Date,
        required: false
    },
    dateExpiration: {
        type: Date,
        required: false
    },
    type: {
        type: String,
        enum: ['CLIENT','ADMIN'],
        required: true
    },
    token: {
        type: String,
        required: false
    }

});

mongoose.model('User', schema);