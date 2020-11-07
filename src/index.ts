#!/usr/bin/env node

/*
** API Server based on ExpressJS
** Listens on http and https port respectively
** Written in Typescript
*/

import http from 'http';
import https from 'https';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import dotEnv from 'dotenv';

import { getEnvConfig } from './lib/selector-env-config';
import { logError, logInfo } from './lib/message-logging-helper';

import app from './app';

const main = async () => {
    // load the environment variables.
    dotEnv.config();

    const folderHTTPS = process.env.FOLDER_HTTPS || path.join(__dirname, 'https');
    const config = await getEnvConfig();

    // exceptions handling
    if( !config.default.http ){
        
        // http property is not defined.
        
        const messages: string[] = [];
        messages.push(`[ERROR] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        messages.push(`Required property, 'http' is not defined in the configuration file.`);
        messages.push(`HTTP Service cannot be started.`);
        logError(messages);
        return;
    }

    if( !config.default.http.port ){
        
        // http property is not defined.
        
        const messages: string[] = [];
        messages.push(`[ERROR] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        messages.push(`Required property, 'http.port' is not defined in the configuration file.`);
        messages.push('HTTP Service cannot be started.');
        logError(messages);
        return;
    }

    if( !config.default.https ){
        
        // http property is not defined.
        
        const messages: string[] = [];
        messages.push(`[ERROR] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        messages.push(`Required property, 'https' is not defined in the configuration file.`);
        messages.push('HTTPS Service cannot be started.');
        logError(messages);
        return;
    }

    if( !config.default.https.port ){
        
        // http property is not defined.

        const messages: string[] = [];
        messages.push(`[ERROR] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        messages.push(`Required property, 'https.port' is not defined in the configuration file.`);
        messages.push('HTTPS Service cannot be started.');
        logError(messages);
        return;
    }

    if( !process.env.HTTPS_CERTIFICATE ){
        
        // HTTPS_CERTIFICATE environment parameter defined.
        
        const messages: string[] = [];
        messages.push(`[ERROR] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        messages.push(`Required environment parameter, 'HTTPS_CERTIFICATE' is not defined.`);
        messages.push('HTTPS Service cannot be started.');
        logError(messages);
        return;
    }

    if( !process.env.HTTPS_KEY ){
        
        // HTTPS_KEY environment parameter defined.
        
        const messages: string[] = [];
        messages.push(`[ERROR] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        messages.push(`Required environment parameter, 'HTTPS_KEY' is not defined.`);
        messages.push('HTTPS Service cannot be started.');
        logError(messages);
        return;
    }

    // ok.  all is well.
    
    const httpsOptions = {
        key: process.env.HTTPS_KEY ? fs.readFileSync(path.join(folderHTTPS, process.env.HTTPS_KEY)): '',
        cert: process.env.HTTPS_CERTIFICATE ? fs.readFileSync(path.join(folderHTTPS, process.env.HTTPS_CERTIFICATE)) : '',
        passphrase : process.env.PASSPHRASE
    };

    try{
        // instantiate HTTPS server

        const httpsServer = https.createServer(httpsOptions, app);
        httpsServer.listen(config.default.https.port, () => {

            const messages: string[] = [];
            messages.push(`[OK] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
            messages.push(`HTTPS service listening on port ${config.default.https.port} ...`);
            logInfo(messages);
            return;
        });
    }catch(err){
        
        // error handling 

        // invalide passphrase for secured private key
        if(err.code === 'ERR_OSSL_EVP_BAD_DECRYPT'){
            const now = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(`[ERROR] ${now}`);
            console.log(`Passphrase used for Key is invalid.`);
            console.log(`HTTPS Service fail to start.`);
            console.log(`----------`);

            const messages: string[] = [];
            console.log(`[ERROR] ${now}`);
            messages.push(`Passphrase used for Key is invalid.`);
            messages.push('HTTPS Service fail to start.');
            logError(messages);
        }    
        // exit.
        return;
    }

    // everything is ok this far.

    // instantiate http server
    const httpServer = http.createServer(app);
    httpServer.listen(config.default.http.port, () => {
        
        const messages: string[] = [];
        messages.push(`[OK] ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        messages.push(`HTTP Service listening on port ${config.default.http.port} ...`);
        logInfo(messages);
        return;
    });    
}

main();



