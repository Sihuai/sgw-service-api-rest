import cookieParser from 'cookie-parser';
import express, { Application } from 'express';
import cors from 'cors';
import { ResponseFailure } from '../utils/response.data';
import { ResponseDataCode } from './constants/response.data.code';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const configAppFactory = ({ port }) => (app: Application) => {
  app.set('port', port);
  // app.use(morgan('dev'));
  // use CORS middleware 
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  

  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for SGW',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It retrieves data from SGW.',
      license: {
        name: 'Licensed Under zulu',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'zulu',
        url: 'https://www.zulu.com',
      },
    },
    components: {
      securitySchemes: {
        apikey: {
          name: 'authorization',
          type: 'apiKey',
          in: 'header'
        }
      }
    },
    servers: [
      {
        url: 'https://localhost:' + port,
        description: 'Development server',
      },
    ],
  };

  const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['**/controller/*.ts', '**/controller/*.js'],
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/docs/v1', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export const errorConfigAppFactory = () => (app: Application) => {
  app.use((err, request, response, next) => {
    // tslint:disable-next-line: prefer-template
    console.error('Unhandled error: ' + JSON.stringify(err), err.stack);
    response.status(ResponseDataCode.Unexpected).json(ResponseFailure(ResponseDataCode.Unexpected, err.stack));
  });
};