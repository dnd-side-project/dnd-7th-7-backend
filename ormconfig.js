module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: process.env.MYSQLDB_PORT,
    username: process.env.MYSQLDB_USER,
    password: process.env.MYSQLDB_PASSWORD,
    database: process.env.MYSQLDB_DATABASE,
    entities: ['dist/**/*.entity.js'],
    synchronize: true, // Fix me : set this value to false when deploy
};
