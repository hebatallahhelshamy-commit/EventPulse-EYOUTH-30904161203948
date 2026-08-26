const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API',
      version: '1.0.0',
      description: 'API Documentation for EventPulse Management Platform',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://event-pulse-eyouth-30904161203948.vercel.app'
            : 'http://localhost:3000',
      },
    ],
  },

  // استخدام مسار مطلق بدل المسار النسبي
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;