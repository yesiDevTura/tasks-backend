import bcrypt from "bcryptjs";

export class User {
  readonly id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    password: string,
    role: string = 'user',
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static async create(username: string, email: string, password: string, role: string = 'user'): Promise<User> {
    if (!username || !email || !password) {
      throw new Error("Username, email and password are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // MongoDB will generate the ID when saved
    return new User(
      "",
      username,
      email.toLowerCase(),
      hashedPassword,
      role
    );
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public getId(): string {
    return this.id;
  }

  public getEmail(): string {
    return this.email;
  }

  public getUsername(): string {
    return this.username;
  }

  public getRole(): string {
    return this.role;
  }

  public isAdmin(): boolean {
    return this.role === 'admin';
  }

  public toJSON(): any {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}