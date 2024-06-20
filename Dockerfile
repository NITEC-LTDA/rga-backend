# Use a specific version for reproducibility
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy all files to the working directory
COPY . .

# Generate Prisma client and run build command
RUN npx prisma generate && npm run build

# Set environment variable for production
ENV NODE_ENV=production

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/src/main.js"]
