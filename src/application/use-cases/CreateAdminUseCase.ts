import { inject, injectable } from 'tsyringe';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserAlreadyExistsException } from '../../domain/exceptions/UserAlreadyExistsException';
import { RegisterUserDTO, RegisterUserResponseDTO } from '../dto/RegisterUserDTO';
import { AuthService } from '../../infrastructure/auth/AuthService';
import { ValidationUtils } from '../../shared/utils/ValidationUtils';

@injectable()
export class CreateAdminUseCase {
  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) {}

  async execute(registerData: RegisterUserDTO): Promise<RegisterUserResponseDTO> {
    // Validar datos de entrada
    this.validateInput(registerData);

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(registerData.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(registerData.email);
    }

    // Crear el nuevo usuario con rol admin
    const newUser = await User.create(
      registerData.username,
      registerData.email,
      registerData.password,
      'admin' // Rol específico para admin
    );

    // Guardar en la base de datos
    const savedUser = await this.userRepository.create(newUser);

    // Generar token
    const token = AuthService.generateToken(savedUser);

    return {
      id: savedUser.getId(),
      username: savedUser.getUsername(),
      email: savedUser.getEmail(),
      token,
      message: 'Admin user created successfully'
    };
  }
  private validateInput(registerData: RegisterUserDTO): void {
    if (!registerData.username || registerData.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!ValidationUtils.isValidEmail(registerData.email)) {
      throw new Error('Invalid email format');
    }

    if (!registerData.password || registerData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Para usuarios admin, permitimos contraseñas más flexibles
    // Solo validamos que tenga al menos 6 caracteres
  }
}
