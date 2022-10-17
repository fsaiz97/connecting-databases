require("dotenv").config(); // Loads environment variables

const app = require("./app");

const port = process.env.PORT
// const port = 3001;

app.listen(port, () => console.log(`API listening on port ${port}...`));
