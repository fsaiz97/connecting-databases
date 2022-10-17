const express = require("express");
const cors = require("cors");

const db = require("./db");

const app = express();

function setupMiddleware(app) {
    app.use(express.json());
    app.use(cors());
}

function addRoutes(app) {
    app.get("/", (req, res) => res.send("Welcome to the Wrongs API: We track injustices!"));
    
    app.get("/wrongs", async (req, res) => {
        const data = await db.query("SELECT * FROM wrong");
        console.log(data);
    })
}

setupMiddleware(app);
addRoutes(app);

module.exports = app;
