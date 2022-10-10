const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const config= process.env;

const verifyToken = (req, res, next) => {
    const token =
      req?.body?.token || req?.query?.token || req?.headers["x-access-token"];
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
    return next();
  };

const hashPassword=(pwd)=>{
    const salt=bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pwd, salt);
}

const comparePassword=(pwd, pwdhash)=>{
    return bcrypt.compareSync(pwd, pwdhash);
}



function generateId(str){
    function fix_arr(arr, max_val){
        let ret=[];
        let carry=0;
        for(let i of arr){
            let v=i+carry;
            if(v>=max_val){
                carry=parseInt(v/max_val);
                v=v%max_val;
            }else{
                carry=0;
            }
            ret.push(v);
        }
        if(carry>0){
            ret.push(carry);
            return fix_arr(ret, max_val);
        }
        return ret;
    }
        
    function arrToString(arr){
        let str='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        arr=fix_arr(arr, 52);
        let ret='';
        for(let i of arr){
            ret+=str[i];
        }
        return ret;
    }

    function toArr(_string){
        let ref="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return _string.split('').map(d=> ref.indexOf(d));
    }

    str=toArr(str);
    str[0]++;
    str=fix_arr(str, 52);
    return arrToString(str);
}

module.exports={
    hashPassword, comparePassword, generateId, verifyToken
}