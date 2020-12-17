const debug = require('debug')('express:server');

import https from 'https';
import { Application } from 'express';
import { Container } from 'inversify';
import { logError } from '../../infra/utils/logger';
import { configAppFactory, errorConfigAppFactory } from './express';

export class ApplicationServer {
  private port: any;
  private isHttps: boolean;
  private httpsOptions: any;
  app: Application;
  container: Container;

  constructor({
    createHttpServer,
    port,
    isHttps,
    httpsOptions,
    container,
  }) {
    this.container = container;
    this.port = port;
    this.isHttps = isHttps;
    this.httpsOptions = httpsOptions;
    const config = configAppFactory({ port: this.port });
    const errorConfig = errorConfigAppFactory();

    this.app = createHttpServer()
      .setConfig(config)
      .setErrorConfig(errorConfig)
      .build();
  }

  listen() {
    if (this.isHttps == true){
      const httpsServer = https.createServer(this.httpsOptions, this.app);
      httpsServer.listen(this.port);
    } else {
      this.app.listen(this.port);
    }
    
    console.log((this.isHttps == true ? `HTTPS` : `HTTP`) + ` Service listening on port ${this.port} ...`);

    this.app.on('error', this.onError);
    this.app.on('listening', this.onListening);
  }

  private onError = (error) => {
    if (error.syscall !== 'listen') throw error;

    const bind = typeof this.port === 'string'
      ? `Pipe ${this.port}`
      : `Port ${this.port}`;

    // handle specific listen errors with friendly messages
    const messages: string[] = [];
    switch (error.code) {
      case 'EACCES':
        messages.push(`${bind} requires elevated privileges`);
        logError(messages);
        process.exit(1);
      case 'EADDRINUSE':
        messages.push(`${bind} is already in use`);
        logError(messages);
        process.exit(1);
      case 'ERR_OSSL_EVP_BAD_DECRYPT':
        messages.push(`${bind} passphrase used for Key is invalid.`);
        messages.push('HTTPS Service fail to start.');
        logError(messages);
        process.exit(1);
      default:
        throw error;
    }
  }

  private onListening = () => {
    debug((this.isHttps == true ? `HTTPS` : `HTTP`) + ` Service listening on port ${this.port} ...`);
  }
}