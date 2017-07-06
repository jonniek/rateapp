module.exports = config = {
  superSecret: 'Redbeandownstreamdragonfly', //SECRET FOR JSON WEB TOKEN
  /* POSTGRES CONFIG */
  user: 'rateapp', //env var: PGUSER 
  database: 'rateapp', //env var: PGDATABASE 
  password: 'rateapp', //env var: PGPASSWORD 
  host: 'localhost', // Server hosting the postgres database 
  port: 5432, //env var: PGPORT 
}