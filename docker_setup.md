## Steps

### 1st Install Docker
### Go into Root Directory
cd sql
docker compose up -d
docker exec -it cosc203mysql mysql -u root -p --default-character-set=utf8mb4

### To load insert data

mysql> source sql/setup.sql



### File
docker-compose.yml file should be in /sql and should look like this

version: '3.7'

services:
  mysql:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: ASGN
      MYSQL_USER: INFO310
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - ./sql:/sql # scripts for creating tables and inserting data
      - ./mysql-data:/var/lib/mysql # Where mysql stores its data
    container_name: info310asgn

volumes:
  mysql-data: 



