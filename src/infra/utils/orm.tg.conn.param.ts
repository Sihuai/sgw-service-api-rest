import moment from "moment";
import { getDataStoreConfiguration } from "../../config/db.config";
import { logError } from "../../lib/logger";
import { ConnectionOptions } from "./oct-orm";

// export interface IORMConnection {
// }

// export const ormTGConnParam = () => {
//     const DS_TG_CONFIG_NAME = process.env.DS_SECURITY_CONFIG_NAME|| '';
//     const ENV = process.env.NODE_ENV || 'development';
    
//     const dsConfig = getDataStoreConfiguration(ENV, DS_TG_CONFIG_NAME);

//     if(dsConfig != undefined){
//         try{
//             const dbParams:Partial<ConnectionOptions> = {
//                 database: dsConfig.dbName,
//                 password: dsConfig.password,
//                 username: dsConfig.userid,
//                 url: dsConfig.url,
//                 log: true,
//                 syncronize: true
//             }

//             return dbParams;
//             // return createConnection({ ...options, name: 'default' }) as Promise<IORMConnection>;
//         }catch(err){
//             const messages: string[] = [];
//             messages.push(`${moment().format('YYYY-MM-DD HH:mm:ss')}`);
//             messages.push(`Data Store -> ${JSON.stringify(dsConfig)}`);
//             messages.push('Fail to connect to the specified ArangoDB Data Store.');
//             logError(messages);

//             throw err;
//         }
//     }

//     return null;
// };

const DS_TG_CONFIG_NAME = 'api-security';// process.env.DS_SECURITY_CONFIG_NAME|| '';
const ENV = process.env.NODE_ENV || 'development';

const dsConfig = getDataStoreConfiguration(ENV, DS_TG_CONFIG_NAME);

export const ormTGConnParam:Partial<ConnectionOptions> = {
    database: dsConfig?.dbName,
    password: dsConfig?.password,
    username: dsConfig?.userid,
    url: dsConfig?.url,
    log: true,
    syncronize: true
}