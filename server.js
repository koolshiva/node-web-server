const express = require('express');
const bodyParser = require('body-parser');
const $ = require("request");
var app = express();

app.use(bodyParser.json());

app.get('/weather-data',(req,res)=>{

  //check if lat and long exist and are numbers
  let lat = (req.query.lat || req.query.lat==0)? (!Number.isNaN(req.query.lat)?
  Number.parseFloat(req.query.lat).toFixed(4):null) : null;

  let long = (req.query.long || req.query.long==0)? (!Number.isNaN(req.query.long)?
  Number.parseFloat(req.query.long).toFixed(4):null) : null;

  //if lat and long are invalid, return an HTTP error status
  if(!(lat && long)){
    res.status(400).send({error:"Bad Request"});
    return;
  }

  //pass the coordinates to get the location and temperature values.
  $({
    url:`https://api.darksky.net/forecast/fe225cb12182f62b6840f4f63c27c0c5/${lat},${long}`,
    json:true
  },(error,response,body)=>{

    (!error)?((response.statusCode!==200)?res.status(400).send({error:"Bad Request"}):
    res.send({temperate:(body.currently.temperature-32)*(5/9),
      location:body.timezone}))
    :res.status(500).send({error:"Unable to retrieve weather data."});
  }); 
});

//making root url serve the angular app built inside the public folder
app.use(express.static('public'));

//starting express server at 3000
app.listen(3000,()=>{
  console.log("Node Server running at port 3000.");
});