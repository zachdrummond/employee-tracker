const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysql",
  database: "employee_tracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  //addEmployee();
  //viewAllEmployees();
  //removeEmployee();
  //viewAllRoles();
  //updateEmployeeRole();
  //viewAllEmployees();
  viewAllDepartments();
  addDepartment();
  viewAllDepartments();
  removeDepartment();
  viewAllDepartments();
  //addDepartment();
  //viewAllDepartments();
});

// Add Manager
TODO: viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary
    FROM employee
    INNER JOIN role ON employee.role_id = role.role_id
    INNER JOIN department ON role.department_id = department.department_id
    ORDER BY employee.id`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

viewAllEmployeesByDepartment = () => {
  const sql = `SELECT department.department_name, employee.id, employee.first_name, employee.last_name, role.title, role.salary
  FROM employee
  INNER JOIN role ON employee.role_id = role.role_id
  INNER JOIN department ON role.department_id = department.department_id
  ORDER BY department.department_name`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

// Add functionality
TODO: viewAllEmployeesByManager = () => {
  const sql = ``;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
};

addEmployee = () => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES ("Toby", "Flenderson", 5, 1)`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
  });
};

removeEmployee = () => {
  const sql = `DELETE FROM employee WHERE employee.first_name = "Toby" AND employee.last_name = "Flenderson"`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
  });
};

updateEmployeeRole = () => {
  const sql = `UPDATE employee SET role_id = 5 WHERE employee.first_name = "Darryl" AND employee.last_name = "Philbin"`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
  });
};

// Add functionality
TODO: updateEmployeeManager = () => {};

viewAllRoles = () => {
  const sql = `SELECT role.title FROM role`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

addRole = () => {};

removeRole = () => {};

viewAllDepartments = () => {
  const sql = `SELECT department.department_name FROM department`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

addDepartment = () => {
  const sql = `INSERT INTO department (department_id, department_name) 
  VALUES (7, "Informational Technology")`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
  });
};

removeDepartment = () => {
  const sql = ``;
  connection.query(sql, (err, res) => {
    if (err) throw err;
  });
};
