DROP TABLE IF EXISTS group_task;
DROP TABLE IF EXISTS task;
DROP TABLE IF EXISTS group_user;
DROP TABLE IF EXISTS `group`;
DROP TABLE IF EXISTS user;
CREATE TABLE user (id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL, phone_number VARCHAR(255) NOT NULL, address VARCHAR(500),password VARCHAR(255) NOT NULL);
CREATE TABLE `group` (group_id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(255) NOT NULL);
CREATE TABLE task (id INT PRIMARY KEY AUTO_INCREMENT,title VARCHAR(255) NOT NULL,description VARCHAR(255) NOT NULL);
CREATE TABLE group_user (user_id INT,group_id INT,PRIMARY KEY (user_id, group_id),FOREIGN KEY (user_id) REFERENCES user(id),FOREIGN KEY (group_id) REFERENCES `group`(group_id));
CREATE TABLE group_task (status VARCHAR(255) NOT NULL,task_id INT,user_id INT,FOREIGN KEY (task_id) REFERENCES task(id),FOREIGN KEY (user_id) REFERENCES user(id));
INSERT INTO user (name, email, phone_number, address, password) VALUES ('John Doe', 'testMe@gmail.com','123456','1234 Main St, San Francisco, CA 94123','password');
INSERT INTO `group` (name) VALUES ('Group 1');







