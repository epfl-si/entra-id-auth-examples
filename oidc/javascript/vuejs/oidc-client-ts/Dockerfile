# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy app source
COPY . .

# Expose dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev"]