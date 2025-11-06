import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Empresa } from "../model/empresa";
import { Vaga } from "../model/vaga";
import bcrypt from "bcryptjs";

const empresaRepository = AppDataSource.getRepository(Empresa);
const vagaRepository = AppDataSource.getRepository(Vaga);

export class EmpresaController {
  async list(req: Request, res: Response) {
    const empresas = await empresaRepository.find({
      relations: ["vagas"],
    });
    res.status(200).json(empresas);
  }


  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ mensagem: "Preencha todos os campos!" });
        return;
      }

      const existingEmpresa = await empresaRepository.findOneBy({ email });
      if (existingEmpresa) {
        res.status(400).json({ mensagem: "Email já cadastrado!" });
        return;
      }

      const newEmpresa = new Empresa(name, email, password);
      const empresa = empresaRepository.create(newEmpresa);
      await empresaRepository.save(empresa);

      res.status(201).json(empresa);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: "Erro ao criar empresa." });
    }
  }


  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const empresa = await empresaRepository.findOneBy({ id: Number(id) });
    if (!empresa) {
      res.status(404).json({ mensagem: "Empresa não encontrada!" });
      return;
    }

    await empresaRepository.remove(empresa);
    res.status(204).send();
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
      return;
    }

    const empresa = await empresaRepository.findOneBy({ email });
    if (!empresa) {
      res.status(401).json({ mensagem: "Empresa não encontrada." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, empresa.password);
    if (!isPasswordValid) {
      res.status(401).json({ mensagem: "Senha inválida." });
      return;
    }

    const { password: _, ...empresaData } = empresa;
    res
      .status(200)
      .json({ mensagem: "Login realizado com sucesso!", empresa: empresaData });
  }

  async createVaga(req: Request, res: Response) {
    try {
      const { empresaId } = req.params;
      const { titulo, descricao, localizacao } = req.body;

      const empresa = await empresaRepository.findOneBy({
        id: Number(empresaId),
      });
      if (!empresa) {
        res.status(404).json({ mensagem: "Empresa não encontrada!" });
        return;
      }

      if (!titulo || !descricao || !localizacao) {
        res.status(400).json({ mensagem: "Preencha todos os campos!" });
        return;
      }

      const vaga = vagaRepository.create({
        titulo,
        descricao,
        localizacao,
        empresa,
      });
      await vagaRepository.save(vaga);

      res.status(201).json({ mensagem: "Vaga criada com sucesso!", vaga });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: "Erro ao criar vaga." });
    }
  }
  async uploadAvatar(req: Request, res: Response): Promise<void> {
          try {
              const { id } = req.params;
  
              const empresa = await empresaRepository.findOneBy({ id: Number(id) });
              if (!empresa) {
                  res.status(404).json({ error: "Usuário não encontrado." });
                  return;
              }
  
              if (!req.file) {
                  res.status(400).json({ error: "Nenhum arquivo enviado." });
                  return;
              }
  
              // Atualiza o caminho da foto de perfil no banco
              empresa.fotoPerfil = `../../src/middlewares/upload/${req.file.filename}`;
  
              await empresaRepository.save(empresa);
  
              res.status(200).json({
                  message: "Foto de perfil atualizada com sucesso!",
                  fotoPerfil: empresa.fotoPerfil,
                  empresa
              });
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: "Erro ao atualizar foto de perfil." });
          }
      }
}
