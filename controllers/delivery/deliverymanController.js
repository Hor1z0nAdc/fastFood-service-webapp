const Rendelés = require("../../models/rendelés")

const index = async (req,res) => {
     const currentFutárId = req.user._id
     const isWork = await Rendelés.exists({ futárId: currentFutárId })
     res.render("sites/deliveryman/index", { isWork })
}

const map = async (req,res) => {
     const currentFutárId = req.user._id
     const rendelések = await Rendelés.find({ futárId: currentFutárId }).sort({ updatedAt: 1 }).lean()
     
     let coords = []
     rendelések.forEach(rendelés => {
          coords.push(rendelés.koordináta)
     });
  
     res.render("sites/deliveryman/map", { coords, rendelések })
}

const deleteDropoff = async (req,res) => {
     deleteDoc(Rendelés, req).then(doc => {
          return res.json({message: "success", id: doc._id })
     })
}
 
async function deleteDoc(Rendelés, req) {
     let doc = await Rendelés.findOneAndUpdate({ _id : req.body._id }, { futárId: null, állapot: "kiszállítva" }, { new: true} )
     return doc
}

module.exports = { 
     index,
     deleteDropoff,
     deleteDoc,
     map 
}