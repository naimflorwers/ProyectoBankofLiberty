#!/bin/bash

# Script de despliegue para AWS EC2
# Ejecutar en el servidor EC2

echo "🚀 Iniciando despliegue de Bank of Liberty..."

# Variables
APP_DIR="/var/www/takin"
REPO_URL="git@github.com:naimflorwers/ProyectoBankofLiberty.git"
BRANCH="Pao"

# Crear directorio si no existe
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clonar o actualizar repositorio
if [ -d "$APP_DIR/.git" ]; then
    echo "📦 Actualizando repositorio..."
    cd $APP_DIR
    git pull origin $BRANCH
else
    echo "📦 Clonando repositorio..."
    git clone -b $BRANCH $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Ir al directorio de TakIn
cd $APP_DIR/TakIn

# Instalar dependencias
echo "📚 Instalando dependencias..."
npm install --production=false

# Construir aplicación
echo "🔨 Construyendo aplicación..."
npm run build

# Instalar PM2 si no está instalado
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    sudo npm install -g pm2
fi

# Detener aplicaciones anteriores
echo "🛑 Deteniendo aplicaciones anteriores..."
pm2 delete all || true

# Iniciar aplicaciones con PM2
echo "▶️  Iniciando aplicaciones..."
pm2 start ecosystem.config.js

# Guardar configuración de PM2
pm2 save

# Configurar PM2 para inicio automático
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Configurar Nginx
echo "🔧 Configurando Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/takin
sudo ln -sf /etc/nginx/sites-available/takin /etc/nginx/sites-enabled/takin
sudo rm -f /etc/nginx/sites-enabled/default

# Probar configuración de Nginx
sudo nginx -t

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
sudo systemctl restart nginx

# Mostrar estado
echo "✅ Estado de las aplicaciones:"
pm2 status

echo "🎉 Despliegue completado!"
echo "🌐 Tu sitio está disponible en https://penyrphf.icu"
