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
        res.status(200).send(data.rows[0]);
    });

    app.get("/people/:id", async (req, res) => {
        const id = parse(req.params.id);

        // select person by id
        const data = await db.query(`SELECT * FROM person WHERE person_id = ${id}`); // DON'T DO THIS, RISK OF SQL INJECTION
    })
}

setupMiddleware(app);
addRoutes(app);

module.exports = app;
