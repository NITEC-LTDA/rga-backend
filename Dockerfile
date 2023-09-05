# Use a specific version for reproducibility
FROM node:18-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

# Build stage
FROM node:18-alpine AS build

# Create app directory
WORKDIR /usr/src/app

# Copy necessary files for build
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src
COPY startProduction.sh /usr/src/app/
COPY prisma ./prisma
# Install dependencies and generate Prisma client
RUN npm ci
RUN npx prisma generate

# Run build command to create the production bundle
RUN npm run build

# Remove dev dependencies
RUN npm ci --only=production && npm cache clean --force

# Set environment variable for production
ENV NODE_ENV production

# Final stage for production
FROM node:18-alpine AS production

# Copy necessary files from previous stages
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/startProduction.sh ./startProduction.sh

# Set environment variable for production
ENV NODE_ENV production

# Expose port
EXPOSE 3001

# Run prisma migrations
RUN npx prisma migrate deploy

# Start command
CMD ["npm", "run", "start:prod"]

