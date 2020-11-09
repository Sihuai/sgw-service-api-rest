/*
**  Route handler - Root
*/

import express from 'express';
import ctlr from '../../api/controllers/security/authenticate';

const router = express.Router();

router.post('/', (req, res, next) => {
    return ctlr.authenticate(req, res);
});

router.get('/getUserNick', (req, res, next) => {
    return ctlr.getUserNick(req, res);
});

router.get('/getToken', (req, res, next) => {
    return ctlr.getToken(req, res);
})
export default router;


