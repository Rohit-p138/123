const express = require ("express");
const path = require('path');



const app = express();
const port = 8080;



app.set("view engine","ejs");

app.use (express.urlencoded({extended : true}));
app.use (express.static('public'));


app.get("/",(req,res)=>{
   res.render("index.ejs");
});

app.get("/user/login",(req,res)=>{
    res.render("login.ejs");
});

app.get("/user/signup",(req,res)=>{
    res.render("signup.ejs");
});

app.get("/user/:laws",(req,res)=>{
    res.render("cyberlaws.ejs");
});

app.get("/user/contact/:us",(req,res)=>{
    res.render("contactus.ejs");
});

app.get("/user/complaint/:id",(req,res)=>{
    res.render("complaint.ejs");
});


app.listen (port , ()=> {
    console.log("server is listening : 8080");
});