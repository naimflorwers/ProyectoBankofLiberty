# Instrucciones de Despliegue en AWS EC2

## Pre-requisitos en el servidor EC2

### 1. Conectarse al servidor
```bash
ssh -i tu-clave.pem ubuntu@3.147.209.153
```

### 2. Instalar Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Instalar Nginx
```bash
sudo apt update
sudo apt install -y nginx
```

### 4. Instalar Git
```bash
sudo apt install -y git
```

### 5. Configurar MySQL (si no está instalado)
```bash
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

### 6. Crear base de datos
```bash
sudo mysql -u root -p

# En MySQL:
CREATE DATABASE bank_of_liberty;
CREATE USER 'bank_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON bank_of_liberty.* TO 'bank_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 7. Importar base de datos
```bash
mysql -u bank_user -p bank_of_liberty < /ruta/a/database.sql
```

### 8. Configurar variables de entorno
```bash
cd /var/www/takin/TakIn/src/backend
nano .env
```

Contenido del archivo `.env`:
```
DB_HOST=localhost
DB_USER=bank_user
DB_PASSWORD=tu_password_seguro
DB_NAME=bank_of_liberty
DB_PORT=3306

EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password
```

### 9. Instalar certificado SSL (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d penyrphf.icu -d www.penyrphf.icu
```

## Despliegue

### Opción 1: Usando el script automático
```bash
# Copiar archivos al servidor
scp -i tu-clave.pem deploy.sh ubuntu@3.147.209.153:/home/ubuntu/
scp -i tu-clave.pem ecosystem.config.js ubuntu@3.147.209.153:/home/ubuntu/
scp -i tu-clave.pem nginx.conf ubuntu@3.147.209.153:/home/ubuntu/

# Conectarse y ejecutar
ssh -i tu-clave.pem ubuntu@3.147.209.153
chmod +x deploy.sh
./deploy.sh
```

### Opción 2: Manual
```bash
# 1. Clonar repositorio
sudo mkdir -p /var/www/takin
sudo chown -R $USER:$USER /var/www/takin
cd /var/www/takin
git clone -b Pao https://github.com/naimflorwers/ProyectoBankofLiberty.git .

# 2. Instalar dependencias y construir
cd TakIn
npm install
npm run build

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Iniciar aplicaciones
pm2 start ecosystem.config.js
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# 5. Configurar Nginx
sudo cp nginx.conf /etc/nginx/sites-available/takin
sudo ln -sf /etc/nginx/sites-available/takin /etc/nginx/sites-enabled/takin
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## Comandos útiles

### Ver logs de la aplicación
```bash
pm2 logs
pm2 logs takin-frontend
pm2 logs takin-backend
```

### Reiniciar aplicaciones
```bash
pm2 restart all
pm2 restart takin-frontend
pm2 restart takin-backend
```

### Ver estado
```bash
pm2 status
```

### Actualizar aplicación
```bash
cd /var/www/takin/TakIn
git pull origin Pao
npm install
npm run build
pm2 restart all
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/takin_access.log
sudo tail -f /var/log/nginx/takin_error.log
```

### Renovar certificado SSL
```bash
sudo certbot renew --dry-run
```

## Verificación

1. Visita https://penyrphf.icu
2. Verifica que el sitio cargue correctamente
3. Prueba la autenticación biométrica en la app móvil
4. Verifica que las APIs funcionen correctamente

## Seguridad del Servidor

### Configurar firewall
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Actualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

## Estructura en el servidor

```
/var/www/takin/
├── TakIn/
│   ├── dist/
│   │   └── TakIn/
│   │       ├── browser/        # Archivos estáticos
│   │       └── server/         # Aplicación SSR
│   ├── src/
│   │   └── backend/           # API Backend
│   ├── ecosystem.config.js    # Configuración PM2
│   └── nginx.conf            # Configuración Nginx
```

## Puertos

- **80**: HTTP (redirige a HTTPS)
- **443**: HTTPS (Nginx)
- **3000**: Backend API (interno)
- **4000**: Frontend SSR (interno)
- **3306**: MySQL (interno)
