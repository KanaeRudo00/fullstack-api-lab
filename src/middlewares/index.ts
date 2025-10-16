import express from 'express';
import lodash from 'lodash';

import {getUserBySessionToken } from 'mongo-db/user';


export const isOwner = async (req:express.Request, res:express.Response, next:express.NextFunction)=>{
    try{
        const {id} = req.params;
        const currentUserId = lodash.get(req, 'identity._id')! as string;

        if(!currentUserId){
            return res.sendStatus(403);
        }

        if(currentUserId.toString() !== id){
            return res.sendStatus(403);
        }
        next();
    }catch(error){
        console.log(error);
        res.sendStatus(400);
    }
}
export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) =>{
    try{
        const sessionToken = req.cookies['kanae-cookiejar'];
        if(!sessionToken){
            return res.sendStatus(401);
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser){
            return res.sendStatus(401);
        }

        lodash.merge(req, {identity:existingUser});

        return next();
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}