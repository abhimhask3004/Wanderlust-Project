const User=require("../models/user");
module.exports.signup=(req,res)=>{
    res.render("./users/signup.ejs")
}

module.exports.signuprender=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new User({
        username,
        email
    })
   const newregister= await User.register(newuser,password);
   console.log(newregister);
   req.login(newregister,(err)=>{
    if(err){
        return next(err);
    }
   req.flash("success","Welcome to Wanderlust");
   res.redirect("/listings");
})}
catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
}

module.exports.loginrender=(req,res)=>{
    res.render("./users/login.ejs");
}
module.exports.login=(req,res)=>{
    req.flash("success","Welcome back to WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","your succesfully logout !");
        res.redirect("/listings");
    })
    }