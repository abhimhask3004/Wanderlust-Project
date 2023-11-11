const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken=process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({ accessToken: maptoken });


module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("./listings/index.ejs",{alllistings});
    };


    module.exports.new=(req,res)=>{
        res.render("./listings/new.ejs");
    }

    module.exports.createListings=async(req,res)=>{

      let respnse= await geocodingClient
      .forwardGeocode({
            query:req.body.listing.location,
            limit: 1
          })
            .send()

        let url=req.file.path;
        let filename=req.file.filename;

       const newlisting=new Listing(req.body.listing);
       newlisting.owner=req.user._id;
       newlisting.image={url,filename};
       newlisting.geomatry=respnse.body.features[0].geometry;
       let savedlist=await newlisting.save();
    //    console.log(savedlist);
       req.flash("success","New listing is created !");
       res.redirect("listings");
    };

    module.exports.showListings=async(req,res)=>{
        const {id}=req.params;
        const listin=await Listing.findById(id).populate({path:"reviews",
        populate:{path:"author"},})
        .populate("owner");
        // console.log(listin);
        if(!listin){
            req.flash("error","Listing you requested for does not exist !");
            res.redirect("/listings")
        }
        res.render("./listings/show.ejs",{listin});
    };


    module.exports.editListings=async(req,res)=>{
        let {id}=req.params;
        const list=await Listing.findById(id);
        if(!list){
            req.flash("error","Listing you requested for does not exist !");
            res.redirect("/listings")
        }
        req.flash("success","listing is Edited !");
        let OriginalImageUrl=list.image.url;
       OriginalImageUrl= OriginalImageUrl.replace("/upload","/upload/h_300,w_250");
        res.render("./listings/edit.ejs",{list,OriginalImageUrl});
    };


    module.exports.updateListings=async(req,res)=>{
        let {id}=req.params;
       let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
       if(typeof req.file !=="undefined"){
       let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
       }
        req.flash("success","listing is updated succesfully !");
        res.redirect("/listings");
    };

    module.exports.deleteListings=async(req,res)=>{
        let {id}=req.params;
        let deletelisting=await Listing.findByIdAndDelete(id);
    
        console.log(deletelisting);
        req.flash("success","listing is deleted !");
        res.redirect("/listings");
    
    };