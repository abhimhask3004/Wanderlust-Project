const express=require("express");
const wrapAsync=require("../init/utils/wrapasyc.js");
const passport = require("passport");
const { saveredirectUrl } = require("../views/midleware/midleware.js");
const router=express.Router({});
const controllerUser=require("../controllers/user");
router
.route("/signup")
.get((controllerUser.signup))
.post(wrapAsync(controllerUser.signuprender));

router
.route("/login")
.get((controllerUser.loginrender))
.post(saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),(controllerUser.login))

router.get("/logout",(controllerUser.logout))
module.exports=router;