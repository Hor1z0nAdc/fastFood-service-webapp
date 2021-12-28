const mongoose = require("mongoose")
const Schema = mongoose.Schema

const termékSchema = new Schema({
    _id: {type: Number, required: true},
    név: {type: String, required: true},
    ár: {type: Number, required: true},
    kép: {type: String, required: true},
    kategória: {type: String, required: true},
    leírás: {type: String, required: false}
})

module.exports = mongoose.model("Termék", termékSchema, "termékek")