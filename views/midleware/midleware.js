const Listing = require("../../models/listing");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../../init/utils/expressErr");
const reviews = require("../../models/reviews");

module.exports.islogedin=(req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be login !");
       return  res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","You are not Owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);  
     if(error){
       
       let errMsg=error.details.map((el)=>el.message).join(",");
       throw  new ExpressError(400,errMsg);
     }
     else{
        next();
     }

} 


module.exports.validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);  
     if(error){
       
       let errMsg=error.details.map((el)=>el.message).join(",");
       throw  new ExpressError(400,errMsg);
     }
     else{
        next();
     }

}


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewID}=req.params;
    let review=await reviews.findById(reviewID);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error","You are not Author of this Review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
