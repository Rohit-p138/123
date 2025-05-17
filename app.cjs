const express = require ("express");
const path = require('path');
const axios = require('axios');
const app = express();
const port = 8080;
const RECAPTCHA_SECRET_KEY = '6LcqdD4rAAAAAG3fnEL69X-p9pQdhzqgcCIHIO7d'; 

app.set("view engine","ejs");
app.use (express.urlencoded({extended : true}));
app.use (express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));






app.get("/",(req,res)=>{
   res.render("index.ejs");
});


app.post('/user/login', async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    if (!recaptchaResponse) {
        return res.send('Please complete the reCAPTCHA.');
    }

    // Verify with Google
    try {
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaResponse}`;
        const response = await axios.post(verifyUrl);
        if (response.data.success) {
            // Proceed with your login logic here
            res.send('Login successful!');
        } else {
            res.send('reCAPTCHA verification failed. Please try again.');
        }
    } catch (err) {
        res.send('Error verifying reCAPTCHA.');
    }
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