## Steps

## Make sure Docker is installed 
## Go into Root Directory
* cd sql
* docker compose up -d
* docker exec -it info310agn mysql -u root -p --default-character-set=utf8mb4

## To load insert data

* mysql> source sql/setup.sql



## File

docker-compose.yml file should be in /sql and should look like this

version: '3.7'

services:\
  mysql:\
    image: mysql\
    environment:\
      MYSQL_ROOT_PASSWORD: password\
      MYSQL_DATABASE: ASGN\
      MYSQL_USER: INFO310\
      MYSQL_PASSWORD: password\
    ports:\
      - "3306:3306"\
    volumes:\
      - ./sql:/sql # scripts for creating tables and inserting data\
      - ./mysql-data:/var/lib/mysql # Where mysql stores its data\
    container_name: info310asgn

volumes:\
  mysql-data: 

  ## database.js file

var mysql2 = require('mysql2');

const pool = mysql2.createPool({\
  host: '127.0.0.1', // local mysql\
  user: 'INFO310',\
  password: 'password',\
  database: 'ASGN',\
  charset: 'utf8mb4',\
  waitForConnections: false,\
  connectionLimit: 10,\
  queueLimit: 0,\
  multipleStatements: true,\
});

pool.on('error', (err) => {\
  console.error('Error with the database connection pool:', err);\
})

module.exports = pool;



