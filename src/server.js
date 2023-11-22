require("express-async-errors"); //Biblioteca para lidar com erros. Coloca aqui no servidor para estar logo no início
const migrationsRun = require("./database/sqlite/migrations"); //conexão com o Banco de Dados - com as migrations
const AppError = require("./utils/AppError"); //Importando o AppError, pois também será usado
const express = require("express"); //Pegando tudo do express de dentro da pasta node modules
const routes = require("./routes/index");

migrationsRun(); //executando o Banco de dados

const app = express(); //inicializando o express
app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
  //não usando o next, pois caso encontre o erro, não quero que faça uma nova ação. Quero que pare aqui.
  if (error instanceof AppError) {
    //se o erro for igual a instância AppError foi gerado pelo cliente
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3333;

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`)); //Fica ouvindo nessa porta;
