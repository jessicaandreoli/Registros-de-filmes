const knex = require("../database/knex");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body;
    const { user_id } = request.params;

    //Inserindo a nota - só retorna o ID da nota- registro, valor da função insert
    const movieNotes_id = await knex("movieNotes").insert({
      title,
      description,
      rating,
      user_id: parseInt(user_id),
    });

    const tagsInsert = tags.map((name) => {
      return {
        movieNotes_id: movieNotes_id[0],
        name,
        user_id: parseInt(user_id),
      };
    });

    await knex("movieTags").insert(tagsInsert);
    console.log(tagsInsert);

    response.json();
  }

  //método para exibir registro específico
  async show(request, response) {
    const { id } = request.params;

    //selecionar a nota referente ao id e trazer a primeira
    const note = await knex("movieNotes").where({ id }).first();
    const tags = await knex("movieTags")
      .where({ movieNotes_id: id })
      .orderBy("name");

    return response.json({
      ...note,
      tags,
    });
  }

  //método para deletar
  async delete(request, response) {
    const { id } = request.params;

    await knex("movieNotes").where({ id }).delete();

    return response.json();
  }

  //método para listar
  async index(request, response) {
    const { title, user_id, tags } = request.query;

    let notes;

    if (tags) {
      //convertendo de um texto simples para um vetor. Convertendo em um arrau, utilizando a vírgula como delimitadora
      const filterTags = tags.split(",").map((tag) => tag.trim());

      notes = await knex("movieTags")
        .select(["movieNotes.id", "movieNotes.title", "movieNotes.user_id"])
        .where("movieNotes.user_id", user_id)
        .whereLike("movieNotes.title", `%${title}%`)
        //Para comparar se o nome passado, existe de fato uma tag igual
        .whereIn("name", filterTags)
        .innerJoin("movieNotes", "movieNotes.id", "movieTags.movieNotes_id");
      knex.orderBy("movieNotes.title");
    } else {
      notes = await knex("movieNotes")
        //mostrar as notas criadas por esse usuário
        .where({ user_id })

        //whereLike - ajuda a buscar por textos que contenham a palavra pesquisada
        //Ao colocar o sinal %, estou dizendo para o banco verificar tanto antes quanto depois.
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    //Pegar por todas as tags, onde o id seja igual ao id do usuário
    const userTags = await knex("movieTags").where({ user_id });

    //Percorrer todas as minhas notas
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.movieNotes_id === note.id);

      return {
        ...note,
        movieTags: noteTags,
      };
    });

    return response.json(notesWithTags);
  }
}

module.exports = MovieNotesController;
