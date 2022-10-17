const express = require("express");
const cors = require("cors");

const logRoute = require("./route-logger");
const db = require("./db");

const app = express();

function setupMiddleware(app) {
    app.use(express.json());
    app.use(cors());
    app.use(logRoute);
}

function addRoutes(app) {
    app.get("/", (req, res) => res.send("Welcome to the Wrongs API: We track injustices!"));
    
    app.get("/wrongs", async (req, res) => {
        const data = await db.query("SELECT * FROM wrong");
        res.status(200).send(data.rows);
    });

    app.get("/wrongs/:id", async (req, res) => {
        const id = parseInt(req.params.id);

        const data = await db.query("SELECT * FROM wrong WHERE wrong_id = $1", [id]);
        res.status(200).send(data.rows[0]);
    })

    app.post("/wrongs", async (req, res) => {
        // const { perpetrator_id, victim_id, description, forgiven, forgotten, revenged } = req.body;
        const perpetrator_id = parseInt(req.body.perpetrator_id);
        const victim_id = parseInt(req.body.victim_id);
        const description = req.body.description;
        const forgiven = req.body.forgiven ? "TRUE" : "FALSE";
        const forgotten = req.body.forgotten ? "TRUE" : "FALSE";
        const revenged = req.body.revenged ? "TRUE" : "FALSE";

        try {
            const data = await db.query("INSERT INTO wrong(perpetrator_id, victim_id, description, forgiven, forgotten, revenged)\nVALUES ($1, $2, $3, $4, $5, $6)", [perpetrator_id, victim_id, description, forgiven, forgotten, revenged]);
    
            res.status(200).send("Wrong added\n" + data.rows)
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    })

    app.delete("/wrongs/:id", async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const data = await db.query("DELETE FROM wrong WHERE wrong_id = $1", [id]);
            res.status(200).send("Wrong deleted\n" + data.rows)
        } catch (err) {
            res.status(404).send({error: err.message});
        }
    })

    app.get("/people", async (req, res) => {
        const data = await db.query("SELECT * FROM person");
        res.status(200).send(data.rows);
    })

    app.get("/people/:id", async (req, res) => {
        const id = parseInt(req.params.id);

        // select person by id
        // const data = await db.query(`SELECT * FROM person WHERE person_id = ${id}`); // DON'T DO THIS, RISK OF SQL INJECTION where instead of an actual id, the attacker puts a valid SQL command.

        // Avoid SQL injection with parametrisation
        const data = await db.query("SELECT * FROM person WHERE person_id = $1", [id]) // user input is sent seperately to sql command, database then checks the parameters before putting them into the query.

        res.status(200).send(data.rows[0]);
    })

    app.post("/people", async (req, res) => {
        const { person_name } = req.body;

        try {
            const data = await db.query("INSERT INTO person(person_name)\nVALUES ($1)", [person_name]);
    
            res.status(200).send("Person added\n" + data.rows)
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    })

    app.get("/stats", async (req, res) => {
        try {
            const data = await db.query("SELECT COUNT(*) as total_count, COUNT(*) FILTER (WHERE forgiven = TRUE) as num_forgiven, COUNT(*) FILTER (WHERE forgotten = TRUE) as num_forgotten, COUNT(*) FILTER (WHERE revenged= TRUE) as num_revenged\nFROM wrong");
    
            res.status(200).send(data.rows[0])
        } catch (err) {
            res.status(500).send({error: err.message});
        }
    })
}

setupMiddleware(app);
addRoutes(app);

module.exports = app;
