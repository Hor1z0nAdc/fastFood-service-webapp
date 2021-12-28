const mongoose = require("mongoose")
const Schema = mongoose.Schema

const felhasználóSchema = new Schema({
    név: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    jelszó: {type: String, required: true},
    beosztás: {type: String, default: "vásárló"},
}, { timestamps: true})

module.exports = mongoose.model("Felhasználó", felhasználóSchema, "felhasználók")