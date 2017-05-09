![rateapp-preview](https://i.imgur.com/EFVr4AQ.png)
# RateApp
Let users create collections of images and criteria that images will be ranked by. Users will vote between 2 random images which one matches the criteria better. This way the collection will get ranked in a crowdsourced order.  
  
A demo of this is running at http://rateapp.tk  
  
### Note
This is a work in progress and has a lot of bad practice placeholders such as authentication. Use with caution. List of incomplete features:
  - proper authentication
  - secure backend(check client data, authentication, cors-stuff maybe, errorhandling?)
  - maybe just redo the whole backend with better architecture
  - React component structure, it's a mess right now
  - user page, allow claiming of generated account with username and password.
  - Adding more options like shared ownership, private(url only) etc to collections
  - unit tests

### Requirements
You need mongoDB installed for the database. [Install guide](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)  
You will also probably need npm, node and git.

### Getting started
There are two parts, the server and the client. The server is the root of the project and create-react-app client is inside client/ directory. Both need to be npm installed after cloning. Be aware of which directory you run your npm scripts from, building should be done from root only as it moves the builded files into public folder. Setup and build scripts require unix commands, for windows create your own or perform the installs/moving of files manually.
  
Download:
```
git clone https://github.com/donmaiq/rateapp.git
cd rateapp
```
Install with npm script:
```
npm run setup
```
or manually:
```
npm install
cd client
npm install
```
  
### Development
start express server in root dir:
```
npm start
```
start react dev server in client/:
```
cd client/
npm start
```

### production
in root directory:
```
npm run build
npm run start
```
Tip: Use forever, pm2, nodemon, nohup etc to start server in background for production.
