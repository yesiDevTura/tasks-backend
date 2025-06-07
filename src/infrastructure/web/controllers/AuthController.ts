import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { RegisterUserUseCase } from '../../../application/use-cases/RegisterUserUseCase';
import { CreateAdminUseCase } from '../../../application/use-cases/CreateAdminUseCase';
import { LoginUserUseCase } from '../../../application/use-cases/LoginUserUseCase';
import { RegisterUserDTO } from '../../../application/dto/RegisterUserDTO';
import { LoginUserDTO } from '../../../application/dto/LoginUserDTO';
import { Logger } from '../../logging/Logger';
import { UserAlreadyExistsException } from '../../../domain/exceptions/UserAlreadyExistsException';
import { InvalidCredentialsException } from '../../../domain/exceptions/InvalidCredentialsException';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class AuthController {
  private readonly logger = Logger.getInstance();
  
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     description: Creates a new user account with the provided credentials
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/AuthResponse'
   *                 message:
   *                   type: string
   *                   example: User registered successfully
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       409:
   *         description: User already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const registerData: RegisterUserDTO = req.body;
      
      const registerUseCase = container.resolve<RegisterUserUseCase>('RegisterUserUseCase');
      const result = await registerUseCase.execute(registerData);

      this.logger.info('User registered successfully', { userId: result.id, email: result.email });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.id,
            username: result.username,
            email: result.email
          },
          token: result.token
        },
        message: result.message
      });
    } catch (error) {
      this.handleAuthError(error, res, 'registration');    }
  }
  
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: User login
   *     description: Authenticates a user with email and password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/AuthResponse'
   *                 message:
   *                   type: string
   *                   example: Login successful
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginUserDTO = req.body;
      
      const loginUseCase = container.resolve<LoginUserUseCase>('LoginUserUseCase');
      const result = await loginUseCase.execute(loginData);

      this.logger.info('User logged in successfully', { userId: result.id, email: result.email });

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: result.id,
            username: result.username,
            email: result.email
          },
          token: result.token
        },
        message: result.message
      });
    } catch (error) {
      this.handleAuthError(error, res, 'login');    }
  }  
  
  /**
   * @swagger
   * /api/auth/create-admin:
   *   post:
   *     summary: Create admin user
   *     description: Creates an admin user account. This endpoint should only be used for initial setup.
   *     tags: [Authentication]
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: Administrator
   *                 description: Admin username (optional, defaults to 'Administrator')
   *               email:
   *                 type: string
   *                 format: email
   *                 example: admin@system.com
   *                 description: Admin email (optional, defaults to 'admin@system.com')
   *               password:
   *                 type: string
   *                 example: admin123
   *                 description: Admin password (optional, defaults to 'admin123')
   *     responses:
   *       201:
   *         description: Admin user created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Admin user created successfully
   *                 data:
   *                   $ref: '#/components/schemas/AuthResponse'
   *                 credentials:
   *                   type: object
   *                   properties:
   *                     email:
   *                       type: string
   *                       example: admin@system.com
   *                     password:
   *                       type: string
   *                       example: admin123
   *                     note:
   *                       type: string
   *                       example: Use these credentials to login as admin
   *       409:
   *         description: Admin user already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createAdminUseCase = container.resolve(CreateAdminUseCase);
      const userRepository = container.resolve<IUserRepository>('UserRepository');
        // Usar datos del body si se proporcionan, sino usar datos predefinidos
      const adminData: RegisterUserDTO = req.body && Object.keys(req.body).length > 0 ? {
        username: req.body.username ?? 'Administrator',
        email: req.body.email ?? 'admin@system.com',
        password: req.body.password ?? 'admin123'
      } : {
        username: 'Administrator',
        email: 'admin@system.com',
        password: 'admin123'
      };

      // Verificar si ya existe un admin con este email
      const existingAdmin = await userRepository.findByEmail(adminData.email);
      if (existingAdmin) {
        res.status(409).json({
          success: false,
          error: {
            message: `Admin user with email ${adminData.email} already exists`,
            code: 'ADMIN_EXISTS'
          }
        });
        return;
      }

      const adminUser = await createAdminUseCase.execute(adminData);
        res.status(201).json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          token: adminUser.token
        },
        credentials: {
          email: adminData.email,
          password: adminData.password,
          note: 'Use these credentials to login as admin'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  private handleAuthError(error: any, res: Response, operation: string): void {
    this.logger.error(`Authentication ${operation} failed`, { error: error.message });

    if (error instanceof UserAlreadyExistsException) {
      res.status(409).json({
        success: false,
        error: {
          message: error.message,
          code: 'USER_ALREADY_EXISTS'
        }
      });
      return;
    }

    if (error instanceof InvalidCredentialsException) {
      res.status(401).json({
        success: false,
        error: {
          message: error.message,
          code: 'INVALID_CREDENTIALS'
        }
      });
      return;
    }

    // Errores de validación
    if (error.message.includes('must be at least') || 
        error.message.includes('Invalid email') || 
        error.message.includes('Password must contain') ||
        error.message.includes('is required')) {
      res.status(400).json({
        success: false,
        error: {
          message: error.message,
          code: 'VALIDATION_ERROR'
        }
      });
      return;
    }

    // Error genérico del servidor
    res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    });
  }
}
