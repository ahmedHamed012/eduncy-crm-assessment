# Use a minimal Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port (matching NestJS config)
EXPOSE 3000

# Run database migrations before starting the app
CMD npm run migrate:latest && npm run start:dev
