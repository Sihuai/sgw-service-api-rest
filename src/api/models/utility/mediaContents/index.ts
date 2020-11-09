import executor from './executor';

const model : any = {};

model.add = async (params) => {
    // function to add a Media Content record
    
    // exceptions handling.

    // ok.
    try{
        
        const outcome = await executor.add(params);

        const rtn = {
            ok: true,
            msg : {
                type: 'MEDIA CONTENTS API - ADD - OK',
                message : `Media Content record added.` 
            },
            added : outcome
        };
        
        return rtn;
    }catch(err){
        
        // error
        const rtn = {
            ok: false,
            msg : {
                type: 'MEDIA CONTENTS API - ADD - ERROR',
                message : `Media Content record addition 'FAILED'.` 
            }
        };
        
        return rtn;
    }
};

model.get = async(params) => {
    // function to retrieve Category records that matches the 
    // specified filtering conditions.

    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'MEDIA CONTENTS API - GET - OK',
                message : `Successful Category records retrieval.` 
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
                type: 'MEDIA CONTENTS API - GET - ERROR',
                message : `Category records retrieval 'FAILED'.` 
            }
        };
        
        return rtn;
    }
    
};

model.update = async(params) => {
    // function to update a sepcific Category record


    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'MEDIA CONTENTS API - UPDATE - OK',
                message : `Media Content record updated.` 
            },
            updated : {}
        };
        
        return rtn;
    }catch(err){
        
        // error
        const rtn = {
            ok: true,
            msg : {
                type: 'MEDIA CONTENTS API - UPDATE - ERROR',
                message : `Media Content record update 'FAILED'.` 
            }
        };
        
        return rtn;
    }
}

model.remove = async(params) => {
    // function to remove a specific Category record
    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'MEDIA CONTENTS API - REMOVE - OK',
                message : `Media Content record removed.` 
            },
            removed : {}
        };
        
        return rtn;
    }catch(err){
        
        // error
        const rtn = {
            ok: true,
            msg : {
                type: 'MEDIA CONTENTS API - REMOVE - ERROR',
                message : `Category records removal 'FAILED'.` 
            }
        };
        
        return rtn;
    }
};


export default model;