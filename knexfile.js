const path = require("path");
//Usando o path para resolver o endereço do banco para os diferentes sistemas operacionais

//Arquivo de configuração do Knex
module.exports = {
  development: {
    //Qual o tipo de Banco de Dados
    client: "sqlite3",
    connection: {
      //filename: "./dev.sqlite3",
      //pedindo p path resolver o caminho, dirname(partindo desse local)
      filename: path.resolve(__dirname, "src", "database", "database.db"),
    },
    pool: {
      //habilitando a função para deletar em cascata
      //conn=conection / cb=calback
      afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON", cb),
    },
    migrations: {
      directory: path.resolve(
        __dirname,
        "src",
        "database",
        "knex",
        "migrations"
      ),
    },
    //Acrescentado, padrão para lidar com sqlite
    useNullAsDefault: true,
  },
};
