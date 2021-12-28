const mongoose = require("mongoose")
const Schema = mongoose.Schema

const rendelésSchema = new Schema({
   vásárlóId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Felhasználó",
     required: true
   },
   futárId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Felhasználó",
    required: false,
  },
   termékek: { type: Object, required: true },
   telefonszám: { type: String, required: true },
   cím: { type: String, required: true },
   koordináta: { type: [Number], required: true },
   állapot: { type: String, default: "megrendelve" }
}, { timestamps: true })

module.exports = mongoose.model("Rendelés", rendelésSchema, "rendelések")