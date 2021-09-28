import pg from 'pg'           //to connect postgresql

const { DATABASE_URL, DATABASE_URL_DEV, NODE_ENV } = process.env    // connection pool for postgresql

const isProduction = NODE_ENV === "production";               // deployed to heroku heroku sets  NODE_ENV ==='production'

const connectionString = isProduction ? DATABASE_URL : DATABASE_URL_DEV; //  if deployed to heroku --> heroku connection string 

const sslConfig = isProduction
  ? {
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {};

  const pool = new pg.Pool({
    connectionString,
    ...sslConfig,
  });
  
  export default pool;