exports.up = (knex) =>
  knex.schema.createTable("movieTags", (table) => {
    table.increments("id");
    table.text("name").notNullable();
    table
      .integer("movieNotes_id")
      .references("id")
      .inTable("movieNotes")
      //ao deletar a nota, a tag automaticamente será deletada.
      .onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("movieTags");
