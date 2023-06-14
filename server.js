import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();
import inquirer from "inquirer";
import chalk from 'chalk';
import figlet from 'figlet';


// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);


console.log(chalk.cyan.bold('======================================================================================================='));
console.log(``);
console.log(chalk.white.bold(figlet.textSync('  EMPLOYEE TRACKER')));
console.log(``);
console.log(``);
console.log(chalk.cyan.bold(`======================================================================================================`));


function questions() {
inquirer
  .prompt([{
    type: "list",
    name: "userOptions",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add employee",
      "Update employee role",
      "Delete employee",
      "Exit"
    ]
  }])
  .then((res) => { 
     switch (res.userOptions) {
      case "View all departments":
        viewDept();
        break;

      case "View all roles": 
        viewRoles();
        break;

      case "View all employees":
        viewEmp();
        break;

      case "Add a department":
        addDept();
        break;

      case "Add a role":
        addRole();
        break;

      case "Add employee":
        addEmp();
        break;

      case "Update employee role":
        updEmpRole();
        break;
        case "Delete employee":
        delEmp();
        break;

      case 'Exit':
        db.end();
        break;
        
     }
  })
  .catch((err) => console.log(err));
}

questions();

function viewDept () {
  db.promise().query('SELECT * FROM department')
  .then(res => {
    console.table(res[0]);
    questions();
  })
  
}

function viewRoles () {
  db.promise().query('SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id=department.id')
  .then(res => {
    console.table(res[0])
    questions();
  })
}

function viewEmp () {
  db.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id  LEFT JOIN employee manager ON manager.id = employee.manager_id`)
  .then(res => {
    console.table(res[0])
    questions();
  })
}

function addDept () {
  inquirer.prompt([
   { type: 'input',
    message: "Which department would you like to add?",
    name: 'newDept'
    } 
  ])
  .then((res) => {db.promise().query(`INSERT INTO department SET ?`,
        {
          name: res.newDept,
        }
      )
    .then(viewDept())  })
}

function addRole() {
  db.query("SELECT * FROM department", (err,res) => {
    const departments = res.map((department) => ({
      name: department.name,
      value: department.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          message: "Which role would you like to add?",
          name: "title",
        },
        {
          type: "input",
          message: "What is the salary for this role?",
          name: "roleSalary",
        },
        {
          type: "list",
          message: "Which department does this role belong too?",
          name: "deptName",
          choices: departments,
        },
      ])
      .then((res) => {
        db.promise()
          .query("INSERT INTO role SET ?", {
            title: res.title,
            salary: res.roleSalary,
            department_id: res.deptName,
          })
          .then(viewRoles());
      });
  });
}

function addEmp() {
  db.query("SELECT * FROM role", (err,res) => {
    if (err) throw err;
    const roles = res.map((role) => (
    {
      name: role.title,
      value: role.id,
    }));
    db.query("SELECT * FROM employee", (err,res) => {
        if (err) throw err;
      const employees = res.map((employee) => ({
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      }));
      inquirer
        .prompt([
            { type: "input", 
                message: "Employee first name", 
                name: "firstName" 
            },
            { type: "input", 
                message: "Employee last name", 
                name: "lastName" 
            },
            {
            type: "list",
            name: "roleOptions",
            message: "What is the employee's role?",
            choices: roles
          },
          {
            type: "list",
            name: "managerOptions",
            message: "Who is the employee's manager?",
            choices: employees
          }
        ])
        .then((res) => {
          db.promise()
            .query("INSERT INTO employee SET ?", {
              first_name: res.firstName,
              last_name: res.lastName,
              role_id: res.roleOptions,
              manager_id: res.managerOptions
            })
            .then(viewEmp());
        });
    });
  });
}

function updEmpRole() {
  db.query("SELECT * FROM role", (err,res) => {
    if (err) throw err;
    const roles = res.map((role) => ({
      name: role.title,
      value: role.id,
    }));
    db.query("SELECT * FROM employee", (err,res) => {
        if (err) throw err;
      const employees = res.map((employee) => ({
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      }));
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee would you like to update?",
            name: "employee",
            choices: employees,
          },
          {
            type: "list",
            message: "What is the employee's new role?",
            name: "newRole",
            choices: roles,
          },
        ])
        .then((res) => {
          db.promise()
            .query(
              `UPDATE employee SET ? WHERE ?`,
            [
                {
                    role_id: res.newRole,
                },
                {
                    id: res.employee,
                }
            ],
            )
            .then(viewEmp());
        });
    });
  });
}

function delEmp() {
    db.query("SELECT * FROM employee", (err,res) => {
        if(err) throw err;
        const employees = res.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          }));
    inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee would you like to delete?",
        choices: employees
      }
    ]).then((res) => {
        db.promise()
          .query(
            `DELETE FROM employee WHERE ?`,
          [
              {
                  id: res.employee,
              }
          ],
          )
          .then(viewEmp());
      
      });
    });
}





