import { getDataStoreConfiguration } from "../../config/db.config";
import { ConnectionOptions } from "./oct-orm";

const DS_TG_CONFIG_NAME = process.env.DS_SECURITY_CONFIG_NAME|| '';
const ENV = process.env.NODE_ENV || 'development';

const dsConfig = getDataStoreConfiguration(ENV, DS_TG_CONFIG_NAME);

export const ormTGConnParam:Partial<ConnectionOptions> = {
    database: dsConfig?.dbName,
    password: dsConfig?.password,
    username: dsConfig?.userid,
    url: dsConfig?.url,
    log: true,
    syncronize: false
}