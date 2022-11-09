//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose")
const app = express();
const encrypt = require("mongoose-encryption")

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

const secret = "Thisismysecretfortest.";
//always add the user plugin befor the modal
userSchema.plugin(encrypt,{secret:secret, encryptedFields: ["password"]}); //encryptedFields encrypts specific fields

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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  })

  newUser.save((err)=>{
    if(err){
      console.log(err)
    } else{
      res.render("secrets")
    }
  })
})

app.post("/login", (req,res) => {
  const userName = req.body.username;
  const password = req.body.password;

  User.findOne({email:userName},(err,foundUser)=>{
    if(!err){
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
          //console.log(foundUser.password) while testing you can check the password with this command
          //mongoose decrypts on the findOne method
        }
      }
    }
  } )
})

app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
})