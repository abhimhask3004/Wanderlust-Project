const express=require("express");
const router=express.Router();

const wrapAsync=require("../init/utils/wrapasyc.js");
const {islogedin,isOwner,validatelisting}=require("../views/midleware/midleware.js");
const controllerListings=require("../controllers/listings.js")

const multer  = require('multer')
const {cloudinary,storage}=require("../cloudconfig.js");
const upload = multer({storage })

//index route
router
.route("/")
.get(wrapAsync(controllerListings.index))
 .post(islogedin,upload.single('listing[image]'),
 validatelisting,
 wrapAsync(controllerListings.createListings))
    //new route
router.get("/new",islogedin,(controllerListings.new));

    //show route
router
.route("/:id")
.get(wrapAsync(controllerListings.showListings))
.put(islogedin,isOwner,upload.single('listing[image]'),validatelisting,wrapAsync(controllerListings.updateListings))
.delete(islogedin,isOwner,wrapAsync(controllerListings.deleteListings));

//edit route

router.get("/:id/edit",islogedin,isOwner,wrapAsync(controllerListings.editListings));

module.exports=router;