FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json* .
RUN npm install --only=production

# Bundle app source
COPY . .

# Should create Makefile in the root directory
CMD [ "npm", "start" ]
