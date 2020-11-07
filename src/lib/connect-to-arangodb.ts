import { getDataStore } from './arangodb-helper';
import dotenv from 'dotenv';

dotenv.config();

const DS_APP_CONFIG_NAME = process.env.DS_APP_CONFIG_NAME || '';
const ENV = process.env.NODE_ENV || 'development';

let ds: any = {};

getDataStore(ENV, DS_APP_CONFIG_NAME)
.then((db) => {
    return ds.app = db;
})

export default ds;