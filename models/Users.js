const mongoose = require("mongoose")

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
      },
    updatedBy: {
        type: Date,
        required: false
      }
    
});

module.exports = mongoose.model('Users', UsersSchema);
