import express from 'express';
import { hi, login, register } from '../controllers/authentication'

export default(router: express.Router) =>{
    console.log("Authentication router loaded");
    router.post('/auth/register', register);
    router.post('/auth/login', login);
    router.post('/auth/hi', hi);
}
