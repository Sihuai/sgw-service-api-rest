import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import cors from 'cors';
import { getTokenFromAuthHeaders } from '../../infra/utils/security';
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

  const authenticateToken = (request, response, next) => {
    // middleware to get the access token from the header (i.e. authorization : 'Bearer TOKEN')
    const token = getTokenFromAuthHeaders(request.headers['authorization']);

    // exceptions handling
    if( token === null) return response.status(ResponseDataCode.NotAuthorized).json(ResponseFailure(ResponseDataCode.NotAuthorized, 'Not Authorized to Access.'));

    var jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) =>{
        if(error) { // exceptions handling
          if(error.name === 'JsonWebTokenError' && error.message === 'invalid token') {
            return response.status(ResponseDataCode.InvalidToken).json(ResponseFailure(ResponseDataCode.InvalidToken, 'Invalid Token.  Access Forbidden by API service.'));
          }
          return response.status(ResponseDataCode.Forbidden).json(ResponseFailure(ResponseDataCode.Forbidden, 'Access Forbidden by API servcie.'));
        }

        const { iat, exp, ...u } = decoded; 
        request.query['user'] = u;
        next();
    })
  }
};

export const errorConfigAppFactory = () => (app: Application) => {
  app.use((err, request, response, next) => {
    // tslint:disable-next-line: prefer-template
    console.error('Unhandled error: ' + JSON.stringify(err), err.stack);
    response.status(ResponseDataCode.Unexpected).json(ResponseFailure(ResponseDataCode.Unexpected, err.stack));
  });
};