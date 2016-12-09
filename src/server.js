'use strict';

import express from 'express';
import SwaggerTools from 'swagger-tools';
import cors from 'cors';
import JsonRefs from 'json-refs';

// Swagger documentation
import SwaggerDoc from './swagger/index.json';
import ErrorMiddleware from './middlewares/error';
import LoggerMiddleware from './middlewares/logger';


// Options configuration
const PORT = process.env.port || 3000;
const controllersOpts = {
  'controllers': `${__dirname}/controllers`
};

// App creation
const app = express();

// Middleware for express
app.use(ErrorMiddleware);
app.use(LoggerMiddleware);

// Swagger conf
JsonRefs.resolveRefs(SwaggerDoc)
    .then(swaggerDoc => {
      SwaggerTools.initializeMiddleware(swaggerDoc.resolved, Middlerwares => {
        app.use(cors());
        app.use(Middlerwares.swaggerMetadata());
        app.use(Middlerwares.swaggerValidator());
        app.use(Middlerwares.swaggerUi());
        app.use(Middlerwares.swaggerRouter(controllersOpts));
      });
    });

app.listen(PORT, () => console.log(`Listenning to ${PORT}`));
