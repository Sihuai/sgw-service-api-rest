import executor from './executor';

const model: any = {};

model.get = async(params) => {
    // function to retrieve Category records that matches the 
    // specified filtering conditions.

    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'CATEGORIES API - GET - OK',
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
                type: 'CATEGORIES API - GET - ERROR',
                message : `Category records retrieval 'FAILED'.` 
            }
        };
        
        return rtn;
    }
    
}

model.add = async(params) => {
    // function to add a Category record
    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'CATEGORIES API - ADD - OK',
                message : `Category record added.` 
            },
            added : {}
        };
        
        return rtn;
    }catch(err){
        
        // error
        const rtn = {
            ok: true,
            msg : {
                type: 'CATEGORIES API - ADD - ERROR',
                message : `Trail record addition 'FAILED'.` 
            }
        };
        
        return rtn;
    }
}

model.update = async(params) => {
    // function to update a sepcific Category record


    try{

        const rtn = {
            ok: true,
            msg : {
                type: 'CATEGORIES API - UPDATE - OK',
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
                type: 'CATEGORIES API - UPDATE - ERROR',
                message : `Trail record update 'FAILED'.` 
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
                type: 'CATEGORIES API - REMOVE - OK',
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
                type: 'CATEGORIES API - REMOVE - ERROR',
                message : `Category records removal 'FAILED'.` 
            }
        };
        
        return rtn;
    }
}

export default model;