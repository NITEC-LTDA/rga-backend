# Use a specific version for reproducibility
FROM node:18-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy all files to the working directory
COPY . .

# Generate Prisma client and run build command
RUN npx prisma generate && npm run build

# Remove dev dependencies
RUN npm install --only=production && npm cache clean --force

# Final stage for production
FROM node:18-alpine AS production

# Set Working directory for the final stage
WORKDIR /usr/src/app

# Copy necessary files from the build stage
COPY --from=build /usr/src/app .

# Set environment variable for production
ENV NODE_ENV production

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/src/main.js"]
