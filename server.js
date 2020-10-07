const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysql",
  database: "employee_tracker_db",
});

connection.connect((err) => {
  if (err) throw err;

  init();
});

init = () => {
  console.log("Welcome to the Ultimate Employee Management System!");
  inquirer
    .prompt([
      {
        name: "userChoice",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Employees By Department",
          "View All Employees By Manager",
          "Add Employee",
          "Remove Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "Add Role",
          "Remove Role",
          "View All Departments",
          "Add Department",
          "Remove Department",
          "Exit",
        ],
        default: "View All Employees",
      },
    ])
    .then((response) => {
      filterFunctions(response.userChoice);
    })
    .catch((error) => {
      console.log(error);
    });
};

filterFunctions = (userChoice) => {
  switch (userChoice) {
    case "View All Employees":
      viewAllEmployees();
      break;
    case "View All Employees By Department":
      viewAllEmployeesByDepartment();
      break;
    case "View All Employees By Manager":
      viewAllEmployeesByManager();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Remove Employee":
      removeEmployee();
      break;
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    case "Update Employee Manager":
      updateEmployeeManager();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "Add Role":
      addRole();
      break;
    case "Remove Role":
      removeRole();
      break;
    case "View All Departments":
      viewAllDepartments();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Remove Department":
      removeDepartment();
      break;
    case "Exit":
      console.log("Goodbye!");
      connection.end();
      break;
    default:
      viewAllEmployees();
      break;
  }
};

viewAllEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, concat(manager.first_name , " " , manager.last_name) AS "manager"
  FROM employee
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  INNER JOIN role ON employee.role_id = role.role_id
  INNER JOIN department ON role.department_id = department.department_id
  ORDER BY employee.id`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

viewAllEmployeesByDepartment = () => {
  const sql = `SELECT department.department_name, employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(manager.first_name , " " , manager.last_name) AS "manager"
  FROM employee
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  INNER JOIN role ON employee.role_id = role.role_id
  INNER JOIN department ON role.department_id = department.department_id
  ORDER BY department.department_name`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

viewAllEmployeesByManager = () => {
  const sql = `SELECT concat(manager.first_name , " " , manager.last_name) AS "manager", employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary
  FROM employee
  LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  INNER JOIN role ON employee.role_id = role.role_id
  INNER JOIN department ON role.department_id = department.department_id
  ORDER BY manager`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

addEmployee = () => {
  connection.query(
    `SELECT role.role_id, role.title, employee.id, employee.first_name, employee.last_name FROM role
    INNER JOIN employee ON employee.role_id = role.role_id`,
    (err, result) => {
      if (err) throw err;

      const currentEmployeesArray = result.map((result) => {
        return `${result.first_name} ${result.last_name}`;
      });
      const currentRolesArray = [
        ...new Set(
          result.map((result) => {
            return result.title;
          })
        ),
      ];

      inquirer
        .prompt([
          {
            name: "employeeFirstName",
            type: "input",
            message: "What is the employee's first name?",
          },
          {
            name: "employeeLastName",
            type: "input",
            message: "What is the employee's last name?",
          },
          {
            name: "role",
            type: "list",
            message: "What is the employee's role?",
            choices: currentRolesArray,
          },
          {
            name: "manager",
            type: "list",
            message: "Who is the employee's manager?",
            choices: currentEmployeesArray,
          },
        ])
        .then((response) => {
          const managerArray = response.manager.split(" ");
          const managerFirstName = managerArray[0];
          const managerLastName = managerArray[1];

          let roleId, managerId;
          for (let i = 0; i < result.length; i++) {
            if (response.role === result[i].title) {
              roleId = result[i].role_id;
            }
            if (
              managerFirstName === result[i].first_name &&
              managerLastName === result[i].last_name
            ) {
              managerId = result[i].id;
            }
          }

          connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
            [
              response.employeeFirstName,
              response.employeeLastName,
              roleId,
              managerId,
            ],
            (err, result) => {
              if (err) throw err;
              init();
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
};

removeEmployee = () => {
  connection.query(
    `SELECT employee.first_name, employee.last_name FROM employee`,
    (err, result) => {
      if (err) throw err;
      const currentEmployeesArray = result.map((result) => {
        return `${result.first_name} ${result.last_name}`;
      });

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to remove?",
            choices: currentEmployeesArray,
          },
        ])
        .then((response) => {
          const employeeArray = response.employee.split(" ");
          const employeeFirstName = employeeArray[0];
          const employeeLastName = employeeArray[1];

          connection.query(
            `DELETE FROM employee WHERE employee.first_name = ? AND employee.last_name = ?`,
            [employeeFirstName, employeeLastName],
            (err, result) => {
              if (err) throw err;
              init();
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
};

updateEmployeeRole = () => {
  connection.query(
    `SELECT role.role_id, role.title, employee.first_name, employee.last_name FROM role
    INNER JOIN employee ON employee.role_id = role.role_id`,
    (err, result) => {
      if (err) throw err;

      const currentEmployeesArray = result.map((result) => {
        return `${result.first_name} ${result.last_name}`;
      });
      const currentRolesArray = [
        ...new Set(
          result.map((result) => {
            return result.title;
          })
        ),
      ];

      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: currentEmployeesArray,
          },
          {
            name: "role",
            type: "list",
            message: "Which role would you like to give this employee?",
            choices: currentRolesArray,
          },
        ])
        .then((response) => {
          const employeeArray = response.employee.split(" ");
          const employeeFirstName = employeeArray[0];
          const employeeLastName = employeeArray[1];

          let roleId;
          for (let i = 0; i < result.length; i++) {
            if (response.role === result[i].title) {
              roleId = result[i].role_id;
            }
          }

          connection.query(
            `UPDATE employee SET role_id = ? WHERE employee.first_name = ? AND employee.last_name = ?`,
            [roleId, employeeFirstName, employeeLastName],
            (err, res) => {
              if (err) throw err;
              init();
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
};

updateEmployeeManager = () => {
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Which employee would you like to update?",
        choices: [],
      },
      {
        name: "manager",
        type: "list",
        message: "Which employee will become the selected employee's manager?",
        choices: [],
      },
    ])
    .then((response) => {})
    .catch((error) => {
      console.log(error);
    });

  const sql = `UPDATE employee SET manager_id = 2 WHERE employee.first_name = "Darryl" AND employee.last_name = "Philbin"`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    init();
  });
};

viewAllRoles = () => {
  const sql = `SELECT role.title, role.salary FROM role`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

addRole = () => {
  connection.query(
    `SELECT department_id, department.department_name FROM department`,
    (err, result) => {
      if (err) throw err;

      const currentDepartmentsArray = result.map((result) => {
        return result.department_name;
      });

      inquirer
        .prompt([
          {
            name: "role",
            type: "input",
            message: "What is the name of the role you want to add?",
          },
          {
            name: "salary",
            type: "input",
            message: "What is the annual salary for this role?",
          },
          {
            name: "department",
            type: "list",
            message: "Which department will this role be under?",
            choices: currentDepartmentsArray,
          },
        ])
        .then((response) => {
          const salary = parseInt(response.salary);
          console.log(salary);

          let departmentId;
          for (let i = 0; i < result.length; i++) {
            if (response.department === result[i].department_name) {
              departmentId = result[i].department_id;
            }
          }

          connection.query(
            `INSERT INTO role (title, salary, department_id)
            VALUES (?, ?, ?)`,
            [response.role, salary, departmentId],
            (err, res) => {
              if (err) throw err;
              init();
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
};

removeRole = () => {
  const sql = `DELETE FROM role WHERE role.title = "Web Developer"`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    init();
  });
};

viewAllDepartments = () => {
  const sql = `SELECT department.department_name FROM department`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

addDepartment = () => {
  connection.query(
    `SELECT department.department_id FROM department`,
    (err, result) => {
      if (err) throw err;
      let departmentId = parseInt(result[result.length - 1].department_id);
      departmentId++;

      inquirer
        .prompt([
          {
            name: "department",
            type: "input",
            message: "What is the name of the department you want to add?",
          },
        ])
        .then((response) => {
          connection.query(
            `INSERT INTO department (department_id, department_name)
            VALUES (?, ?)`,
            [departmentId, response.department],
            (err, res) => {
              if (err) throw err;
              init();
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  );
};

removeDepartment = () => {
  const sql = `DELETE FROM department WHERE department_name = "Information Technology"`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    init();
  });
};
