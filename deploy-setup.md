# Guía de Despliegue para Producción

## Prerrequisitos antes del despliegue

### 1. MongoDB Atlas Setup
1. Crear cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crear un cluster gratuito
3. Crear un usuario de base de datos
4. Obtener la connection string
5. Agregar IP de Render.com a whitelist (0.0.0.0/0 para permitir todas)

### 2. Variables de Entorno para Render.com

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/task_management?retryWrites=true&w=majority
JWT_SECRET=super-secure-jwt-secret-change-this
JWT_EXPIRATION=24h
LOG_LEVEL=info
PORT=10000
```

### 3. Comandos para después del despliegue

1. **Crear usuario administrador:**
```bash
# En la consola de Render.com o via API
curl -X POST https://tu-app.onrender.com/api/auth/admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@tuapp.com", 
    "password": "admin123"
  }'
```

2. **Verificar que funciona:**
```bash
# Health check
curl https://tu-app.onrender.com/health

# Swagger docs
https://tu-app.onrender.com/api-docs
```

## Pasos de Despliegue en Render.com

1. Conectar tu repositorio de GitHub
2. Elegir "Web Service"
3. Configurar:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Agregar las variables de entorno listadas arriba
5. Deploy!

## Verificación Post-Despliegue

- [ ] Health check responde OK
- [ ] Swagger docs cargan correctamente
- [ ] Puedes registrar un usuario
- [ ] Puedes crear tareas
- [ ] Admin puede ver todas las tareas

## Solución de Problemas Comunes

### Error de conexión a MongoDB
- Verificar que la connection string es correcta
- Verificar que las credenciales son correctas
- Verificar whitelist de IPs en MongoDB Atlas

### Error 500 al iniciar
- Revisar logs en Render.com
- Verificar todas las variables de entorno
- Verificar que el build fue exitoso
