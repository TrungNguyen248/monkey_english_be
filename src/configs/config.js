const config = {
  app: {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  openApi: {
    enable: process.env.OPEN_API_ENABLE,
    title: process.env.OPEN_API_TITLE,
    version: process.env.OPEN_API_VERSION,
    description: process.env.OPEN_API_DESCRIPTION,
  },
};

module.exports = config;
