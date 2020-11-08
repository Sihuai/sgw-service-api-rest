/*
**  Route handler - Root
*/

import express from 'express';
import ctlr from '../../api/controllers/users';

const router = express.Router();

router.get('/getProfile', (req, res, next) => {
    return ctlr.getProfile(req, res);
})
export default router;