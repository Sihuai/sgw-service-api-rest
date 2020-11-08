import moment from 'moment';
import ds from '../../../../lib/connect-to-arangodb-v2';
import { executeScript, getList, parseFilter } from '../../../../lib/arangodb-helper';

const executor: any = {};

executor.getOne = async (params) => {

    const rtn = `{
        "_id"      : i._id,
        "_key"     : i._key,
        "_rev"     : i._rev,
        "nick"     : i.nick,
        "username" : i.username,
        "email"    : i.email,
        "role"     : i.role,
        "isActive" : i.isActive,
        "nameFirst": i.nameFirst,
        "nameLast" : i.nameLast
    }`;

    const aql = {
        for: 'i',
        in: 'Users',
        filter: parseFilter(params.filter),
        return: rtn
    };

    try{
        const outcome = await getList(aql, ds.security);
        
        // exceptions handling
        if( !outcome.ok){
            return outcome;
        }
        
        // ok.
        
        return {
            ok: true,
            data: outcome.list[0]
        }

    }catch(err){
        throw err;
    }
}

export default executor;