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
  viewAllEmployees();
});

// Add Manager
TODO: viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary
    FROM employee
    INNER JOIN role ON employee.role_id = role.role_id
    INNER JOIN department ON role.department_id = department.department_id;`;
  connection.query(sql, (err, res) => {
    console.table(res);
    connection.end();
  });
};

viewAllEmployeesByDepartment = () => {
  const sql = ``;
  connection.query(sql, (err, res) => {
    console.table(res);
    connection.end();
  });
};

viewAllEmployeesByManager = () => {};
