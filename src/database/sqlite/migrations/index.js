const sqliteConnection = require("../../sqlite");
const createUsers = require("./createUsers");

//Criando função para executar a migrations
async function migrationsRun() {
  const schemas = [
    //Aqui dentro vou colocando todas as migrations criadas
    createUsers,
  ].join(""); //.join para remover juntar todas as migrations
  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((error) => console.error(error));
}

module.exports = migrationsRun;
