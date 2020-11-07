/*
** Script to determine the specific environment configuration
** file to use.
*/

const loadConfig = async (env: string): Promise<any> => {
    
    
    switch(env){
        case 'STAGE':
            return await import('../config/env/stage');;
        case 'PRODUCTION':
            return await import('../config/env/production');
        default:
            return await import('../config/env/development');
    }
}

// check what environment info is passed in
// default environment is 'development'
export const getEnvConfig = async (): Promise<any> => {

    // exceptions handling

    // process.env.NODE_ENV is undefined
    if( 
        process.env.NODE_ENV === undefined || 
        typeof process.env.NODE_ENV !== 'string'
    ){
        return await loadConfig('DEVELOPMENT');
    }

    // process.env.NODE_ENV is 'string' but empty.
    if(
        typeof process.env.NODE_ENV === 'string' &&
        process.env.NODE_ENV.trim().length === 0
    ){
        return await loadConfig('DEVELOPMENT');
    }

    // ok.  process.env.NODE_ENV is defined and not an empty 'string'.
    try{
        return await loadConfig(process.env.NODE_ENV.toUpperCase());
    }catch(err) {
        // error.
        throw err;
    }
    
    
    
}





