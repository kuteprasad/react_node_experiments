import express from 'express';
import cors from 'cors';
import session from "express-session";
import passport from 'passport';
import LocalStrategy from 'passport-local';
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

passport.use('local', new LocalStrategy(
  { usernameField: 'email' }, // Specify 'email' instead of 'username'
  function(username, password, done) {
    console.log("passport local : ", username, password);
    
    db.collection('users').findOne({ email: username }, function (err, user) {
      console.log(user);
      
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if ( user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  db.collection('users').findOne({_id : new ObjectId(id)}, function (err, user) {
    done(err, user);
  });
});

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });

app.post('/api/login', passport.authenticate('local', { failureRedirect: '/api/login' }),
 async (req, res) => {
  
  const info = req.body;
  console.log("reached app.js --->>>>>" );
  console.log(info);
  
  
  // try {
      // const data =  await db.collection('users').insertOne(info);
      
      res.json({status: true});
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).json({status: false, error: "Effor occurred while inserting data"});
    // }
   

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