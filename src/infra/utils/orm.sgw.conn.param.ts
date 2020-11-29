import { getDataStoreConfiguration } from "../../config/db.config";
import { ConnectionOptions } from "./oct-orm";

const DS_SGW_CONFIG_NAME = 'api-pms'; // process.env.DS_APP_CONFIG_NAME|| '';
const ENV = process.env.NODE_ENV || 'development';

const dsConfig = getDataStoreConfiguration(ENV, DS_SGW_CONFIG_NAME);

export const ormSGWConnParam:Partial<ConnectionOptions> = {
    database: dsConfig?.dbName,
    password: dsConfig?.password,
    username: dsConfig?.userid,
    url: dsConfig?.url,
    log: true,
    syncronize: false
}