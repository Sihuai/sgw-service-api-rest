import { isEmptyObject } from '../../../lib/validators';
import executor from './executor';

const model: any = {}

model.request = async (params) => {

    // function to request for a password reset.
    if( isEmptyObject(params)){
        // nothing passed in.
        return {
            ok: false,
            msg: {
                type: 'PASSWORD RESET API - EXCEPTIONS',
                message: `Parameter JSON passed in is not set or empty.`
            }
        }
    }

    if( !params.email ){
        // email not passed in
        return {
            ok: false,
            msg: {
                type: 'PASSWORD RESET API - EXCEPTIONS',
                message: `Parameter, 'email' is not passed in.`
            }
        }
    }

    if( params.email.length === 0){
        // email not passed in
        return {
            ok: false,
            msg: {
                type: 'PASSWORD RESET API - EXCEPTIONS',
                message: `Parameter, 'email' is empty.`
            }
        }

    }

    // ok.
    try{
        
        const outcome = await executor.request(params);
        
        // exceptions handling
        if( !(outcome.length > 0) ){
            return {
                ok: false,
                msg : {
                    type: 'RESET PASSWORD API - EXCEPTION',
                    message: `Fail to submit the 'Reset Password' request.`
                }
            }
        }

        // ok.
        return {
            ok : true,
            msg: {
                type : 'RESET PASSWORD API - OK',
                message : `'Reset Password' request submitted.`
            },
            list: outcome
        };

    }catch(err){
        return {
            ok: false,
            msg: {
                type: 'RESET PASSWORD API - ERROR',
                message: `Fail to submit 'Reset Password' request.`
            }
        }
    }
    

}

model.execute = async (params) => {
    // function to reset the password
    
    // exceptions handling
    if( isEmptyObject(params)){
        // nothing passed in.
        return {
            ok: false,
            msg: {
                type: 'PASSWORD RESET API - EXCEPTIONS',
                message: `Parameter JSON passed in is not set or empty.`
            }
        }
    }

    if( !params.email || !params.code ){
        // email not passed in
        return {
            ok: false,
            msg: {
                type: 'PASSWORD RESET API - EXCEPTIONS',
                message: `Parameter, 'email' or 'code' is not passed in.`
            }
        }
    }

    if( params.email.length === 0 || params.code.length === 0){
        // email not passed in
        return {
            ok: false,
            msg: {
                type: 'PASSWORD RESET API - EXCEPTIONS',
                message: `Parameter, 'email' or 'code' is empty.`
            }
        }

    }

    // ok.

    try{

        const outcome = await executor.reset(params);

        // exceptions handling
        if(outcome.length === 0){
            return {
                ok: false,
                msg: {
                    type: '',
                    message: ''
                }
            };
        }

        // ok.
        return {
            ok: true,
            msg: {
                type: 'RESET PASSWORD API - OK',
                message: `Password was reset.`
            },
            list: outcome
        };

    }catch(err){
        return {
            ok: false,
            msg: {
                type: 'RESET PASSWORD API - ERROR',
                message: `Fail to reset password.`
            }
        }
    }

}

export default model;
