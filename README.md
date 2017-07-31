# node blog
A blog use Node.js,Mongodb,and deployed with docker.

## How to run with docker
### Mongo
**1.build image**

In the *docker/mongodb/* directory of project,run  "**docker build -t &lt;your image name&gt; .**" 

**2.run container**

Run "**docker run --name &lt;your container name&gt; -v &lt;your local host path&gt;/node-blog/db:/usr/src/sharedir -d &lt;your image name&gt;**


### Node.js

**1.build image**

In the root directory of project,run "**docker build -t &lt;your image name&gt; --file docker/node/Dockerfile .**" Please don't forget the last dot character in the command,which means current directory. [more info about docker build](https://docs.docker.com/engine/reference/commandline/build/)

**2.run container**

After that,you can just create the container of the image which is created right away.Something like this "**docker run --name &lt;your container name&gt; -v &lt;your local host path&gt;/node-blog:/usr/src/app -p 9999:3000 --link &lt;your mongodb container id or name&gt;:&lt;alias&gt; -it &lt;your image name&gt;**.[more info about docker run](https://docs.docker.com/engine/reference/run/).BTW,it use to access mongodb with *alias* in the node container.

All done!Check http://localhost:9999

## Reference
1.[Dockerizing a Node.js web app](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
