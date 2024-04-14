CREATE USER 'user' IDENTIFIED BY 'password';
GRANT ALL ON *.* TO 'user' WITH GRANT OPTION;

DROP TABLE IF EXISTS Group;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Task;
DROP TABLE IF EXISTS GroupUser;
DROP TABLE IF EXISTS GroupTask;


CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE group (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
);
CREATE TABLE task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE group_user (
    user_id INT,
    group_id INT,
    PRIMARY KEY (user_id, group_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (group_id) REFERENCES group(group_id)
);

CREATE TABLE group_task (
    status VARCHAR(255) NOT NULL,
    task_id INT,
    user_id INT,
    FOREIGN KEY (task_id) REFERENCES task(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TRIGGER before_insert_group_task
BEFORE INSERT ON group_task
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM group_task WHERE user_id = NEW.user_id AND task_id = NEW.task_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User already assigned this task';
    END IF;
END;

DELIMITER //

CREATE PROCEDURE add_user_to_group(
    IN p_user_id INT,
    IN p_group_id INT
)
BEGIN
    DECLARE user_exists INT;
    DECLARE group_exists INT;
    
    SELECT COUNT(*) INTO user_exists FROM user WHERE id = p_user_id;
    SELECT COUNT(*) INTO group_exists FROM `group` WHERE group_id = p_group_id;
    
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist';
    ELSEIF group_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Group does not exist';
    ELSE
        INSERT INTO group_user (user_id, group_id) VALUES (p_user_id, p_group_id);
    END IF;
END//

DELIMITER ;






