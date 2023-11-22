//Arquivo para reunir todas as rotas da aplicação;
const { Router } = require("express");

const usersRouter = require("./user.routes");
const notesRouter = require("./movieNotes.routes");
const tagsRouter = require("./tagsNotes.routes");

const routes = Router();

routes.use("/users", usersRouter); //Todas as vezes que alguém acessar /users, vai ser direcionado para o caminho usersRouter
routes.use("/notes", notesRouter);
routes.use("/tags", tagsRouter);

module.exports = routes;
