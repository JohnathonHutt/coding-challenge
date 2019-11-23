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
mongoose.connect("mongodb://localhost:27017/refLinksDB", {
  useNewUrlParser: true
});


//define mongoose Schema
const refLinkSchema = {
  prop: value,
};

const RefLink = mongoose.model("RefLink", refLinkSchema);


//setup routes

//test home/get route
app.get("/", function(req, res){
  res.send("It worked, great job!!");
});

//route for all refLinks
app.route("/reflinks")
  .get(function(req, res) {
    RefLink.find(function(err, foundRefLinks) {
      if (!err) {
        res.send(foundRefLinks);
      } else {
        res.send(err);
      }
    });
  });



app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
