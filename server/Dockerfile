FROM node:23-alpine

WORKDIR /app

# Copy package.json and package-lock.json from the root
COPY ./server/package.json ./server/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./server .

RUN npm install --os=linux --libc=musl --cpu=arm64 sharp

EXPOSE 3000

CMD ["npm", "run", "server"]
