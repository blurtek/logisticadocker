FROM nginx:alpine

# Copiar configuración
COPY nginx.conf /etc/nginx/nginx.conf

# Crear directorios necesarios
RUN mkdir -p /var/log/nginx /etc/nginx/ssl

# Exponer puertos
EXPOSE 80 443

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]
