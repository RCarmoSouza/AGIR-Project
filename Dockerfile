# Dockerfile simples para desenvolvimento
FROM node:22-alpine
 
# Definir diretório de trabalho
WORKDIR /app
 
# Copiar arquivos de dependências
COPY package*.json ./
 
# Instalar dependências
RUN npm install
 

# Copiar código fonte
COPY . .
 
# Expor porta 8080
EXPOSE 8080
 
# Comando para iniciar em modo desenvolvimento
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "8080"]
 