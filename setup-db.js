// Sends the SQL to the database we are connecting to
const fs = require("fs");
require("dotenv").config();

// Load the SQL code
const sql = fs.readFileSync("setup.sql").toString();

// Import our db
const db = require("./db")

// Run the query - send the SQL code to the database
db.query(sql)
    .then(data => console.log("Setup complete"))
    .catch(error => console.log(error));
