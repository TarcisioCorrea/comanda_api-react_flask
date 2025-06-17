# Usa a imagem oficial do Nginx
FROM nginx:alpine
# Define metadados da imagem (boas práticas para Podman/Docker)
LABEL maintainer="Tarcisio Correa <tarcisiosicorrea@gmail.com>"
LABEL description="Comandas - Frontend React + Vite, nginx"
LABEL version="1.0.0"
# Remove a configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copia os arquivos do build (dist) para o diretório padrão do Nginx
COPY dist/ /usr/share/nginx/html
# (Opcional) Copia um nginx.conf customizado, se você tiver
# COPY nginx.conf /etc/nginx/nginx.conf
# Expõe a porta 80
EXPOSE 80
# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]