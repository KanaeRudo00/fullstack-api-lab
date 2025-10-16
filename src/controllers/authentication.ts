import express from 'express'
import { createUser, getUserByEmail } from 'mongo-db/user';
import { authentication, random } from 'mongo-db/helpers';

export const register = async (req:express.Request, res:express.Response) =>{
    try{
        const {email, password, username} = req.body;

        if(!email || !password || !username){
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.sendStatus(409);
        }

        const salt = random();
        const user = await createUser({
            email,
            username, 
            password,
            authentication:{
                salt,
                password: authentication(salt, password),
            },
        })

        return res.status(200).json(user).end();
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}

export const login = async(req:express.Request, res:express.Response) =>{
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if(!user){
            return res.sendStatus(400);
        }
        const expectedHash = authentication(user.authentication.salt!, password);
        if(user.authentication.password !== expectedHash){
            return res.sendStatus(401);
        }
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('kanae-cookiejar', user.authentication.sessionToken, {domain: 'localhost', path: '/'});
        return res.status(200).json(user).end();
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}


export const hi = async(req: express.Request, res: express.Response) =>{
    console.log('User say hi');
    return res.sendStatus(200);
}