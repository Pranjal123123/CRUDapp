const express = require("express");
const router = express.Router();
const Resource = require("../src/models/Resource");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");//
const path = require("path");
const multer  = require('multer');
const fs = require("fs");

router.use(methodOverride("_method"));
router.use(bodyParser.json());
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.use(express.static(__dirname+"./public/"));
//image upload
const storage = multer.diskStorage({
  destination:"./public/img/",
  filename: function(req, file, cb) {
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage,
}).single('image');


//search bar functions by tags
router.get("/", async (req, res) => {
    try {
      if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), "gi");
        const resources = await Resource.find({ tags: regex })
          .sort({
            likes: -1,
          })
          .populate("author");
        // console.log(resources);
        res.render("crudpage", {
          resources: resources,
        });
      } else {
        const resources = await Resource.find({})
          .sort({
            likes: -1,
          })
          .populate("author");
        // console.log(resources);
        res.render("crudpage", {
          resources: resources,
        });
      }
    } catch (err) {
      console.log(err);
      req.send("Something went wrong. Try again");
      res.redirect("/");
    }
  });

//for calculating likes
router.get("/like/:id", async (req, res) => {
    try {
        let resource = await Resource.findById(req.params.id);
        let likesArr = resource.resourcelikes || [];
        console.log(resource._id);

        if (likesArr.includes(resource._id)) {
          likesArr.remove(resource._id);
          resource.likes = resource.likes - 1;
        } else {
          likesArr.push(resource._id);
          resource.likes = resource.likes + 1;
        }
        resource.resourcelikes = likesArr;
        await resource.save();
        // console.log(resource);
        res.redirect(req.get("referer"));
    } 
    catch (error) {
        console.log(error);
        res.redirect("/resource");
    }
});

router.get("/create", async (req, res) => {
       res.render("from");
});

  //creating information
  router.post("/create",upload, async (req, res) => {

    if (req.file) {
      var image = req.file.filename;
    } else {
      var image ="https://cdn-images-1.medium.com/max/800/1*fDv4ftmFy4VkJmMR7VQmEA.png";
    }    
    try {
        const resource = req.body;
        const saved = await new Resource({
            title: resource.title,
            author: resource.author,
            body: resource.body,
            tags: resource.tags,
            image:image,
      })
      saved.save(function(err,doc){
        if(err) throw err;
        res.redirect("/resource");
      }); 
    } 
    catch (error) {
            console.log(error);
            res.send("Something went wrong. Try again");
    }
  });

  //for editing profile
  router.get("/edit-profile/:id", async (req, res) => {
     
      try{
            let id = req.params.id;
            const resource=await Resource.findById(id);
            res.render("from-edit", { resource: resource });
      }
      catch(error){
            console.log(error);
      }
  });

  router.post("/edit-profile/:id",upload, async (req, res) => {
    
    if (req.file) {
            var image = req.file.filename;
      try{
            let id = req.params.id;
            const saved = await Resource.findByIdAndUpdate(id, {
            title: req.body.title,
            author: req.body.author,
            body: req.body.body,
            tags: req.body.tags,
            image:image,
        });
        await saved.save(function(err,doc){
            if(err) throw err;
            res.redirect("/resource");
        }); 
        // console.log(saved);
        }
        catch (error){
            console.log(error);
            res.send("Something went wrong. Try again");
        }
    }
    else {
      try{
            let id = req.params.id;
            const saved = await Resource.findByIdAndUpdate(id, {
            title: req.body.title,
            author: req.body.author,
            body: req.body.body,
            tags: req.body.tags,
        });
            await saved.save(function(err,doc){
            if(err) throw err;
            res.redirect("/resource");
        }); 
        // console.log(saved);
         }
      catch (error){
          console.log(error);
          res.send("Something went wrong. Try again");
        }
        } 
  });

  //for deleting cards
  router.get("/delete/:id", async (req, res) => {
    try{
        const id=req.params.id;
        const deleted = await Resource.findOne({_id: id});
        await deleted.remove();
        res.redirect('/resource');
    }
    catch(error)
    {
        console.log(error);
        res.redirect('/resource');
    }
  })
  
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = router;