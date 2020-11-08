/*
**  Route handler - SGW Trails CRUD
*/

import express from 'express';
import ctlr from '../../api/controllers/app/trails';

const router = express.Router();

router.get('/', (req, res) => {
    
    // route to get all Trail records that 
    // matches the filtering conditions.
    return ctlr.get(req, res);
})

router.post('/', (req, res) => {
    
    // route to add a Trail record.
    return ctlr.add(req, res);
});

router.put('/', (req, res) => {
    // route to update a specific Trail record.
    return ctlr.update(req, res);
});

router.delete('/', (req, res) => {
    // route to remove a specific Trail record.
    return ctlr.remove(req, res);
});



export default router;