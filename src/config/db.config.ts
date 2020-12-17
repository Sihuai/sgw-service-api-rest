type TypeDataStoreConfig = {
    name : string;
    type : string;
    application : string;
    url : string;
    userid : string;
    password: string;
    dbName : string;
}

const configDataStores = {
    development : [
        {
            name: 'api-security',
            type: 'arangodb',
            application: 'security',
            url: 'http://api.zulundatumsolutions.net:8529',
            userid: 'zulu',
            password: 'Zu1u.12345',
            dbName : 'TianGong'
        },
        {
            name: 'api-sgw',
            type: 'arangodb',
            application: 'webapp',
            url: 'http://api.zulundatumsolutions.net:8529',
            userid: 'zulu',
            password: 'Zu1u.12345',
            dbName : 'SGWMock'
        }
    ],
    stage : [
        {
            name: 'api-security',
            type: 'arangodb',
            application: 'security',
            url: 'http://api.zulundatumsolutions.net:8529',
            userid: 'zulu-stg',
            password: 'Zu1u-St@g3',
            dbName : 'TianGong-stg'
        },
        {
            name: 'api-pms',
            type: 'arangodb',
            application: 'webapp',
            url: 'http://api.zulundatumsolutions.net:8529',
            userid: 'zulu-stg',
            password: 'Zu1u-St@g3',
            dbName : 'JAS-stg'
        }
    ],
    production : [
        {
            name: 'api-security',
            type: 'arangodb',
            url: 'http://api.zulundatumsolutions.net:8529',
            userid: 'zulu-prd',
            password: 'Zu1u-Pr6',
            dbName : 'TianGong-prd'
        },
        {
            name: 'api-pms',
            type: 'arangodb',
            url: 'http://api.zulundatumsolutions.net:8529',
            userid: 'zulu-prd',
            password: 'Zu1u-Pr6',
            dbName : 'JAS-prd'
        }
    ]    
}

export const getDataStoreConfiguration = (env: string, name: string) => {
    
    // function to retrieve a specific dataStore configuration
    const found : TypeDataStoreConfig| undefined = configDataStores[env].find((config : TypeDataStoreConfig) => {
        if( config.name === name.trim()){
            return config;
        }
    });

    return found;
}