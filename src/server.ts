#!/usr/bin/env node

import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { createContainer } from './config/container';
import { ApplicationServer } from './presentation/http/server';
import moment from 'moment';
import { logError } from './infra/utils/logger';
import { getEnvConfig } from './config/env.config';
import path from 'path';
import fs from 'fs';
import dotEnv from 'dotenv';
import { isEmptyObject } from './infra/utils/data.validator';

export const createApplicationServer = async () => {
  // load the environment variables.
  dotEnv.config();

  const container = await createContainer();

  const folderHTTPS = process.env.FOLDER_HTTPS || path.join(__dirname, 'https');
  const config = await getEnvConfig();

  // exceptions handling
  if( !config.default.http ){
      // http property is not defined.
      const messages: string[] = [];
      messages.push(`[ERROR] ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`);
      messages.push(`Required property, 'http' is not defined in the configuration file.`);
      messages.push(`HTTP Service cannot be started.`);
      logError(messages);
      return null;
  }

  if( !config.default.http.port ){
      // http property is not defined.
      const messages: string[] = [];
      messages.push(`[ERROR] ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`);
      messages.push(`Required property, 'http.port' is not defined in the configuration file.`);
      messages.push('HTTP Service cannot be started.');
      logError(messages);
      return null;
  }

  if( !config.default.https ){
      // http property is not defined.
      const messages: string[] = [];
      messages.push(`[ERROR] ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`);
      messages.push(`Required property, 'https' is not defined in the configuration file.`);
      messages.push('HTTPS Service cannot be started.');
      logError(messages);
      return null;
  }

  if( !config.default.https.port ){
      // http property is not defined.
      const messages: string[] = [];
      messages.push(`[ERROR] ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`);
      messages.push(`Required property, 'https.port' is not defined in the configuration file.`);
      messages.push('HTTPS Service cannot be started.');
      logError(messages);
      return null;
  }

  if( !process.env.HTTPS_CERTIFICATE ){
      // HTTPS_CERTIFICATE environment parameter defined.
      const messages: string[] = [];
      messages.push(`[ERROR] ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`);
      messages.push(`Required environment parameter, 'HTTPS_CERTIFICATE' is not defined.`);
      messages.push('HTTPS Service cannot be started.');
      logError(messages);
      return null;
  }

  if( !process.env.HTTPS_KEY ){
      // HTTPS_KEY environment parameter defined.
      const messages: string[] = [];
      messages.push(`[ERROR] ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`);
      messages.push(`Required environment parameter, 'HTTPS_KEY' is not defined.`);
      messages.push('HTTPS Service cannot be started.');
      logError(messages);
      return null;
  }

  var httpsOptions;
  if (isEmptyObject(process.env.HTTPS_CA) === true) {
    httpsOptions = {
      key: process.env.HTTPS_KEY ? fs.readFileSync(path.join(folderHTTPS, process.env.HTTPS_KEY)): '',
      cert: process.env.HTTPS_CERTIFICATE ? fs.readFileSync(path.join(folderHTTPS, process.env.HTTPS_CERTIFICATE)) : '',
      passphrase : process.env.PASSPHRASE
    };
  } else {
    httpsOptions = {
      key: process.env.HTTPS_KEY ? fs.readFileSync(path.join(folderHTTPS, process.env.HTTPS_KEY)): '',
      cert: process.env.HTTPS_CERTIFICATE ? fs.readFileSync(path.join(folderHTTPS, process.env.HTTPS_CERTIFICATE)) : '',
      ca : fs.readFileSync(path.join(folderHTTPS, (process.env.HTTPS_CA as string)))
    };
  }

  return new ApplicationServer({
    port: config.default.https.port,
    isHttps: true,
    httpsOptions: httpsOptions,
    createHttpServer: () => new InversifyExpressServer(container),
    // tslint:disable-next-line: object-shorthand-properties-first
    container,
  });
};
