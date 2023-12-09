import { hashSync } from "bcrypt";
import Account from "../models/account";
import { Request, Response } from 'express'

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
export async function create(req, res) {
    try {
        const {
            name, email, phone, password
        } = req.body;

        for (let field of ['name', 'email', 'phone', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Cannot create account without ${filed}`
                })
            }
        }

        const passwordHash = hashSync(password, 12);

        const account = new Account({
            name, email, phone, password: passwordHash
        }); // avoid putting req.body here directly at all costs

        await account.save();

        res.status(200).json({
            success: 'Account created',
            id: account._id
        })
    } catch (error) {
        res.status(500).json({ error: 'An error occurred in our side, please try again later' });
        console.error(error);
    }
}