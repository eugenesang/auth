import express from 'express';
import mongoose from 'mongoose';

// routes

import accountRoute from './routes/account.js';
import loginRoute from './routes/login.js'

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const uri = 'mongodb://127.0.0.1:27017';

mongoose.connect(uri,{useNewUrlParser:true, useUnifiedTopology:true})
.then(data=>{
    app.listen(4080, ()=>{console.log("app listening on port 3001")});
});


app.get('/', (req, res)=>{
    res.json({success: 'Connection to API endpoint was a success'});
})

app.use('/account', accountRoute);
app.use('/login', loginRoute)