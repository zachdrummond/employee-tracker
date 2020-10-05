# employee-tracker

# Team-Generator

## Table of Contents
* [Description](#Description)
* [Links](#Links)
* [Design Elements](#Design-Elements)
* [App Preview](#App-Preview)
* [Credits](#Credits)

## Description
This is a command-line application that creates a content management system for all employees within a company. Users can view, add, or update departments, roles, and/or employees. This app enables business owners to easily keep track of their employees in one organized system.

### *Usage*
1. Enter "node app.js" in your command line.
2. Enter your team's information based on the prompts.
3. Look at the new HTML website that will be created.

## Links
* Video Walkthrough: 
* GitHub Repository: https://github.com/zachdrummond/employee-tracker

## Design Elements
### *JavaScript - Node.js*
* Node Command-Line User Interface
* Unit Tests
* Modules
* Node Packages - File System, Path
* Node Package Manager - Inquirer, Jest
* Classes & Sub-Classes
* Constructors
* Promises
* Objects & Destructured Objects
* Arrays
* Methods
* Functions
* if...else Statements
* Template Literals
* Comments


## App Preview
### Command-Line Instructions
![CLI](./Assets/)
### App Preview
![App Preview](./Assets/)

## Credits
* https://nodejs.org/en/
* https://www.npmjs.com/package/inquirer
* https://dev.mysql.com/
* https://www.npmjs.com/package/console.table


- - -
© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.

## Instructions
  
Build a command-line application that at a minimum allows the user to:

  * Add departments, roles, employees

  * View departments, roles, employees

  * Update employee roles

Bonus points if you're able to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department


How do you deliver this? Here are some guidelines:

* Use the [MySQL](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

* Use [InquirerJs](https://www.npmjs.com/package/inquirer/v/0.2.3) NPM package to interact with the user via the command-line.

* Use [console.table](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of `console.table`, but the NPM package formats the data a little better for our purposes.

* You may wish to have a separate file containing functions for performing specific SQL queries you'll need to use. Could a constructor function or a class be helpful for organizing these?

* You will need to perform a variety of SQL JOINS to complete this assignment, and it's recommended you review the week's activities if you need a refresher on this.

![Employee Tracker](Assets/employee-tracker.gif)

### Hints

* You may wish to include a `seed.sql` file to pre-populate your database. This will make development of individual features much easier.

* Focus on getting the basic functionality completed before working on more advanced features.

* Check out [SQL Bolt](https://sqlbolt.com/) for some extra MySQL help.

## Bonus

* The command-line application should allow users to:

  * Update employee managers

  * View employees by manager

  * Delete departments, roles, and employees

  * View the total utilized budget of a department -- ie the combined salaries of all employees in that department