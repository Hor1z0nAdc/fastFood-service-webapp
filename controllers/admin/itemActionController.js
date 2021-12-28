const Termék = require("../../models/termék")
const path = require("path")
const FileSystem = require("fs");
const date = require("../../src/middlewares/date")

function hibakezelés(név, leírás, error, req) {
    req.flash("árError", error)
    req.flash("név", név)
    req.flash("leírás", leírás)
}


const deleteItem = (req,res) => {
    const id = req.body._id
    Termék.findOneAndDelete({ _id:id }, (error) => {
        if(error) {
            console.log(err)
            return null
        }
        else {
            const filePath =  path.join(__dirname, '../../public/images', req.body.kép)
            FileSystem.unlinkSync(filePath)
            return res.json({termékNév: req.body.név, id: req.body._id})
        }
    })

}

const getChangeItem = async (req,res) => {
    const termék = await Termék.findById(req.params.id)
    return res.render("sites/admin/valtoztat", { termék })
}

const getUploadItem = async (req,res) => {
    return res.render("sites/admin/upload", { kategória: req.query.kategoria })
}

const postUploadItem = async (req,res) => {
    const { név, ár, kategória, leírás, kép }  = req.body
    
    //Check if given price is valid
    const árNum = parseInt(ár)
    if(isNaN(árNum)) {
        hibakezelés(név, leírás, "Árnak kizárólag számokat adjon meg!", req)
        return res.redirect("/upload-item?kategoria=" + kategória)
    }
    else if (árNum < 0) {
        hibakezelés(név, leírás, "Az árnak pozitív számnak kell lennie!", req)
        return res.redirect("/upload-item?kategoria=" + kategória)
    }

    //Manipulate date and create name for new image
    let currentDate = date.currentDate()
    currentDate = currentDate.replaceAll("/","")
    let newImageName =  path.parse(kép).name + currentDate + path.parse(kép).ext

   //Find the max id (primary key) value and increment it
   Termék.find().sort({_id:-1}).limit(1).exec((err, result) => {
        id = result[0]._id + 1

        //Create and save new item
        const termék = new Termék({
            _id: id,
            név,
            ár,
            kép: newImageName,
            kategória,
            leírás
        })
        
       termék.save().then( () =>{
            return res.redirect("/" + kategória)
        })
        .catch(err => {
            req.flash("error","Hiba történt.")
            return res.redirect("/upload-item?kategoria=" + kategória)
        })
    })
}

const postChangeItem = async (req,res) => {
    const { név, ár, kategória, leírás, kép, eredetiKép, termékId }  = req.body

    //Delete old image, if the image has been changed
    let newKép = kép
    if(eredetiKép != kép) {
        const filePath =  path.join(__dirname, '../../public/images', eredetiKép)
        if(FileSystem.existsSync(filePath)) {
            FileSystem.unlinkSync(filePath)
        }

        //Determine the name of new image
        let currentDate = date.currentDate()
        currentDate = currentDate.replaceAll("/", "")
        newKép = path.parse(kép).name + currentDate + path.parse(kép).ext
    }
 
    //Update item
    let update = {
        név: név,
        ár: ár,
        kategória: kategória,
        leírás: leírás,
        kép: newKép
    }
    let doc = await Termék.findOneAndUpdate({ _id: termékId}, update, { new: true } )

    //Determine kategória for redirecting to the correct path
    let newKategória
    if(doc.kategória == "üdítő"){
        newKategória = "udito"
    }       
    else {
        newKategória = doc.kategória
    }

    const redirectPath = "/" + newKategória
    return res.redirect(redirectPath)
}

module.exports = { 
    deleteItem, 
    getChangeItem, 
    getUploadItem,
    postUploadItem,
    postChangeItem,
}