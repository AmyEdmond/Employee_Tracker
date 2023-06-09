import express from "express";
//express = require('express');
// Import and require mysql2
//const mysql = require('mysql2');
import mysql from "mysql2";
//require('dotenv').config();
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
      "Exit"
    ]
  }])
  .then((answer) => { 
     switch (answer.userOptions) {
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
        updEmp();
        break;

      case 'Exit':
        connection.end();
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
  db.promise().query('SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN department ON role.department_id=department.id')
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
        },
        viewDept();
      )})

  
  
}

function addRole () {
  inquirer.prompt([
   { type: 'input',
    message: "Which role would you like to add?",
    name: 'newRole'
    },
    { type: 'input',
    message: "What is the salary for this role?",
    name: 'roleSalary'
    },
    { type: 'list',
    message: "Which department does this role belong too?",
    name: 'deptName',
    choices: [
      'HR',
      'Engineering',
      'Service',
      'Sales',
      'IT',
      'Finance'
    ]
    }  
  ])
  .then((res) => db.promise().query('INSERT INTO role SET ?', {
    title: res.newRole,
    salary: res.roleSalary,
    department_id: res.deptName
  }
  
  ));
  viewRoles();
}

function addEmp () {
  inquirer.prompt([
   { type: 'input',
    message: "Employee first name",
    name: 'firstName'
    },
    { type: 'input',
    message: "Employee last name",
    name: 'lastName'
    },
    {
      type: "list",
      name: "roleOptions",
      message: "What would you like to do?",
      choices: role
    }
    
  ])
  .then((res) => db.promise().query('INSERT INTO employee'));
  viewEmp();
}

//to delete data by id: delete from customers where id = 1




