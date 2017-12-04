FROM node:8-alpine

# Create app directory
WORKDIR /usr/src/app

# Install make
RUN apk add --no-cache make

# Install app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

# Should create Makefile in the root directory
CMD [ "make", "start" ]
