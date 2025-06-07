import 'reflect-metadata';
import { container } from 'tsyringe';
import { MongoDatabase } from '../infrastructure/database/MongoDatabase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { MongoUserRepository } from '../infrastructure/database/repositories/MongoUserRepository';
import { User } from '../domain/entities/User';
import { Logger } from '../infrastructure/logging/Logger';

// Configurar dependencias
container.register<IUserRepository>('UserRepository', {
  useClass: MongoUserRepository
});

async function createAdminUser() {
  const logger = Logger.getInstance();
  
  try {
    // Conectar a la base de datos
    await MongoDatabase.getInstance();
    
    const userRepository = container.resolve<IUserRepository>('UserRepository');
    
    // Verificar si ya existe un admin
    const existingAdmin = await userRepository.findByEmail('admin@system.com');
    
    if (existingAdmin) {
      logger.info('Admin user already exists');
      return;
    }
    
    // Crear usuario admin
    const adminUser = await User.create(
      'Administrator',
      'admin@system.com',
      'admin123',
      'admin'
    );
      // Guardar en la base de datos
    const savedAdmin = await userRepository.create(adminUser);
    
    logger.info('Admin user created successfully', {
      id: savedAdmin.getId(),
      email: savedAdmin.getEmail(),
      role: savedAdmin.getRole()
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@system.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error creating admin user', { error });
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Ejecutar solo si este archivo es llamado directamente
if (require.main === module) {
  createAdminUser();
}

export default createAdminUser;
