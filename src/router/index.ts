import express from 'express'

import authentication from './authentication';
import users from './users';
const router = express.Router();

export default (): express.Router =>{
    console.log("Router initialized");
    authentication(router);
    users(router);
    return router;
}

