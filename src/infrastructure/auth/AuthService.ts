import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

  public static generateToken(user: User): string {
    const payload = {
      userId: user.getId(),
      email: user.getEmail(),
      role: user.getRole()
    };
    
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '24h' });
  }

  public static verifyToken(token: string): any {
    return jwt.verify(token, this.JWT_SECRET);
  }
}