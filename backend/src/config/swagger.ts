import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wash — Laundry Marketplace API',
      version: '1.0.0',
      description: `
## 🧺 Wash Laundry Marketplace REST API

Production-ready API for a laundry marketplace platform similar to Swiggy/Zomato.

### Features
- **Email OTP Authentication** with JWT tokens
- **Role-based Access Control** (Customer, Shop Owner, Delivery Partner, Admin)
- **Real-time Updates** via Socket.IO
- **Comprehensive Order Management** with status tracking
- **Payment Integration** (COD + Online ready)

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`
      `,
      contact: {
        name: 'Wash Team',
        email: 'support@wash.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            statusCode: { type: 'integer', example: 400 },
            message: { type: 'string', example: 'Validation error' },
            errors: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer', example: 1 },
            limit: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 50 },
            totalPages: { type: 'integer', example: 5 },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User profile & address management' },
      { name: 'Shops', description: 'Laundry shop management' },
      { name: 'Orders', description: 'Order management' },
      { name: 'Delivery', description: 'Delivery partner operations' },
      { name: 'Payments', description: 'Payment management' },
      { name: 'Notifications', description: 'Notification management' },
      { name: 'Admin', description: 'Admin dashboard & management' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
