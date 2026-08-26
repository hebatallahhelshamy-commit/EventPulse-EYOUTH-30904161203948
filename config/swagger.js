const swaggerJsdoc = require('swagger-jsdoc');
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
  // OpenAPI JSON
  app.get('/api-docs.json', (req, res) => {
    res.json(swaggerSpec);
  });

  // Swagger UI
  app.get('/api-docs', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>EventPulse API Documentation</title>

        <link
          rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
        />
      </head>

      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>

        <script>
          window.onload = function () {
            SwaggerUIBundle({
              url: '/api-docs.json',
              dom_id: '#swagger-ui',
              deepLinking: true
            });
          };
        </script>
      </body>
      </html>
    `);
  });
};

module.exports = swaggerDocs;