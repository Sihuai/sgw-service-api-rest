import executor from './executor';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// load the environment parameters
dotenv.config();

const model: any = {};

let refreshTokens: any[] = [];

model.getUserNick = async(params: any) => {

    // function to get the nickname of the specific
    // user record that matches the params.

    // exceptions handling
    
    const { qs } = params.query;
    const qsParsed = JSON.parse(qs);
    
    // const {email, username} = params.params;
    // const input = {email};
    const input = {
        filter : [`email == '${qsParsed.email}'`]
    }
    try{
        const outcome = await executor.getList(input);
        
        // exceptions handling
        if(!outcome.ok){
            return outcome;
        }

        // ok.
        const nick = outcome.list[0].nick;
        const rtn = {
            ok: outcome.ok,
            data: { nick}
        }
        return rtn;
    }
    catch(err){
        throw err;
    }        
    

}

model.authenticate = async(params: any) => {

    // function to authenticate a specific user
    // and return a JWT.

    // exceptions handling
    const input = {
        filter: [`email == '${params.email}' && `, `pwhash == '${params.pwhash}'`]
    }
    try{

        const outcome = await executor.authenticate(input);

        // exceptions handling
        if( !outcome.ok || (outcome.list.length === 0)){
            return {
                ok: false,
                msg: {
                    type: 'AUTHENTICATION API - EXCEPTIONS',
                    message: `Fail to authenticate user credential passed in.`
                },
                token: {}
            };
        }

        // ok.
        const user = outcome.list[0];
        // const tokenAccess = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        const inputAccess = {
            content : user,
            key: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
        }
        // console.log(`inputAccess -> ${JSON.stringify(inputAccess)}`);
        const tokenAccess = generateToken(inputAccess);
        
        const inputRefresh = {
            content: user,
            key: process.env.REFRESH_TOKEN_SECRET
        }
        const tokenRefresh = generateToken(inputRefresh);
        
        // refreshTokens.push(tokenRefresh);
        
        // insert tokenRefresh into database
        const inputToken = {
            add: {
                token: tokenRefresh,
                email: user.email
            }
        }
        const inserted = await executor.addToken(inputToken)

        const rtn = {
            ok : true,
            token : {
                access: tokenAccess,
                refresh: tokenRefresh
            },
            msg : {
                type : 'AUTHENTICATION API - SUCCESS',
                message : 'User is authenticated.'
            }
        }
        return rtn;

    }catch(err){
        throw err;
    }
}

model.getToken = async (params) => {

    // function to refresh token
    
    // exceptions handling
    if(params.token == null){
        return {
            ok: false,
            status: 401
        }

    }

    // check against the list of token issued
    // in the database
    const input = {
        filter: [`token == '${params.token}'`]
    }

    const outcome = await executor.getToken(input);
    
    if( !outcome.ok ){
        // no token returned
        return {
            ok: false,
            status: 403
        }

    }
    const tokenInDB = outcome.token;

    // partially ok.
    return jwt.verify(tokenInDB, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err){
            return {
                ok: false,
                status: 403
            }
        }

        //ok.
        const content = {
            username: user.username,
            email: user.email,
            isActive: user.isActive,
            role: user.role,
            nick: user.nick
        }

        const input = {
            content : content,
            key: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '60s'
        }
        const tokenAccess = generateToken(input);

        return {
            ok: true,
            status : 200,
            token: {
                access: tokenAccess
            }
        }
    })

}

model.logout = async (params) => {

    // function to logout a specific user

    // get the token
    const token = params.token;

    // remove the token from the database.
    const outcome = await executor.removeToken(params);
    if( !(outcome.removed.length > 0)){
        return {
            ok : false,
            msg : {
                type : 'AUTHENTICATION API - EXCEPTIONS',
                message : 'User is not properly logout.'
            }    
        }
    }

    // ok.
    const rtn = {
        ok : true,
        msg : {
            type : 'AUTHENTICATION API - SUCCESS',
            message : 'User is logout.'
        }
    }
    return rtn;
}


// private functions
const generateToken = (params) => {
    
    try{
        
        // exceptions handling.
        if(!params.expiresIn){
            return jwt.sign(params.content, params.key);
        }
        
        // expiresIn is not empty.
        const token = jwt.sign(params.content, params.key, {expiresIn: params.expiresIn});
        return token;

    }catch(err){
        throw err;
    }
    
}

export default model;