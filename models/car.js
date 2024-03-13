// models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: String,
    currentPetrol: Number,
    mileage: Number
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
