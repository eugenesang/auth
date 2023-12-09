import express from 'express';
import Account from '../models/account';

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next
 * @returns 
 */
export async function authCheck(req, res, next){
    try {
        const id = req.headers.uid;

        if(!id){
            return res.status(403).json({
                error: 'Permission denied'
            })
        };

        const account = await Account.findById(id);

        if(!account){
            return res.status(403).json({
                error: 'Permission denied. Account does not exist'
            })
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}