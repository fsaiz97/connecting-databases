// Pool is a pool of managed connections, pg manages our connections
const { Pool } = require("pg");

const db = new Pool({
    connectionString: process.env.DB_URL
})

module.exports = db;
