// import { getDataStoreConfiguration } from '../config/data-stores';
// import { logError } from '../lib/message-logging-helper';
// import { Database } from 'arangojs';
// import moment from 'moment';

// import { AQLSpecialVariableKeys } from '../enums/aql';

// // // enum declarations
// // export enum AQLSpecialVariableKeys {
// //     NEW = 'NEW',
// //     OLD = 'OLD',
// //     CURRENT = 'CURRENT'
// // }

// // Type declarations
// type TypeAQLClauses = {
//     for: string;
//     in: string;
//     filter? : string;
//     sort? : string;
//     limit ?: {
//         offset : number;
//         count : number;
//     };
//     return : string;
// }

// type TypeInsertAQLClauses = {
//     insert: any;
//     into: string;
//     return: string;
// }

// type TypeRemoveAQLClauses = {
//     remove: {
//         _key : string;
//         _rev?: string;
//         _id? : string;
//     };
//     in: string;
//     return: string;
// }

// type TypeUpdateAQLClauses = {
//     update: {
//         _key : string;
//         _rev?: string;
//         _id? : string;
//     };
//     with: any;
//     in: string;
//     return: string;
// }

// type TypeDataStoreConfig = {
//     name : string;
//     type : string;
//     application : string;
//     url : string;
//     userid : string;
//     password : string;
//     dbName : string;
// }



// // private functions
// const isValidJSON = (jsonString : string) => {
//     try{
//         JSON.parse(jsonString);
//         return true;
//     }catch(err){
//         return false;
//     }
// }

// export const connectToDataStore = async (env: string, options: TypeDataStoreConfig ) => {
//     const url = options.url || process.env.DS_DEFAULT_URL || 'http://localhost:8529';
    

//     // authenticate with the arangodb
//     try{
//         const db = new Database({url: url, databaseName: options.dbName});
//         const authenticated = await db.login(options.userid, options.password);
//         // const connected = await db.useDatabase(options.dbName);
//         // const connected = await db.database(options.dbName);
        
//         return db;

//     }catch(err){
//         console.log(JSON.stringify(err));
//         throw err;
//     }
// }

// // exported functions
// export const getDataStore = async (env: string, configurationName: string) => {
    
//     const DS_CONFIG_NAME = configurationName || '';
//     const ENV = env || 'development';
    
//     // exceptions handling
    
//     // ok.  
//     const dsConfig = getDataStoreConfiguration(ENV, DS_CONFIG_NAME);
    
//     if(dsConfig){
//         // dsConfig is defined
//         try{
//             return await connectToDataStore(ENV, dsConfig);        
//         }catch(err){
            
//             // fail to connect to the arangodb data store
            
//             const messages: string[] = [];
//             messages.push(`${moment().format('YYYY-MM-DD HH:mm:ss')}`);
//             messages.push(`Data Store -> ${JSON.stringify(dsConfig)}`);
//             messages.push('Fail to connect to the specified ArangoDB Data Store.');
//             logError(messages);

//             throw err;
//         }
        
//     }
// };

// export const getList = async (aql: TypeAQLClauses, dataStore: any) => {
//     try{
//         const aqlCode = buildAQL(aql);
//         const outcome = await getCount(aql, dataStore);

//         const cursor = await dataStore.query(aqlCode);
//         const result = await cursor.all();
        
//         const recordsPerPage = aql.limit?.count ? aql.limit.count : -1;
        
//         const pageNumber = (aql.limit != undefined && aql.limit.offset >= 0 && recordsPerPage > 0) ? (aql.limit.offset / recordsPerPage) + 1 : -1;
//         const pages = (recordsPerPage > 0 && pageNumber > 0) ? Math.ceil(outcome.count / recordsPerPage) : -1

//         return {
//             ok: true,
//             list: result,
//             counters : {
//                 records : {
//                     all : outcome.count,
//                     inPage : result.length
//                 }
//             },
//             paging: {
//                 pages : pages,
//                 inPageNumber : pageNumber,
//                 recordsPerPage : recordsPerPage
//             }
//         };
//     }catch(err){
//         throw err;
//     }
// }

// export const addItem = async (aql: TypeInsertAQLClauses, dataStore: any) => {
//     try{
//         const aqlCode = buildInsertAQL(aql);
//         const cursor = await dataStore.query(aqlCode);
//         const result = await cursor.all();
        
//         return result;

//     }catch(err){
//         throw err;
//     }
// }

// export const removeItem = async (aql: TypeRemoveAQLClauses, dataStore: any) => {
//     try{
//         const aqlCode = buildRemoveAQL(aql);
//         const cursor = await dataStore.query(aqlCode);
//         const result = await cursor.all();

//         return result;

//     }catch(err){
//         throw err;
//     }
// }

// export const updateItem = async (aql: TypeUpdateAQLClauses, dataStore: any) => {

//     // function to update an item
//     try{

//         const aqlCode = '';
//         const cursor = await dataStore.query(aqlCode);
//         const result = await cursor.all();

//         return result;

//     }catch(err){
//         throw err;
//     }
// }

// export const executeScript = async (aql: string, dataStore: any) => {

//     // function to execute an AQL script
//     try{
//         const cursor = await dataStore.query(aql);
//         const result = await cursor.all();
//         return result;
//     }catch(err){
//         throw err;
//     }
// }


// export const buildAQL = (aql: TypeAQLClauses) => {

//     /*
//     ** function to build the required aql
//     ** for execution.
//     */
    
//     const aqlClauses: Array<string> = [];
    
//     // checks
//     aqlClauses.push(`FOR ${aql.for} IN ${aql.in}`);

//     if( aql.filter ){
//         // filter clause is set
//         aqlClauses.push(`FILTER ( ${aql.filter} )`);
//     }

//     if( aql.sort ){
//         // sort clause is set
//         aqlClauses.push(`SORT ${aql.sort}`)
//     }

//     if( aql.limit){
//         // limit clause is set
//         aqlClauses.push(`LIMIT ${aql.limit.offset}, ${aql.limit.count}`);
//     }

//     if( aql.return.trim().startsWith('{') && aql.return.trim().endsWith('}') ){
        
//         if(isValidJSON(aql.return.trim())){
//             // valid JSON string is set
//             aqlClauses.push(`RETURN aql.return`);
//         }
//     }

//     // not a JSON string
//     if( aql.return.trim().length === 0){
//         // empty return clause
//         aqlClauses.push(`RETURN ${aql.for.trim()}`);
//     }
    
//     // return clause (non-JSON) is set
//     aqlClauses.push(`RETURN ${aql.return.trim()}`);
    
//     const aqlCode = aqlClauses.join("\n");
//     return aqlCode; 
// }

// export const buildCountAQL = (aql: TypeAQLClauses, ignoreFilterClause: boolean) => {

//     /*
//     ** function to build the aql code for 
//     ** counting the data points
//     ** that match the filter (if any)
//     */
//     // build the aql code for getting the count
//     const aqlClauses: Array<string> = [];

//     aqlClauses.push(`FOR ${aql.for} IN ${aql.in}`);
    
//     if( aql.filter && !ignoreFilterClause ){
//         // filter clause is set
//         aqlClauses.push(`FILTER ${aql.filter}`);
//     }
    
//     aqlClauses.push(`COLLECT WITH COUNT INTO length`);
//     aqlClauses.push(`RETURN length`);
    
//     const aqlCode = aqlClauses.join('\n');
//     return aqlCode;

// }

// export const buildInsertAQL = (aql: TypeInsertAQLClauses) => {

//     const aqlClauses: Array<string> = [];

//     aqlClauses.push(`INSERT ${JSON.stringify(aql.insert)}`);
//     aqlClauses.push(`INTO ${aql.into}`);
//     aqlClauses.push(`RETURN ${aql.return}`);

//     const aqlCode = aqlClauses.join('\n');
//     return aqlCode;
// }

// export const getCount = async (aql: TypeAQLClauses, dataStore: Database) => {

//     /*
//     ** function to get the data points count
//     ** that is returned by the aql (ignoring the paging clause, if any)
//     */
    
//     try{
//         const aqlCode = buildCountAQL(aql, false);
//         const cursor = await dataStore.query(aqlCode);
//         const result = await cursor.all();
    
//         return {
//             ok: true,
//             count: result[0]
//         }
//     }catch(err){
//         throw err;
//     }
    

// }

// export const parseFilter = (filter$: string[]) => {

//     // function to format the filter string
//     const mapped = filter$.map((element) => {
//         return `i.${element}`;
//     })

//     return mapped.join('');
// }

// export const buildRemoveAQL = (aql: TypeRemoveAQLClauses) => {

//     // function to build the remove item aql.
//     const aqlClauses: Array<string> = [];

//     aqlClauses.push(`REMOVE ${JSON.stringify(aql.remove)}`);
//     aqlClauses.push(`IN ${aql.in}`);
//     aqlClauses.push(`RETURN ${aql.return}`);

//     const aqlCode = aqlClauses.join('\n');
//     return aqlCode;

// }

// const buildUpdateAQL = (aql: TypeUpdateAQLClauses) => {

//     // function to build the UPDATE aql
//     const aqlClauses : Array<string> = [];

//     aqlClauses.push(`UPDATE ${JSON.stringify(aql.update)}`);
//     aqlClauses.push(`WITH ${JSON.stringify(aql.with)}`);
//     aqlClauses.push(`IN ${aql.in}`);
//     aqlClauses.push(`RETURN ${aql.return}`);

//     const aqlCode = aqlClauses.join(' ');
//     return aqlCode;
// }