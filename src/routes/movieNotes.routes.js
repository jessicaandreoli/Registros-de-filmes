const { Router } = require("express");

const notesRoutes = Router();

const MovieNotesController = require("../controllers/MovieNotesController");

const movieNotesController = new MovieNotesController();

notesRoutes.get("/", movieNotesController.index);
notesRoutes.post("/:user_id", movieNotesController.create);
notesRoutes.get("/:id", movieNotesController.show);
notesRoutes.delete("/:id", movieNotesController.delete);

module.exports = notesRoutes;
