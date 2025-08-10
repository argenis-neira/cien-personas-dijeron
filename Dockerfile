# Usa una imagen base de Nginx
FROM nginx:alpine

# Copia los archivos construidos en el directorio de Nginx
COPY ./build /usr/share/nginx/html

# Copia una configuración de Nginx que escuche en el puerto 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto en el que Nginx está corriendo
EXPOSE 8080

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
