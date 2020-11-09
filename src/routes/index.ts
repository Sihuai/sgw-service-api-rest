/*
**  Route handler - Root
*/

import express from 'express';
import ctlrRegister from '../api/controllers/security/register';
import ctlrAuthenticate from '../api/controllers/security/authenticate';
import ctlrResetPassword from '../api/controllers/security/resetPassword';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('Home Page - Root');
});

router.post('/register', (req, res, next) => {
    return ctlrRegister.registerUser(req, res);
})

router.post('/logout', (req, res, next) => {
    return ctlrAuthenticate.logout(req, res);
})

router.post('/resetPassword/request', (req, res, next) => {
    return ctlrResetPassword.request(req, res);
})

router.post('/resetPassword/execute', (req, res, next) => {
    return ctlrResetPassword.execute(req, res);
})

export default router;


