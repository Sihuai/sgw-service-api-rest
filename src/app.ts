import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotEnv from 'dotenv';

import routeRoot from './routes';
import routeUsers from './routes/users';
import routeAuthenticate from './routes/authenticate';

dotEnv.config();
const app = express();

// middlewares

// #0 - https all things (use where applicable)
// app.use(async (req, res, next) => {
//     if(req.secure){
//         // https connection
//         return next();
//     }

//     // not a https connection
//     const content = req.headers.host?.split(':');
//     if(content){
//         const host = content[0];
//         const config = await getEnvConfig();
//         const url = req.originalUrl;
//         // const params = req.params;
//         res.redirect(`https://${host}:${config.default.https.port}${url}`);
//     }

// })

// #1 - CORS handling for every response that leaves this server.

// this block of manual CORS code not able to handle OPTIONS request that contains custom headers properly.
// commented off on 2020.10.24.
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");
//     // res.setHeader("Access-Control-Allow-Credentials", "true");
//     // res.setHeader("Access-Control-Max-Age", "86400");

//     //intercepts OPTIONS method
//     if ('OPTIONS' === req.method) {
//         //respond with 200
//         res.status(200);
//     }
//     // else {
//     //   //move on
//     //     next();
//     // }

//     // move on to the next thing to do in express app
//     next();
// });
// ----

// use CORS middleware 
app.use(cors());

// #2 - make JSON response available 
app.use(express.json());

// #3 - handle cookies (in the header) and make them available in the
//     request.cookie attribute.
app.use(cookieParser());

// #4 - declare the handler for authorization attribute in the request header
//      (useable at the route level)
const authenticateToken = (req, res, next) => {
    
    // middleware to get the access token from the header
    // (i.e. authorization : 'Bearer TOKEN')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // exceptions handling
    if( token == null) {
        const rtn = {
            ok: false,
            status: 401,
            msg: {
                type: 'AUTHORIZATION CHECK - EXCEPTIONS',
                message: `Not Authorized to Access.`
            }
        }
        return res.status(401).json(rtn);
    }

    // ok.  
    // test the jwt.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
        
        // exceptions handling
        if(err) {
            
            if(err.name === 'JsonWebTokenError' && err.message === 'invalid token'){
                
                // due to invalide jwt
                const rtn = {
                    ok: false,
                    status: 403,
                    msg : {
                        type: 'AUTHORIZATION CHECK - EXCEPTION',
                        message: `Invalid Token.  Access Forbidden by API service.`
                    }
                }
                return res.status(403).json(rtn);
            }

            // in general
            return res.status(403).json({
                ok: false,
                status: 403,
                msg : {
                    type: 'AUTHORIZATION CHECK - EXCEPTIONS',
                    message: `Access Forbidden by API servcie.`
                }
            })
            
        }

        //ok.
        const { iat, exp, ...u } = user; 
        req.query['user'] = u;
        next();
    })
    
}


// routes

app.use('/authenticate', routeAuthenticate );
app.use('/users', authenticateToken, routeUsers);
app.use('/', routeRoot);

export default app;