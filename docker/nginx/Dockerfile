FROM nginx:stable-alpine

WORKDIR /usr/src/app

ADD ./docker/nginx/node-blog.conf .

# static file
COPY ./public ./static

EXPOSE 80

CMD ["nginx", "-c", "/usr/src/app/node-blog.conf", "-g", "daemon off;"]
