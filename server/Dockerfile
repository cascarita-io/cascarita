FROM node:23-alpine

WORKDIR /app

# Copy the rest of the application files
COPY ./server/ .

RUN rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install

RUN npm install --os=linux --libc=musl --cpu=arm64 sharp

EXPOSE 3000

CMD ["npm", "run", "server"]
