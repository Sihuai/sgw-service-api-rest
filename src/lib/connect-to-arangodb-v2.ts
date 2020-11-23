// import { getDataStore } from './arangodb-helper';
// import dotenv from 'dotenv';

// dotenv.config();

// // const DS_APP_CONFIG_NAME = process.env.DS_APP_CONFIG_NAME || '';
// const DS_SECURITY_CONFIG_NAME = process.env.DS_SECURITY_CONFIG_NAME|| '';
// const DS_APP_CONFIG_NAME = process.env.DS_APP_CONFIG_NAME|| '';
// const ENV = process.env.NODE_ENV || 'development';

// const ds: any = {};

// ds.connect = async() => {
//     try{
//         const dbSecurity = await getDataStore(ENV, DS_SECURITY_CONFIG_NAME);
//         ds.security = dbSecurity;

//         const dbApp = await getDataStore(ENV, DS_APP_CONFIG_NAME);
//         ds.app = dbApp;
//         return ds;    
//     }catch(err){
//         throw err;
//     }
// }

// ds.close = async() => {

//     if( typeof(ds.app) !== undefined ){
//         ds.app.close();
//     }

//     if( typeof(ds.security) !== undefined){
//         ds.security.close();
//     }

//     return;
// }

// export default ds;