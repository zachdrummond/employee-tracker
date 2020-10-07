// DEPENDENCIES
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Creates a Connection with the Database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysql",
  database: "employee_tracker_db",
});

// Establishes the Connection with the Database
connection.connect((err) => {
  if (err) throw err;

  console.log("Welcome to the Ultimate Employee Management System!");

  init();
});

// Initial Prompt for User
init = () => {
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

// Swtich...case statements that complete the user's requested task
filterFunctions = (userChoice) => {
  let sql = ``;

  switch (userChoice) {
    case "View All Employees":
      sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, concat(manager.first_name , " " , manager.last_name) AS "manager"
      FROM employee
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
      INNER JOIN role ON employee.role_id = role.role_id
      INNER JOIN department ON role.department_id = department.department_id
      ORDER BY employee.id`;
      break;
    case "View All Employees By Department":
      sql = `SELECT department.department_name, employee.id, employee.first_name, employee.last_name, role.title, role.salary, concat(manager.first_name , " " , manager.last_name) AS "manager"
      FROM employee
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
      INNER JOIN role ON employee.role_id = role.role_id
      INNER JOIN department ON role.department_id = department.department_id
      ORDER BY department.department_name`;
      break;
    case "View All Employees By Manager":
      sql = `SELECT concat(manager.first_name , " " , manager.last_name) AS "manager", employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary
      FROM employee
      LEFT JOIN employee AS manager ON employee.manager_id = manager.id
      INNER JOIN role ON employee.role_id = role.role_id
      INNER JOIN department ON role.department_id = department.department_id
      ORDER BY manager`;
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
      sql = `SELECT role.title, role.salary FROM role`;
      break;
    case "Add Role":
      addRole();
      break;
    case "Remove Role":
      removeRole();
      break;
    case "View All Departments":
      sql = `SELECT department.department_name FROM department`;
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
      console.log("Goodbye!");
      connection.end();
      break;
  }
  if (sql.length !== 0) {
    createTable(sql);
  }
};

// Displays a Table based on the User's Choice
createTable = (sql) => {
  connection.query(sql, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

// Adds an Employee to the Database
addEmployee = () => {
  // Retrieves a Table of Roles and Employees from the Database
  connection.query(
    `SELECT role.role_id, role.title, employee.id, employee.first_name, employee.last_name FROM role
    INNER JOIN employee ON employee.role_id = role.role_id`,
    (err, result) => {
      if (err) throw err;

      // Creates an array of Current Employees
      const currentEmployeesArray = result.map((result) => {
        return `${result.first_name} ${result.last_name}`;
      });
      // Creates an array of Current Roles
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
          // Splits the Manager Array into First Name and Last Name
          const managerArray = response.manager.split(" ");
          const managerFirstName = managerArray[0];
          const managerLastName = managerArray[1];

          // Retrieves the correct roleId and ManagerId from the database
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

          // Adds the Employee to the Database
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

// Removes an Employee from the Database
removeEmployee = () => {
  // Retrieves a Table of Employees from the Database
  connection.query(
    `SELECT employee.first_name, employee.last_name FROM employee`,
    (err, result) => {
      if (err) throw err;

      // Creates an array of Current Employees
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
          // Splits the Employee Array into First Name and Last Name
          const employeeArray = response.employee.split(" ");
          const employeeFirstName = employeeArray[0];
          const employeeLastName = employeeArray[1];

          // Removes the Employee from the Database
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

// Updates an Employee's Role in the Database
updateEmployeeRole = () => {
  // Retrieves a Table of Roles and Employees from the Database
  connection.query(
    `SELECT role.role_id, role.title, employee.first_name, employee.last_name FROM role
    INNER JOIN employee ON employee.role_id = role.role_id`,
    (err, result) => {
      if (err) throw err;

      // Creates an array of Current Employees
      const currentEmployeesArray = result.map((result) => {
        return `${result.first_name} ${result.last_name}`;
      });
      // Creates an array of Current Roles
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
          // Splits the Employee Array into First Name and Last Name
          const employeeArray = response.employee.split(" ");
          const employeeFirstName = employeeArray[0];
          const employeeLastName = employeeArray[1];

          // Retrieves the correct roleId from the database
          let roleId;
          for (let i = 0; i < result.length; i++) {
            if (response.role === result[i].title) {
              roleId = result[i].role_id;
            }
          }

          // Updates the Employee's Role in the Database
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

// Updates an Employee's Manager in the Database
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

// Adds a Role to the Database
addRole = () => {
  // Retrieves a Table of Departments from the Database
  connection.query(
    `SELECT department_id, department.department_name FROM department`,
    (err, result) => {
      if (err) throw err;

      // Creates an array of Current Departments
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

          // Retrieves the correct departmentId from the database
          let departmentId;
          for (let i = 0; i < result.length; i++) {
            if (response.department === result[i].department_name) {
              departmentId = result[i].department_id;
            }
          }

          // Adds a Role to the Database
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

// Removes a Role from the Database
removeRole = () => {
  const sql = `DELETE FROM role WHERE role.title = "Web Developer"`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    init();
  });
};

// Adds a Department to the Database
addDepartment = () => {
  // Retrieves a Table of Department iDs from the Database
  connection.query(
    `SELECT department.department_id FROM department`,
    (err, result) => {
      if (err) throw err;
      
      // Creates a new departmentId rather than using one that already exists
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
          // Adds a Department to the Database
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

// Removes a Department from the Database
removeDepartment = () => {
  const sql = `DELETE FROM department WHERE department_name = "Information Technology"`;
  connection.query(sql, (err, res) => {
    if (err) throw err;
    init();
  });
};
