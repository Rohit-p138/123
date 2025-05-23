const express = require ("express");
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const axios = require('axios');
const port = 8080;
const {faker} = require('@faker-js/faker');
const bodyParser = require('body-parser');


const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root', 
    password: 'Rohit@12345',
    database: 'user'
    });


// Middlewares are incomplete (i  am able to form some layers of security but i don't did this in the code)

app.set("view engine","ejs");
app.use (express.urlencoded({extended : true}));
app.use (express.json());
app.use ('/images' , express.static('public/images'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({
    secret: 'your_secret_key', // use environment variable in production
    resave: false,
    saveUninitialized: true
}));



//completed
connection.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});







app.get("/",(req,res)=>{
  const msg = req.query.msg;
  let notificationHTML = '';

  if (msg === 'login') {
    notificationHTML = `<div class="toast">You are now logged in.</div>`;
  } else if (msg === 'register') {
    notificationHTML = `<div class="toast">Account created successfully.</div>`;
  } else if (msg === 'Complaint submitted.') {
    notificationHTML = `<div class="toast">Complaint submitted successfully.</div>`;
  } else if (msg === 'contact') {
    notificationHTML = `<div class="toast">Thank you for contacting us.</div>`;
  }
   res.render("index.ejs", { notificationHTML });
});





// complete signup
app.get("/user/signup",(req,res)=>{
    res.render("signup.ejs");
});

app.post('/user/signup', async (req, res, next) => {
  const { name,email , password } = req.body;
   const user = {
    name: req.body.name,
    email: req.body.email
  };
  if (!name || !email || !password)
    return res.status(400).send('All fields are required');

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query('INSERT INTO webuser (name, email, password) VALUES ?',[[[name, email, hashedPassword]]],
      (err, results) => {
        if (err) {
          return res.status(500).send('Database error');
        } else {
          res.redirect('/?msg=' + encodeURIComponent('register'));
        }
      }
    );
  } catch (err) {
    res.status(500).send('Server error');
  }
});





// Login Route//complete
app.get('/user/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/user/login', (req, res) => {
  const  name = req.body.name;
  const password = req.body.password;
  // Get hashed password from DB by name
  const query = 'SELECT name, password FROM webuser WHERE name = ?';

  connection.query(query, [name], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      console.log("Entered password:", req.body.password);
      return res.redirect('/?msg=' + encodeURIComponent('incorrect password !! Try Again Later.') );
    }

    const user = results[0];
    const hashedPasswordFromDB = user.password;
    console.log("Hashed password from DB:", hashedPasswordFromDB);
    // ✅ Compare plain password with hashed password
    bcrypt.compare(req.body.password, hashedPasswordFromDB, (err, isMatch) => {
      if (err) {
        console.error('Compare error:', err);
        return res.status(500).send('Server error');
      }

      if (isMatch) {
        console.log('✅ Password match - login successful');
        res.redirect('/?msg=' + encodeURIComponent('login'));
      } else {
        console.log('❌ Password did not match');
        res.send('Invalid password');
      }
    });
  });
});





// Logout Route // Incomplete // at last
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Logout error', err);
            return res.status(500).send('Could not logout');
        }
        res.redirect('/');
    });
});





app.get("/user/:laws",(req,res)=>{
    res.render("cyberlaws.ejs");
});

// Complete contactus
app.get("/user/contact/:us",(req,res)=>{  
    res.render("contactus.ejs");
});

app.post('/user/contact/:us', async (req, res, next) => {
  const { full_name , email, subject, message } = req.body;
  const user = {
    full_name: req.body.full_name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message
  };
  try {
    connection.query('INSERT INTO contactus (full_name, email, subject, message) VALUES ?', [[[full_name, email, subject, message]]],
      (err, results) => {
        if (err) {
          console.log('Database error:', err);
          return res.status(500).send('Database error');
        } else {
          res.redirect('/?msg=' + encodeURIComponent('contact'));
        }
      }
    );
  } catch (err) {
    res.status(500).send('Server error');
  }
});





 // complete camplaint
app.get("/user/complaint/:id",(req,res)=>{ 
    res.render("complaint.ejs");
});

app.post('/user/complaint/:id', async (req, res) => {
  const {
  full_name = '',
  email = '',
  contact_number = '',
  complaint_type = '',
  incident_details = ''
} = req.body || {};

  const user = {
    full_name: req.body.full_name,
    email: req.body.email,
    contact_number: req.body.contact_number,
    complaint_type: req.body.complaint_type,
    incident_details: req.body.incident_details
  };
  try {
    connection.query('INSERT INTO complaints (full_name, email, contact_number, complaint_type, incident_details) VALUES ?',[[[full_name, email, contact_number, complaint_type, incident_details ]]],
      (err, results) => {
        if (err) {
          console.log('Database error:', err);
          return res.status(500).send('Database error');
        } else {
          res.redirect('/?msg=' + encodeURIComponent('Complaint submitted.'));
        }
      }
    );
  } catch (err) {
    res.status(500).send('Server error');
  }
});





app.listen (port , ()=> {
    console.log("server is listening : 8080");
});