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
  viewAllEmployeesByDepartment();
});

// Add Manager
TODO: viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary
    FROM employee
    INNER JOIN role ON employee.role_id = role.role_id
    INNER JOIN department ON role.department_id = department.department_id;`;
  connection.query(sql, (err, res) => {
    console.table(res);
    connection.end();
  });
};

viewAllEmployeesByDepartment = () => {
  const sql = `SELECT department.department_name, employee.id, employee.first_name, employee.last_name, role.title, role.salary
  FROM employee
  INNER JOIN role ON employee.role_id = role.role_id
  INNER JOIN department ON role.department_id = department.department_id
  ORDER BY department.department_name;`;
  connection.query(sql, (err, res) => {
    console.table(res);
    connection.end();
  });
};

TODO: // Add functionality
viewAllEmployeesByManager = () => {
    const sql = ``;
  connection.query(sql, (err, res) => {
    console.table(res);
    connection.end();
  });
};

addEmployee = () => {
    const sql = ``;
  connection.query(sql, (err, res) => {
    console.table(res);
    connection.end();
  });
}
