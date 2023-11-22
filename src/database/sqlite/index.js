const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path");

//Função assíncrona, pois como vou lidar com conexão com banco de dados no momento que a aplicação iniciar,
//se o arquivo do BD não existir, ela vai criar

async function sqliteConnection() {
  const database = await sqlite.open({
    //1º: Aonde quero salvar o arquivo do database
    //filename: "../../database" - Poderia salvar assim, mas a estrutura de pasta funciona diferente em navegadores diferentes,
    //Por isso o uso do path que estou importando em cima

    //Dirname, pega aonde estou no projeto, ".."- volta uma pasta para trás e cria o arquivo database.db se ele não existir
    filename: path.resolve(__dirname, "..", "database.db"),

    //qual drive de conexão que vou urilizar
    driver: sqlite3.Database,
  });

  return database;
}

module.exports = sqliteConnection;
