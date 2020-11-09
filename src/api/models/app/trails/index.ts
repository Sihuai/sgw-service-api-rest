import executor from './executor';
import media from '../../utility/mediaContents';

const model: any = {};

model.get = async(params) => {
    // function to retrieve Trail records that matches the 
    // specified filtering conditions.

    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - GET - OK',
                message : `Successful Trails records retrieval.` 
            },
            list : [],
            paging: {}
        };
        
        return rtn;

    }catch(err){
        
        // error
        
        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - GET - ERROR',
                message : `Trails records retrieval 'FAILED'.` 
            }
        };
        
        return rtn;
    }
    
}

model.add = async(params) => {
    // function to add a Trail record

    // exceptions handling

    // ok.
    const {media, ...add} = params.add;
    const promises: any[] = [];

    try{
        const inputTrail = {add};
        const inputMedia = {add: media};

        // const outcome = await executor.add(inputTrail);
        promises.push(await executor.add(inputTrail));
        promises.push(await media.add(inputMedia));

        const fullfilled = await Promise.all(promises);

        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - ADD - OK',
                message : `Trail record added.` 
            },
            added : {}
        };
        
        return rtn;
    }catch(err){
        
        // error
        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - ADD - ERROR',
                message : `Trail record addition 'FAILED'.` 
            }
        };
        
        return rtn;
    }
}

model.update = async(params) => {
    // function to update a sepcific Trail record


    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - UPDATE - OK',
                message : `Trail record updated.` 
            },
            updated : {}
        };
        
        return rtn;
    }catch(err){
        
        // error
        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - UPDATE - ERROR',
                message : `Trail record update 'FAILED'.` 
            }
        };
        
        return rtn;
    }
}

model.remove = async(params) => {
    // function to remove a specific Trail record
    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - REMOVE - OK',
                message : `Trail record removed.` 
            },
            removed : {}
        };
        
        return rtn;
    }catch(err){
        
        // error
        const rtn = {
            ok: true,
            msg : {
                type: 'TRAILS API - REMOVE - ERROR',
                message : `Trails records removal 'FAILED'.` 
            }
        };
        
        return rtn;
    }
}

export default model;