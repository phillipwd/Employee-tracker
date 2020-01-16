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
        choices: ["Add a department", "Add a role", "Add an employee", "View departments", "View roles", "View employees", "Update employee role", "end"]
    })
    .then(function(answer){
        if (answer.selectTable === "Add a department"){
            addADepartment();
        }
        else if(answer.selectTable === "Add a role"){
            addARole();
        }
        else if(answer.selectTable === "Add an employee"){
            addEmployee();
        }
        else if(answer.selectTable === "View departments"){
            viewDepartments();
        }
        else if(answer.selectTable === "View roles"){
            viewRoles();
        }
        else if(answer.selectTable === "View employees"){
            viewEmployees();
        }
        else if(answer.selectTable === "Update employee role"){
            editEmployeeRole();
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

let roleName = [];

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

let employeeChoices = []

function editEmployeeRole(){
    // if(employees.length === 0){
        connection.query(
            "SELECT * FROM employee;", function(err, result){
                if (err) throw err;
                employees = result;
                if(roles.length === 0){
                    connection.query(
                        "SELECT * FROM roles;",function(err, result){
                            if(err) throw err;
                            roles = result;
                        })
            }
     
    inquirer
    .prompt({
        name: "verify",
        type: "list",
        message: "Employee data will be changed. Continue?",
        choices:["yes", "no"]
    })
    .then(function(answer){
        if(answer.verify === "yes"){
            for(i = 0; i < employees.length; i++){
                // console.log(employees);
                
                const temp = employees[i].first_name + " " + employees[i].last_name;///
                employeeChoices.push(temp);///
                // console.log(employeeChoices);//// this works, but may make things harder later
            };
            // if(roles.length === 0){
            //     connection.query(
            //         "SELECT * FROM roles;",function(err, result){
            //             if(err) throw err;
            //             roles = result;
            //         })
                    for(i = 0; i < roles.length; i++){
                        roleName.push(roles[i].title);    
                    }
            // }
            selectEmployee();          
            }//ifyes
        else if(answer.verify === "no"){
            start();
        }//elseif
    })//.then
})//firstquery

}//function begin
// }
function selectEmployee(){
    inquirer
    .prompt({
        name: "selectedEmployee",
        type: "list",
        message: "Which employee would you like to update?",
        choices: employeeChoices
    })
    .then(function(answer){
        console.log(answer);
        let id;
        for(i = 0; i < employeeChoices.length; i++){
            if(answer.selectedEmployee === employees[i].first_name + " " + employees[i].last_name){
                id = employees[i].id;    
            }
        }
        // if(roles.length === 0){
        //     connection.query(
        //         "SELECT * FROM roles;",function(err, result){
        //             if(err) throw err;
        //             roles.unshift(result);
        //     })
        // }
        inquirer
        .prompt({
            name: "newRole",
            type: "list",
            message: "What role would you like to change?",
            choices: roleName
        })
        .then(function(answer){
            let roleId;
            console.log(roles);
            
            for(i = 0; i < roles.length; i++){
                if(answer.newRole === roles[i].title){
                    roleId = roles[i].id;
                }
            }
console.log(roleId);


            connection.query(
                "UPDATE employee SET ? WHERE ?", [{role_id: roleId}, {id:id}],
                function(err){
                    if (err) throw err;
                    console.log("Role changed");    
                }
            )
        })    
    })
}

