# Use a specific version for reproducibility
FROM node:18-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy all files to the working directory
COPY . .

# Build stage
FROM node:18-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Copy necessary files for build
COPY --from=development /usr/src/app/package*.json ./
COPY --from=development /usr/src/app/tsconfig*.json ./
COPY --from=development /usr/src/app/src ./src
COPY --from=development /usr/src/app/startProduction.sh ./
COPY --from=development /usr/src/app/prisma ./prisma

# Install dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate

# Run build command to create the production bundle
RUN npm run build

# Remove dev dependencies
RUN npm install --only=production && npm cache clean --force

# Final stage for production
FROM node:18-alpine AS production

# Set Working directory for the final stage
WORKDIR /usr/src/app

# Copy necessary files from previous stages
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist/src/
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/startProduction.sh ./startProduction.sh
COPY --from=development /usr/src/app/package*.json ./
COPY --from=development /usr/src/app/tsconfig*.json ./

# Ensure the startProduction.sh script is executable
RUN chmod +x startProduction.sh

# Debugging steps: List directory contents
RUN ls -la /usr/src/app

# Set environment variable for production
ENV NODE_ENV production

# Expose port
EXPOSE 3001

# Run the startProduction.sh script
CMD ["sh", "./startProduction.sh"]
