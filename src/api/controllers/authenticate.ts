import model from '../models/authenticate';

import dotenv from 'dotenv';
dotenv.config();

const ctlr: any = {};

ctlr.authenticate = async(req, res) => {

    // function to sign in a user.
    const outcome = await model.authenticate(req.body);
    if( outcome.ok){
        
        // tokens handling

        const {refresh, ...rest } = outcome.token;
        outcome.token = {...rest};

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'? true: false
        }
        res.cookie('r-token', refresh, cookieOptions)
    }
    
    res.json(outcome);
    return;
}

ctlr.getUserNick = async (req, res) => {
    // function to get the nickname of the specific username
    const outcome = await model.getUserNick(req);
    res.json(outcome);
    return;
}

ctlr.getToken = async (req, res) => {
    
    const token = req.cookies['r-token'];
    // const outcome = await model.getToken(req.body);
    const outcome = await model.getToken({token});
    if(outcome.status !== 200){
        res.sendStatus(outcome.status);
        return;
    };

    // ok.
    res.json(outcome);
    return;
}

ctlr.logout = async(req, res) => {

    // function to logout a user.
    const outcome = await model.logout(req.body);
    if( outcome.ok){

        // token handling. clear the cookie.
        const cookieOptions = {
            path: '/'
        }
        res.clearCookie('r-token', cookieOptions);

    }
    res.json(outcome);
    return;
}


// private functions
const sendTokenCookie = (token, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'? true: false
    }
    res.cookie('r-token', token, cookieOptions)
}

export default ctlr;

