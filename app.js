//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose")
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 15;

//console.log(process.env.API_KEY);ex. tap into the env file to get the secret key

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req,res) =>{
    res.render("home")
});
 
app.get("/login", (req,res) =>{
    res.render("login")
});

app.get("/register", (req,res) =>{
    res.render("register")
});

app.post("/register", (req,res) =>{

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    })
    newUser.save((err)=>{
      if(err){
        console.log(err)
      } else{
        res.render("secrets")
      }
    })
  });
  
})

app.post("/login", (req,res) => {
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName},(err,foundUser)=>{
    if(!err){
      if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if(result === true){
            res.render("secrets");
          }
        }); 
      }
    }
  } )
})

app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
})