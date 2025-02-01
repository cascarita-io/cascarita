FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json from the root
COPY ./server/package.json ./server/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./server .

EXPOSE 3000