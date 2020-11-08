import executor from './executor';
// import jwt from '../authenticate/node_modules/jsonwebtoken';
// import dotenv from 'dotenv';

const model: any = {}

model.getProfile = async (params) => {

    // function to get user profile

    // exceptions handling


    // ok.

    const { qs } = params.query;
    const qsParsed = JSON.parse(qs);

    const input = {
        filter: [`email == '${qsParsed.email}'`]
    };

    try{
        const outcome = await executor.getOne(input);
        
        // exceptions handling.
        if (!outcome.ok){
            return {
                ok: false,
                msg: {
                    type: 'USERS API - EXCEPTION',
                    message: `Fail to retrieve the specific User Profile.`
                }
            };
        }

        // ok.
        return {
            ok: true,
            msg: {
                type: 'USERS API - OK',
                message: `Specific User Profile found.`
            },
            data: outcome.data
        };

    }catch(err){
        return {
            ok: false,
            msg : {
                type : 'USERS API - ERROR',
                message: `Unexpected system error occurred.  Please contact System Administrator.`
            }
        }
    }
    //
}

export default model;