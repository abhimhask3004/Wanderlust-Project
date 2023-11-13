if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");

const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./init/utils/expressErr.js");
const { resolveSoa } = require("dns");

const listingsrouter=require("./routes/listing.js");
const reviewsrouter=require("./routes/reviews.js");
const userrouter=require("./routes/user.js");

const passport = require("passport");
const User = require("./models/user.js");
const LocalStrategy=require("passport-local");
const { error } = require('console');

const Dburl=process.env.ATLASDB_URL;


main()
.then(()=>{
    console.log("db is connected");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(Dburl);
};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use (express.static(path.join(__dirname,"/public")));

const store=MongoStore.create({
    mongoUrl:Dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
console.log("ERROR IN MONGO SESSION STORE",err);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date().now +7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"abhimh@gmail.com",
//         username:"abhi2330",
//     })
//    let useerregister=await User.register(fakeuser,"HelloWorld");
//     res.send(useerregister);
// })
app.use("/listings",listingsrouter);
app.use("/listings/:id/reviews",reviewsrouter);
app.use("/",userrouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something Went Wrong !"}=err;
    res.status(statusCode).render("error.ejs",{message});
    
});

app.get("/",(req,res)=>{
    res.redirect("/listings");
})
app.listen(8080,()=>{
    console.log("server is listening port 8080");
});