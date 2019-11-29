//jshint esversion:6

//app dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");


//set new instance of express
const app = express();

//use cors
app.use(cors());

//allow OPTIONS on all resources
app.options('*', cors());

//use body-parser urlencode
app.use(bodyParser.urlencoded({
  extended: true
}));

//use json parsing
app.use(express.json());

//configure server to only accept requests from frontend site
// const corsOptions = {
//   origin: 'the-domain-name'
// };
//once domain name is obtained pass corsOptions into each cors() call -- cors(corsOptions)


const port = process.env.PORT || 5000;


//Set uri string to mLab (a heroku add-on database) MongoDB database
const uristring = process.env.MONGODB_URI || "mongodb://localhost:27017/refLinksDB";


//connect to mongoDB -- refLinksDB
mongoose.connect(uristring, { useNewUrlParser: true, useUnifiedTopology: true });


//define mongoose Schema
const refLinkSchema = {
  name: {type: String, required: true, unique: true},
  clickNum: {type: Number, default: 0}
};

const RefLink = mongoose.model("RefLink", refLinkSchema);


//Test route
app.get("/", function(req, res) {
    res.send("Server is up and running");
});

//route for all entries
app.route("/reflinks")
  //Read route - gets all db entries
  .get(function(req, res) {
    RefLink.find(function(err, foundRefLinks) {
      if (!err) {
        res.send(foundRefLinks);
      } else {
        res.send(err);
      }
    });
  })
  //Create route - add new db entry
  .post(function(req, res) {
    console.log(req.body.name);
    console.log(req.body.clickNum);
    const newRefLink = new RefLink({
      name: req.body.name,
      clickNum: req.body.clickNum,
    });
    newRefLink.save(function(err) {
      if (!err) {
        res.send(`New refLink: ${req.body.name}, was successfully added`);
      } else {
        res.send(`There was an error adding ${req.body.name} entry: ${err}`);
      }
    });
  })
  //delete all entries
  .delete(function(req, res) {
    RefLink.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all entries.");
      } else {
        res.send(err);
      }
    });
  });


//routes for specific entries
  app.route("/reflinks/:refLinkName")
    //Find link by name - shouldn't be needed for app but just in case...
    .get(function(req,res){
      console.log(req.params.refLinkName);
      RefLink.findOne({name: req.params.refLinkName}, function(err, entryFound){
        if (entryFound) {
          res.send(entryFound);
        } else {
          res.send("No matching Link");
        }
      });
    })
    //Find link by name - update with provided information
    .patch(function(req, res){
      RefLink.update(
        //conditions
        {name: req.params.refLinkName},
        //updates
        {$set: req.body},
        function(err, result){
          if (!err) {
            res.send("Link entry was patched successfully.");
          } else {
            res.send(err);
          }
        }
      );
    })
    //Find link by name - delete specific entry
    .delete(function(req, res){
      RefLink.deleteOne(
        //conditions
        {name: req.params.refLinkName},
        function(err){
          if (!err) {
            res.send("Successfully deleted entry.");
          } else {
            res.send(err);
          }
        }
      );
    });


app.listen(port, function(){
  console.log(`Server is running on port ${port}`);
});
