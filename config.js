module.exports = config = {
  superSecret: 'Redbeandownstreamdragonfly', //SECRET FOR JSON WEB TOKEN
  /* POSTGRES CONFIG */
  user: 'postgres', //env var: PGUSER 
  database: 'rateapp', //env var: PGDATABASE 
  password: 'root', //env var: PGPASSWORD 
  host: 'localhost', // Server hosting the postgres database 
  port: 5432, //env var: PGPORT 
}