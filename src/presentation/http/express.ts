import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import cors from 'cors';
import { ResponseFailure } from '../utils/response.data';
import { ResponseDataCode } from './constants/response.data.code';

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
  app.use((err, request, response, next) => {
    // tslint:disable-next-line: prefer-template
    console.error('Unhandled error: ' + JSON.stringify(err), err.stack);
    response.status(ResponseDataCode.Unexpected).json(ResponseFailure(ResponseDataCode.Unexpected, err.stack));
  });
};