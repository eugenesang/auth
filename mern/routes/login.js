import { Router } from "express";
import Account from "../models/account";
import { compareSync } from "bcrypt";

const route = Router();

route.post('/', async (req, res)=>{
    try {
        const {
            email, password
        } = req.body;

        if(!email || !password){
            return res.status(400).json({
                error: 'You must include an email and a password in your request'
            })
        }

        const account = await Account.findOne({email});

        if(!account){
            return res.status(404).json({
                error: 'Account was not found'
            })
        }

        const pwdOk = compareSync(password, account.password);

        if(pwdOk){
            return res.json({
                success: "Login was a success"
            })
        }else{
            res.status(403).json({
                error: "Wrong password, try again"
            })
        }
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred on our side, please try again later'
        });

        console.error(error);
    }
})

export default route;