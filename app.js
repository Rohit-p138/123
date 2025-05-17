const express = require ("express");
const path = require('path');
// const { Configuration, OpenAIApi } = require('openai');
// require('dotenv').config();
// const fetch = require('node-fetch');



const app = express();
const port = 8080;

// app.use(express.static('public'));
// app.use(express.json());

// app.post('/chat', async (req, res) => {
//   const userMessage = req.body.message;

//   const response = await fetch('http://localhost:8080/v1/chat/completions', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'mistral',
//       messages: [{ role: 'user', content: userMessage }],
//     }),
//   });

//   const data = await response.json();
//   const botMessage = data.choices[0].message.content;
//   res.json({ reply: botMessage });
// });


// // Middleware
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.json());


app.set("view engine","ejs");
// app.set("views",Path.join(__dirname,"views"));
// app.use(express.dynamic(path.join(__dirname,"public")))

app.use (express.urlencoded({extended : true}));
app.use (express.static('public'));


app.get("/",(req,res)=>{
  //  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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