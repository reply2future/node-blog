# node blog
A blog use Node.js,Mongodb,and deployed with docker.

## How to run with docker
In the root directory of project,run "**docker build -t &lt;your image name&gt; docker/node/Dockerfile .**" Please don't forget the last dot character in the command,which means current directory. [more info about docker build](https://docs.docker.com/engine/reference/commandline/build/)

After that,you can just create the container of the image which is created right away.Something like this "**docker run --name &lt;your container name&gt; -v &lt;your local host path&gt;/node-blog:/usr/src/app -p 9999:3000 -it &lt;your image name&gt;**.[more info about docker run](https://docs.docker.com/engine/reference/run/)

All done!Check http://localhost:9999
