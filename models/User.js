const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stations: [{ type: Schema.Types.ObjectId, ref:'Station'}]
})
module.exports = model('User', userSchema)