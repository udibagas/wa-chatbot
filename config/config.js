require("dotenv").config();

const config = {
  development: {
    username: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "wa_chatbot",
    host: process.env.PGHOST || "localhost",
    dialect: "postgres",
    port: +process.env.PGPORT || 5432,
    // logging: true,
  },
  test: {
    username: "postgres",
    password: "postgres",
    database: "wa_chatbot_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: +process.env.PGPORT || 5432,
    dialect: "postgres",
    logging: false,
  },
};

module.exports = config;
