const express=require("express");
const {hashPassword, comparePassword, generateId}=require("./utilities")
const jwt=require("jsonwebtoken")

const route=express.Router();

const {createUser, getUserByEmail, lastUid, updateSpecificUserInfo, updateId}=require("./db.conn.js")

route.use(express.json());

route.post("/create", (req, res)=>{
    const {name, email, phone, password, dob}=req.body;
    const user={name, email, phone, password, dateOfBirth:dob}
    if(!(name && email && phone && password && dob)){
        return res.status(403).json({error:"Incomplete registration Information"});
    }

    getUserByEmail(email, (err, data)=>{
        if(data){
            return res.status(400).json(new Error("User Already Exists, Login"))
        }
    })  

    user.password=hashPassword(password);
    
    lastUid(((err, uid)=>{
        if(err){
            console.log(err)
        }else{
            user.id=generateId(uid);
            updateId(user.id);
        }
        const token = jwt.sign(
            { user_id: user.id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
        createUser(user, (err1, ans)=>{
            if(err1){
                console.log(err1);
                return res.status(400).json(err1);
            }
            console.log(ans);
        })
        updateSpecificUserInfo({id:user.id, info:"access_token", value: token},(err, usr)=>{
            if(err) console.log(err);
            res.json({success:"Sign Up was Successful"});
        } )
    }))

})

// ...

route.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      getUserByEmail(email, (err, user)=>{
        
        if(err) return res.status(400).json(err);
       else{ 
            let correctPwd=user?comparePassword(password, user.password):user;
            if (user && correctPwd) {
                console.trace(user);
                // Create token
                const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
                );
        
                // save user token
                user.token = token;
        
                // user
                res.status(200).json(user);
            }else if(!correctPwd) res.status(400).send("Wrong Password")
            else res.status(400).send("Invalid Credentials");
        }
        })
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
});
  

module.exports=route;