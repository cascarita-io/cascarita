FROM node:23-alpine

WORKDIR /app

# Copy the rest of the application files
COPY ./server .

RUN rm -rf node_modules
RUN rm -f package-lock.json

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "server"]
