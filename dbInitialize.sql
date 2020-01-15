DROP DATABASE IF EXISTS staff_db;

CREATE DATABASE staff_db;

USE staff_db;

CREATE TABLE department(
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);

CREATE TABLE roles(
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR (30) NOT NULL,
salary INT NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
id INT AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id)

);

USE staff_db;
INSERT INTO department (name) VALUES ("engineering");
INSERT INTO roles (title, salary, department_id) VALUES ("manager", 70000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("John", "Doe", 1, 1);
SELECT * FROM employee;