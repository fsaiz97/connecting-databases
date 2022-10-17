require("dotenv").config(); // Loads environment variables

const app = require("./app");

const port = process.env.PORT

app.listen(port, () => {
    console.log(`API listening on port ${port}`)
})
