const express = require("express");
const cors = require("cors");

const app = express();

// middleware
function setupMiddleware(app) {
    app.use(express.json);
    app.use(cors);
}

function addRoutes(app) {
    app.get("/", (req, res) => res.send("Welcome to the Wrongs API: We track injustices!"))
}

setupMiddleware(app);
addRoutes(app);

module.exports = app;
