import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and registration operations
 */

const router = Router();
const authController = new AuthController();

// Esquemas de validación para las rutas
const registerValidationSchema = {
  username: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 50
  },
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 100
  }
};

const loginValidationSchema = {
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    type: 'string',
    minLength: 1
  }
};

// Rutas de autenticación
router.post('/register', 
  ValidationMiddleware.validateRequest(registerValidationSchema),
  authController.register.bind(authController)
);

router.post('/login',
  ValidationMiddleware.validateRequest(loginValidationSchema),
  authController.login.bind(authController)
);

// Ruta especial para crear el usuario admin (sin autenticación requerida para el primer setup)
// POST /auth/create-admin - Create admin user (should be used only once)
router.post('/create-admin',
  authController.createAdmin.bind(authController)
);

export default router;
