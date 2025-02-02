FROM node:16-slim

WORKDIR /app

# Instala o git
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copia os arquivos do projeto
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Expõe a porta
EXPOSE 8080

# Inicia a aplicação
CMD ["npm", "start"]
