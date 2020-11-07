import ds from '../../../lib/connect-to-arangodb-v2';
import { getList, parseFilter, addItem } from "../../../lib/arangodb-helper";

const executor : any = {};

executor.addUser = async (params) => {
    // function to add a user into the database,
    // after existance check.
    const input = {
        filter : [`email == '${params.email}'`]
    }
    const existedCheck = await executor.isExistingUser(input)
    
    // exceptions handling
    if( existedCheck.existed ){
        return {
            ok: false,
            msg: {
                type: 'REGISTRATION API - EXCEPTIONS',
                message: `Email has been used by another User.`
            }
        }
    }

    // ok.
    const aql = {
        insert: {...params, isActive: true, role: 'Guest'},
        into: 'Users',
        return: 'NEW' 
    }

    try{
        const outcome: Array<any> = await addItem(aql, ds.security);
        
        // exceptions handling
        if(outcome.length === 0){
            return {
                ok: false,
                added: []
            };
        }

        // ok. 
        const { pwhash, ...rest} = outcome[0];
        return {
            ok : true,
            added : rest
        };

    }catch(err){
        throw err;
    }
    
    
}

executor.isExistingUser = async (params) => {
    // function to check if the user already existed in the database
    // check by email

    const returnClause = `
    {
        username: i.username,
        email: i.email,
        nick : i.nick,
        isActive: i.isActive
    }
    `;

    const aql = {
        for: 'i',
        in: 'Users',
        filter: parseFilter(params.filter),
        return: returnClause
    };

    try{
        const outcome = await getList(aql, ds.security)
        
        // exceptions handling
        if( !outcome.ok){
            return outcome;
        }

        // ok.
        if(outcome.list?.length > 0 ){
            return {
                ok: true,
                existed : true
            }
        }

        // user does not exist in database
        return {
            ok: true,
            existed: false
        };

    }catch(err){
        throw err;
    }


}
export default executor;