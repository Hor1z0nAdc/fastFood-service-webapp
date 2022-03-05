const Felhasználó = require("../../models/felhasználó")
const Rendelés = require("../../models/rendelés")
const dateFormat = require("dateformat")
const bcrypt = require("bcrypt")
const accountF = require("../../src/functions/accountFunctions.js")

const delivery = async (req, res) => {
    let futárok = await Felhasználó.find({ beosztás: "futár" }).sort({ createdAt: 1 }).lean()
   
    //Format the date of registration of all delivery men
    formatCreateAt(futárok)

    res.render("sites/admin/futarok", { futárok })
}

const deleteDelivery = async (req, res) => {
    const id = req.body._id

    Felhasználó.findOneAndDelete({ _id: id }, (error) => {
        if(error) {
            console.log(err)
            return null
        }
        else {
            return res.json({ név: req.body.név, id: req.body._id })
        }
    })
}

const getRegister = (req, res) => {
    res.render("sites/admin/registerDelivery")
}

const postRegister = async (req, res) => {
    const {name, email, password1, password2} = req.body

    //Megadott adatok validációja
    let isError = accountF.registerValidation(name, email, password1, password2, req)
    if(isError) {
        return res.redirect("/futarok/register") 
    }

    //Foglalt email ellenőrzés
    Felhasználó.exists({email}, (error, result) => {
        if(result) {
           accountF.takenEmail(name, req)
           return res.redirect("/futarok/register")
        }
        
        //Ha minden jó, felhasználó létrehozása és mentése
        createDeliveryMan(name, email, password1)
            .then(felhasználó => {
                felhasználó.save()
                    .then( () => {
                        return res.redirect("/futarok")
                    })
                    .catch(err => {
                        req.flash("error","Hiba történt.")
                        console.log(err)
                        return res.redirect("/futarok/register")
                    })
        })
    })

}

const kiosztas = async (req, res) => {
    //Find all the rendelés and futár
    const rendelések = await Rendelés.find({ állapot: "elkészítve" })
                             .sort({ updatedAt: 1 }).populate("vásárlóId", "email").lean()
    const futárok = await Felhasználó.find({ beosztás: "futár" }).sort({ createdAt: 1 }).lean()

    //Create array of futár id-s
    const futárIds = futárok.map(futár => {
        return futár._id
    })

    //Create array of futár names
    const futárNames = futárok.map(futár => {
        return futár.név
    })

    //Create a 2d array - array of futárs of rendelések associated with the futár
    let futárHozzárendelés = assignToDelMan(futárIds, rendelések, futárNames)

    res.render("sites/admin/kiosztas", { rendelések, futárok, futárHozzárendelés, dateFormat })
}

const postKiosztas = (req, res) => {
   const { futár } = req.body
   const rendelésId = Object.keys(req.body)
   rendelésId.splice(rendelésId.length-1, 1)

   rendelésId.forEach(rendelés => {
       Rendelés.findOneAndUpdate({ _id: rendelés }, { futárId: futár }, { new:true }, (error, doc) => {
           if(error) {
               console.log(error)
           }
           else {
               console.log(doc)
           }
       })
   })

   return res.redirect("/futarok/kiosztas")
}

const deleteKiosztas = async (req, res) => {
    await Rendelés.findOneAndUpdate({ _id: req.query.id}, { futárId: undefined}, { new: true})
    return res.redirect("/futarok/kiosztas")
}

function formatCreateAt(futárok) {
    for(let i = 0; i < futárok.length; i++) {
        let createDate = new Date (futárok[i].createdAt).toDateString()
        let partsOfDate = createDate.split(" ")
      
        month = partsOfDate[1].toLowerCase();
        let months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        month = months.indexOf(month) + 1;

        if(month < 10) month = "0" + month

        futárok[i].createdAt = `${partsOfDate[3]}-${month}-${partsOfDate[2]}`
    }

}

function assignToDelMan(futárIds, rendelések, futárNames) {
    let futárHozzárendelés = []
    //Iterate through all of the delivery man
    for(let i = 0; i < futárIds.length; i++) {
        let filteredRendelés = []

        //save order if it belongs to current delivery man
        rendelések.forEach(rendelés => {
            if(String(rendelés.futárId) == String(futárIds[i])) {
                filteredRendelés.push(rendelés)
            }
        })

        if(filteredRendelés.length > 0) {
            //Add the name of delivery man to orders
            for(let j = 0; j < filteredRendelés.length; j++) {
                filteredRendelés[j].futárNév = futárNames[i]
            }

            futárHozzárendelés.push(filteredRendelés)
        }
    }

    return futárHozzárendelés
}

async function createDeliveryMan(name, email, password1) {
    const hashedPassword = await bcrypt.hash(password1, 12)

    const felhasználó = new Felhasználó({
        név: name,
        email,
        jelszó: hashedPassword,
        beosztás: "futár"
    })

    return felhasználó
}

module.exports = {
    delivery,
    deleteDelivery,
    getRegister,
    postRegister,
    kiosztas,
    postKiosztas,
    deleteKiosztas,
    createDeliveryMan,
    formatCreateAt,
    assignToDelMan
}