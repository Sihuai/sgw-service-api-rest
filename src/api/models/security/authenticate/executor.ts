import dataStore from '../../../../lib/connect-to-arangodb-v2';
import { addItem, getList, executeScript, parseFilter } from '../../../../lib/arangodb-helper';

const executor: any = {};

executor.getList = async(params) => {

    // function to retrieve the specific
    // User record that matches the params
    
    const aql = {
        for: 'i',
        in: 'Users',
        filter: parseFilter(params.filter),
        return: 'i'
    };

    try{
        const ds = await dataStore.connect();
        const outcome = await getList(aql, ds.security);
        ds.close();
        return outcome;

    }catch(err){
        throw err;
    }

}

executor.authenticate = async(params) => {

    const returnClause = `{
        username : i.username,
        email : i.email,
        nick : i.nick,
        role : i.role,
        isActive : i.isActive
    }`
    
    const aql = {
        for : 'i',
        in : 'Users',
        filter: parseFilter(params.filter),
        return: returnClause
    };

    try{
        const ds = await dataStore.connect();
        const outcome = await getList(aql, ds.security);
        ds.security.close();
        return outcome;
    }catch(err){
        throw err;
    }
}

executor.add = async (params) => {

    const aql = {
        insert: params.add,
        into: 'Users',
        return: 'NEW'
    }

    try{
        const ds = await dataStore.connect();
        const outcome = await addItem(aql, ds.security);
        ds.security.close();
        return outcome;

    }catch(err){
        throw err;
    }
}

// token related functions
executor.addToken = async(params) => {

    // function to add a refresh token
    // into database

    const aql = {
        insert: params.add,
        into : 'Tokens',
        return: 'NEW'
    }

    try{
        const ds = await dataStore.connect();
        const outcome = await addItem(aql, ds.security);
        ds.security.close();
        return outcome;

    }catch(err){
        throw err;
    }
}

executor.getToken = async(params) => {

    // function to get token from database
    const aql = {
        for : 'i',
        in : 'Tokens',
        filter : parseFilter(params.filter),
        return : 'i'

    } 

    try{
        const ds = await dataStore.connect();
        const outcome = await getList(aql, ds.security);
        ds.security.close();

        if( outcome.list.length === 0){
            return {
                ok : false,
                token: {}
            }
        }

        // ok.
        return {
            ok: true,
            token: outcome.list[0].token
        };

    }catch(err){
        throw err;
    }
}

executor.removeToken = async ( params ) => {

    // function to remove an issued token in the database
    const aql = `
    LET tokens = (
        FOR i IN Tokens
        FILTER (
            i.token == '${params.token}' &&
            i.email == '${params.email}'
        )
        RETURN i
    )

    FOR t IN tokens
    REMOVE {_key : t._key}
    IN Tokens

    RETURN OLD
    `;
    try{
        const ds = await dataStore.connect();
        const outcome = await executeScript(aql, ds.security);
        ds.security.close();
        return {
            ok: true,
            removed: [...outcome]
        }
        // return outcome;
    }catch(err){
        throw err;
    }
    //
}




export default executor;
