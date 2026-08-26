const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const routesPath = path.resolve(__dirname, '../routes');

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

  apis: [
    path.join(routesPath, 'authRoutes.js'),
    path.join(routesPath, 'eventRoutes.js'),
    path.join(routesPath, 'registrationRoutes.js'),
    path.join(routesPath, 'announcementRoutes.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'EventPulse API Documentation',
    })
  );
};

module.exports = swaggerDocs;