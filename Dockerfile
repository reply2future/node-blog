FROM --platform=linux/amd64 node:16.13.0-alpine3.12

WORKDIR /usr/src/app

COPY package*.json ./

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000 

CMD [ "node", "bin/www.js" ]