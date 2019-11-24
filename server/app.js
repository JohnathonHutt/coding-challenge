//jshint esversion:6

//app dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require ("mongoose");


//set new instance of express
const app = express();


//use body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));


//connect to mongoDB -- refLinksDB
mongoose.connect("mongodb://localhost:27017/refLinksDB", { useNewUrlParser: true, useUnifiedTopology: true });


//define mongoose Schema
const refLinkSchema = {
  name: {type: String, required: true},
  clickNum: {type: Number, default: 0}
};

const RefLink = mongoose.model("RefLink", refLinkSchema);


//setup routes

//test home/get route
app.get("/", function(req, res){
  res.send("It worked, great job!!");
});

//route for all refLinks
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

    console.log(newRefLink);
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
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });


//routes for specific entries









app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
