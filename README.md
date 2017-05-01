### Getting started
There are two parts, the server and the client. The server is the root of the project and create-react-app client is inside client/ directory. Both need to be npm installed after cloning. Be aware of which directory you run your npm scripts from, building should be done from root only as it moves the builded files into public folder.
```
git clone git@github.com:donmaiq/rateapp.git
cd rateapp
npm install
cd client
npm install
```
  
### Development
start express server in root dir:
```
npm run start
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
Use forever, pm2, nodemon etc to start server in background for production.
