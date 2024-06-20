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

# List the contents of the dist directory to verify build output
RUN ls -la /usr/src/app/dist/src/

# Final stage for production
FROM node:18-alpine AS production

# Set Working directory for the final stage
WORKDIR /usr/src/app

# Copy necessary files from the build stage
COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/prisma /usr/src/app/prisma
COPY --from=build /usr/src/app/package*.json /usr/src/app/
COPY --from=build /usr/src/app/tsconfig*.json /usr/src/app/

# List the contents of the dist directory to verify copy
RUN ls -la /usr/src/app/dist/src/

# Set environment variable for production
ENV NODE_ENV production

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm run start:prod"]
