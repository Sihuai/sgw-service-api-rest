import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
// import morgan from 'morgan';
import cors from 'cors';
import { AppErrorUnexpected } from '../../app/errors/unexpected';

export const configAppFactory = ({ port }) => (app: Application) => {
  app.set('port', port);
  // app.use(morgan('dev'));
  // use CORS middleware 
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};

export const errorConfigAppFactory = () => (app: Application) => {
  app.use((err, req, res, next) => {
    // tslint:disable-next-line: prefer-template
    console.error('Unhandled error: ' + JSON.stringify(err), err.stack);

    if (err instanceof AppErrorUnexpected) {
      return res.status(500).json(err.json());
    }

    res.status(500).json({
      code: 'UnhandledError',
      message: 'WTF',
      details: JSON.stringify(err),
      stack: err.stack,
    });
  });
};