import express from 'express';
import cors from 'cors';
import session from "express-session";
import passport from 'passport';
import { Strategy  } from 'passport-local';
import env from 'dotenv';
import { ObjectId } from 'mongodb';

import connectToDB from './mongo-connect.js';

const app = express();
const port = 3000;
env.config();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's origin
  credentials: true
}));

app.use(express.json());
app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: false,
cookie:{
  maxAge: 7 * 24 * 60 * 60 * 1000 // set session age to 7 days
}
}));
app.use(passport.initialize());
app.use(passport.session());

let db;

(async ()=> {
  try {
    
    db = await connectToDB();
    console.log("Connected to MongoDB successfully");
    
  } catch (error) {
    console.error("failed to connect" ,error);
    process.exit(1);
  }
} )();

// passport.use('local', new LocalStrategy(
//   { usernameField: 'email' },  // Specify the username field to be 'email'
//   function(username, password, done) {
//     console.log("Received credentials:", username, password);

//     db.collection('users').findOne({ email: username }, function (err, user) {
//       if (err) { 
//         console.error("Error finding user:", err);
//         return done(err); 
//       }
//       if (!user) { 
//         console.log("User not found");
//         return done(null, false, { message: 'Incorrect email.' }); 
//       }

//       // Direct string comparison
//       if (user.password !== password) { 
//         console.log("Password mismatch");
//         return done(null, false, { message: 'Incorrect password.' });
//       }

//       console.log("Authentication successful");
//       return done(null, user);
//     });
//   }
// ));



// // Use email instead of id
// passport.serializeUser((user, done) => {
//   done(null, user.email);  // Serialize with email
// });

// passport.deserializeUser((email, done) => {
//   db.collection('users').findOne({ email: email }, (err, user) => {
//     done(err, user);  // Deserialize by email
//   });
// });

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working!' });
});

app.get("/", (req, res) => {
  res.json("welcome to Dashboard");
});

app.get("/api/login", (req, res) => {
  res.status(404).json({status: false});
});

app.get("/api/authStatus", async (req, res) => {
   if(req.isAuthenticated())
   {
    res.json(
      {status: true}
    ) ;
   }
   else
   res.json(
    {status: false}
  ) ;
});

app.get("/api/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // Send a 200 response with a message
    res.status(200).json({ msg: "logged out" });
  });
});


app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error during authentication:", err);
      return res.status(500).json({ status: false, error: "Internal server error" });
    }
    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.status(401).json({ status: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ status: false, error: "Internal server error" });
      }
      return res.json({ status: true });
    });
  })(req, res, next);
});




// app.post(
//   "/api/login",
//   passport.authenticate("local"), (req, res) =>{
//     if(req.isAuthenticated()){
//       res.json({status: true});
//     }
//     else
//     res.json({status: false});
//   }
// );

passport.use(
  new Strategy(async function verify(username, password, done) {
    try {
      const user = await db.collection('users').findOne({ email: username });

      if (!user) {
        console.log("User not found");
        return done(null, false, { message: 'User not found' });
      }

      if (user.password !== password) {
        console.log("Incorrect password");
        return done(null, false, { message: 'Incorrect password' });
      }

      console.log("Authentication successful");
      return done(null, user);
    } catch (err) {
      console.error("Error in authentication strategy:", err);
      return done(err);
    }
  })
);


passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// handle server shutdown

process.on('SIGINT', async () => {
  console.log("Closing MongoDB Connection");
  if (db && db.client) {
    await db.client.close();
  }
  process.exit(0);
});