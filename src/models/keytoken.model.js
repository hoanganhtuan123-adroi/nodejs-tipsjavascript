'use strict';
const mongoose = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'key';
const COLLECTION_NAME = 'keys';
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required:true,
        unique:true,
        index:true,
    },
    publicKey:{
        type:String,
        required:true,
    }, 
    privateKey:{
        type:String,
        required:true,
    }, // Basic usage, save the private key in the database -> advanced usage dosn't save the private key in the database
    refreshToken:{
        type: Array,
        default:[],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);