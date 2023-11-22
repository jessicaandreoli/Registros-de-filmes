//Todos os arquivos dentro de Controller são responsáveis por processar as requisições

const { hash, compare } = require("bcryptjs"); //Para criptografia de senha e o compare para verificar senha digitada com senha criptografada
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

//Usando a classe pois ela permite usar vários métodos/funções dentro dela
class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name) {
      throw new AppError("O nome é obrigatório!");
    }

    if (!email) {
      throw new AppError("O email é obrigatório!");
    }

    if (!password) {
      throw new AppError("A senha é obrigatória!");
    }

    const database = await sqliteConnection();

    //Verificando se o email já existe no Banco de Dados
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("Esse e-mail já está cadastrado no sistema");
    }

    //Primeiro fator dentro do hash é o que quero criptografar e o segundo é o grau de complexidade
    const hashedPassword = await hash(password, 8);

    //inserindo na tabela usuário nome, email e senha
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password: new_password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdateEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    //Existe um email que estou tentando definir, sendo que o id do dono é diferente do meu id
    if (userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso");
    }

    //Se existir algo dentro de nome ok, se não substitua pelo user.name. Isso é para não acontecer de o usuário atualizar a senha e o nome e email sumirem do Banco de Dados.
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    //Atualizar senha

    //Se o usuário digitou a senha nova mas não digitou a antiga
    if (new_password && !old_password) {
      throw new AppError(
        "Você precisa digitar a senha antiga para definir a nova senha"
      );
    }

    if (new_password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      console.log(user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(new_password, 8);
    }

    await database.run(
      `
    UPDATE users SET 
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
      [user.name, user.email, user.password, id]
    );
    return response.json();
  }
}

module.exports = UsersController;
