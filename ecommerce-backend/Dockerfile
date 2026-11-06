FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code
COPY src/ ./src/
COPY .env .env

# Expose port
EXPOSE 3000

# Run the server
CMD ["node", "src/server.js"]