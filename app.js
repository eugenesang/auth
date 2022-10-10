require("dotenv").config();

const {HOST, PORT} = process.env;

const express=require("express");

const app=express();

const cors=require("cors");

const {verifyToken:auth}=require("./utilities")

const allUsers=require("./db.conn.js").getUsers;

app.use(cors({origin:HOST}));

app.post("/welcome", auth, (req, res)=>{
    res.send("welcome");
})

app.use("/user", require("./routes"))

app.get("/", (req, res)=>{
    allUsers((err, data)=>{
        if(err){
            res.status(400).json(err);
        }else{
            res.json(data);
        }
    })
});

app.listen(PORT, ()=>{
    console.log("server is on port 3001");
})