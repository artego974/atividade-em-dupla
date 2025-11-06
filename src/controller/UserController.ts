import { Request, Response } from "express";
import { User } from "../model/user";
import { AppDataSource } from "../config/data-source";
import bcrypt from "bcryptjs";


const userRepository = AppDataSource.getRepository(User);
export class UserController {
  async list(req: Request, res: Response) {
    const user = await userRepository.find();
    res.json(user);
    return;
  }

  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (name == "" || password == "" || email == "") {
      res.status(400).json({ mensagem: "Preencha todos os campos!" });
      return;
    } else {
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        res.status(400).json({ mensagem: "Email já cadastrado!" });
        return;
      }
      const newUser = new User(name, email, password);
      const user = userRepository.create(newUser);
      await userRepository.save(user);
      res.status(201).json(user);
      return;
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = Number(id);

      // ✅ Validação extra
      if (isNaN(userId)) {
        return res.status(400).json({ mensagem: "ID inválido" });
      }

      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["vagas"],
      });

      if (!user) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
      }

      await userRepository.remove(user);
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).json({ mensagem: "Erro ao deletar usuário" });
    }
  }

  async show(req: Request, res: Response) {
    const { name } = req.body;
    const user = await userRepository.findOneBy({ name });

    if (!user) {
      res.status(404).json({ menssagem: "User não encontrado!" });
      return;
    }
    res.status(200).json(user);
    return;
  }

  async updatePassword(req: Request, res: Response) {
    const { id } = req.params;
    const { password, newPassword } = req.body;

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ menssagem: "User não encontrado!" });
      return;
    }

    if (!newPassword || !password) {
      res.status(400).json({ message: "Insira todos campos!" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ message: "Senha invalida!" });
      return;
    }

    user.password = newPassword;

    await userRepository.save(user);
    res.status(200).json(user);
    return;
  }

  async updateEmail(req: Request, res: Response) {
    const { id } = req.params;
    const { password, newEmail } = req.body;

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      res.status(404).json({ menssagem: "User não encontrado!" });
      return;
    }

    if (!newEmail || !password) {
      res.status(400).json({ message: "Insira todos campos!" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      res.status(401).json({ message: "Senha invalida!" });
      return;
    }

    user.email = newEmail;

    await userRepository.save(user);
    res.status(200).json(user);
    return;
  }

  // Método para logar no site
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    //verifica se ambos campos foram fornecidos
    if (!email || !password) {
      res.status(400).json({ message: "Email e senha são necessarios." });
      return;
    }

    try {
      // Busca o usuário no banco de dados pelo email
      const user = await userRepository.findOneBy({ email });
      console.log(user);

      // Se não encontrar o usuário
      if (!user) {
        res.status(401).json({ message: "Usuario não encontrado." });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      // Se a senha não for válida
      if (!isPasswordValid) {
        res.status(401).json({ message: "Senha invalida." });
        return;
      }

      const { password: _, ...userData } = user;
      res.status(200).json({
        message: "Logado com sucesso.",
        user: userData,
      });
    } catch (error) {
      console.error("Erro ao logar no user:", error);
      res.status(500).json({ message: "Erro bizonho ou erro de server." });
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: "Logout successful." });
  }

  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await userRepository.findOneBy({ id: Number(id) });
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado." });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: "Nenhum arquivo enviado." });
        return;
      }

      // Atualiza o caminho da foto de perfil no banco
      user.fotoPerfil = `../../src/middlewares/upload/${req.file.filename}`;

      await userRepository.save(user);

      res.status(200).json({
        message: "Foto de perfil atualizada com sucesso!",
        fotoPerfil: user.fotoPerfil,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar foto de perfil." });
    }
  }
}