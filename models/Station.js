const { Schema, model } = require('mongoose');

const stationSchema = new Schema({

    name: { type: String, required: true },
    country: { type: String, required: true },
    genre: { type: String, required: true },
    url: { type: String, required: true, unique: true }
    
})

const Station = model('Station', stationSchema)

module.exports = Station;