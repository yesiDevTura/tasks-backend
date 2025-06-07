import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { InvalidCredentialsException } from '../../domain/exceptions/InvalidCredentialsException';
import { LoginUserDTO, LoginUserResponseDTO } from '../dto/LoginUserDTO';
import { AuthService } from '../../infrastructure/auth/AuthService';
import { ValidationUtils } from '../../shared/utils/ValidationUtils';

@injectable()
export class LoginUserUseCase {  constructor(
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) {}

  async execute(loginData: LoginUserDTO): Promise<LoginUserResponseDTO> {
    // Validar datos de entrada
    this.validateInput(loginData);

    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Validar contraseña
    const isValidPassword = await user.validatePassword(loginData.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    // Generar token
    const token = AuthService.generateToken(user);

    return {
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail(),
      token,
      message: 'Login successful'
    };
  }

  private validateInput(loginData: LoginUserDTO): void {
    if (!ValidationUtils.isValidEmail(loginData.email)) {
      throw new Error('Invalid email format');
    }

    if (!loginData.password || loginData.password.trim().length === 0) {
      throw new Error('Password is required');
    }
  }
}
