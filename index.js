const inquirer = require("inquirer");
const sql = require("mysql");

var connection = sql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "staff_db"
});
  
connection.connect(function(err) {
if (err) throw err;
// run the start function after the connection is made to prompt the user
start();
});

function start(){
    inquirer
    .prompt({
        name: "selectTable",
        type: "list",
        message: "Please select your action from the list",
        choices: ["add a department", "add a role", "add an employee", "view departments", "view roles", "view employees", "end"]
    })
    .then(function(answer){
        if (answer.selectTable === "add a department"){
            addADepartment();
        }
        else if(answer.selectTable === "add a role"){
            addARole();
        }
        else if(answer.selectTable === "add an employee"){
            addEmployee();
        }
        else if(answer.selectTable === "view departments"){
            viewDepartments();
        }
        else if(answer.selectTable === "view roles"){
            viewRoles();
        }
        else if(answer.selectTable === "view employees"){
            viewEmployees();
        }
        else{
            connection.end();
        }
    });
}

function addADepartment(){
    inquirer
        .prompt({
            name: "deptName",
            type: "input",
            message: "What is the department's name?"
        })
        .then(function(answer){
            connection.query(
                "INSERT INTO department SET ?", {name: answer.deptName},
                function(err){
                    if (err) throw err;
                    start();
                }
            )
        })
}

function addARole(){
    inquirer
        .prompt([{
            name: "title",
            type: "input",
            message: "What is the role's title?"
        },{
            name: "salary",
            type: "input",
            message: "What is the role's salary?"
        },{
            name: "departmentId",
            type: "input",
            message: "What department is the role in?"
        }])
        .then(function(answers){
            connection.query(
                "INSERT INTO roles SET ?",
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: answers.departmentId
                },
                function(err) {
                    if(err) throw err;
                    start();
                }
            )
        })
}

function addEmployee(){
    inquirer
        .prompt([{
            name: "firstName",
            type: "input",
            message: "What is the employee's first name?"
        },{
            name: "lastName",
            type: "input",
            message: "What is the employee's last name?"
        },{
            name: "role",
            type: "input",
            message: "What is the id of the role of this employee"
        },{
            name: "manId",
            type: "input",
            message: "What is the id of the employee's manager?"
        }])
        .then(function(answers){
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answers.firstName,
                    last_name: answers.lastName,
                    role_id: answers.role,
                    manager_id: answers.manId
                },
                function(err){
                    if (err) throw err;
                    start();
                }
            )
        })
}

var departments = [];

function viewDepartments(){
    connection.query(
        "SELECT * FROM department;",function(err, result){
            if(err) throw err;
            departments.unshift(result);
            console.table(departments[0]);
            start();      
        }
    );
}

var roles = [];

function viewRoles(){
    connection.query(
        "SELECT * FROM roles;",function(err, result){
            if(err) throw err;
            roles.unshift(result);
            console.table(roles[0]);
            start();
        }
    );
}

var employees = [];

function viewEmployees(){
    connection.query(
        "SELECT * FROM employee;", function(err, result){
            if (err) throw err;
            employees.unshift(result);
            console.table(employees[0]);
            start();
        }
    )
};