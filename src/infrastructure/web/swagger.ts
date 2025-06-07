import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A comprehensive task management API built with Clean Architecture',
      contact: {
        name: 'API Support',
        email: 'support@taskmanagement.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api.taskmanagement.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token'
        }
      },
      schemas: {
        Task: {
          type: 'object',
          required: ['id', 'title', 'description', 'priority', 'userId', 'completed'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the task',
              example: '60f7b3b3b3b3b3b3b3b3b3b3'
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Complete project documentation'
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Write comprehensive documentation for the API'
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Task priority level',
              example: 'HIGH'
            },
            userId: {
              type: 'string',
              description: 'ID of the user who owns this task',
              example: '60f7b3b3b3b3b3b3b3b3b3b1'
            },
            completed: {
              type: 'boolean',
              description: 'Whether the task is completed',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task last update timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Task completion timestamp',
              example: '2024-01-15T15:45:00Z'
            }
          }
        },
        User: {
          type: 'object',
          required: ['id', 'username', 'email', 'role'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the user',
              example: '60f7b3b3b3b3b3b3b3b3b3b1'
            },
            username: {
              type: 'string',
              description: 'Username',
              example: 'johndoe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
              example: 'user'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user account is active',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title', 'description', 'completed'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Complete project documentation'
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Write comprehensive documentation for the API'
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Task priority level',
              example: 'HIGH'
            },
            completed: {
              type: 'boolean',
              description: 'Whether the task is completed',
              example: false
            }
          }
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Updated task title'
            },
            description: {
              type: 'string',
              description: 'Task description',
              example: 'Updated task description'
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Task priority level',
              example: 'MEDIUM'
            },
            completed: {
              type: 'boolean',
              description: 'Whether the task is completed',
              example: true
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            username: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              description: 'Username',
              example: 'johndoe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              maxLength: 100,
              description: 'User password',
              example: 'securePassword123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'securePassword123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
              example: '60f7b3b3b3b3b3b3b3b3b3b1'
            },
            username: {
              type: 'string',
              description: 'Username',
              example: 'johndoe'
            },
            email: {
              type: 'string',
              description: 'User email',
              example: 'john.doe@example.com'
            },
            token: {
              type: 'string',
              description: 'JWT authentication token',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Login successful'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful',
              example: true
            },
            message: {
              type: 'string',
              description: 'Response message',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the operation was successful',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message',
                  example: 'An error occurred'
                },
                code: {
                  type: 'string',
                  description: 'Error code',
                  example: 'VALIDATION_ERROR'
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/infrastructure/web/routes/*.ts',
    './src/infrastructure/web/controllers/*.ts'
  ]
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Task Management API Documentation'
  }));
};

export { specs };
