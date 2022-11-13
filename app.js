
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

const app = express();
//console.log(process.env.API_KEY);ex. tap into the env file to get the secret key

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(session({
  secret: "THIS IS THE SECRET!",
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect("mongodb://localhost:27017/userDB" , {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req,res) =>{
    res.render("home")
});
 
app.get("/login", (req,res) =>{
    res.render("login")
});

app.get("/register", (req,res) =>{
    res.render("register")
});

app.get("/secrets", (req,res) =>{

})

app.post("/register", (req,res) =>{

    User.register({username: req.body.username}, req.body.password,(err, user)=>{
      if(err){
        console.log(err)
        res.redirect("/register")
      } else{
        passport.authenticate("local")(req,res, ()=>{
          res.redirect("/secrets")
        })
      }
    });
  
})

app.post("/login", (req,res) => {
  
})

app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
})