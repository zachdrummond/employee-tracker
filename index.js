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
  const sql = ``;
  connection.query(sql, (err, res) => {
    console.table(res);
    connection.end();
  });
};
