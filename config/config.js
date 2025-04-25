const config = {
  development: {
    username: "postgres",
    password: "postgres",
    database: "wa_chatbot",
    host: "127.0.0.1",
    dialect: "postgres",
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
    dialect: "postgres",
  },
};

module.exports = config;
