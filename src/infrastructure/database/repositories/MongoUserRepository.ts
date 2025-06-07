
import { User } from '././../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { Logger } from '../../logging/Logger';
import { UserModel, UserDocument } from '../schemas/UserSchema';
import { Types } from 'mongoose';

export class MongoUserRepository implements IUserRepository {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  private mapToEntity(user: UserDocument): User {
    return new User(
      (user._id as Types.ObjectId).toString(),
      user.username,
      user.email,
      user.password,
      user.role,
      user.isActive,
      user.createdAt,
      user.updatedAt
    );
  }

  private mapToDocument(user: User): any {
    return {
      username: user.getUsername(),
      email: user.getEmail(),
      password: user.password,
      role: user.getRole(),
      isActive: user.isActive
    };
  }

  async findById(id: string): Promise<User | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const user = await UserModel.findById(id);
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      this.logger.error('Error getting user by id', { error, id });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      return user ? this.mapToEntity(user) : null;
    } catch (error) {
      this.logger.error('Error getting user by email', { error, email });
      throw error;
    }
  }

  async create(user: User): Promise<User> {
    try {
      const newUser = await UserModel.create(this.mapToDocument(user));
      return this.mapToEntity(newUser);
    } catch (error) {
      this.logger.error('Error creating user', { error });
      throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      if (!Types.ObjectId.isValid(user.getId())) {
        throw new Error(`User with ID ${user.getId()} not found`);
      }
      
      const updatedUser = await UserModel.findByIdAndUpdate(
        user.getId(),
        this.mapToDocument(user),
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        throw new Error(`User with ID ${user.getId()} not found`);
      }
      
      return this.mapToEntity(updatedUser);
    } catch (error) {
      this.logger.error('Error updating user', { error, userId: user.getId() });
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }
      
      const result = await UserModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      this.logger.error('Error deleting user', { error, id });
      throw error;
    }
  }
}
