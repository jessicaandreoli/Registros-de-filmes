const config = require("../../../knexfile");
const knex = require("knex");

//Criando a conexão

const connection = knex(config.development);

module.exports = connection;
