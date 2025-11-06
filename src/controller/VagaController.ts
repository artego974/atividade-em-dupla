import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Vaga } from "../model/vaga";
import { User } from "../model/user";

const vagaRepository = AppDataSource.getRepository(Vaga);
const userRepository = AppDataSource.getRepository(User);

export class VagaController {
  async list(req: Request, res: Response) {
    const vagas = await vagaRepository.find({
      relations: ["empresa", "candidatos"],
    });
    res.status(200).json(vagas);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const vaga = await vagaRepository.findOne({
      where: { id: Number(id) },
      relations: ["empresa", "candidatos"],
    });

    if (!vaga) {
      res.status(404).json({ mensagem: "Vaga não encontrada!" });
      return;
    }

    res.status(200).json(vaga);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const vaga = await vagaRepository.findOneBy({ id: Number(id) });
    if (!vaga) {
      res.status(404).json({ mensagem: "Vaga não encontrada!" });
      return;
    }

    await vagaRepository.remove(vaga);
    res.status(204).send();
  }

  async apply(req: Request, res: Response) {
    try {
      const { userId, vagaId } = req.params;

      const user = await userRepository.findOne({
        where: { id: Number(userId) },
        relations: ["vagas"],
      });

      const vaga = await vagaRepository.findOne({
        where: { id: Number(vagaId) },
        relations: ["candidatos"],
      });

      if (!user || !vaga) {
        res.status(404).json({ mensagem: "Usuário ou vaga não encontrados." });
        return;
      }

      // Impede candidatura duplicada
      if (user.vagas.some((v) => v.id === vaga.id)) {
        res
          .status(400)
          .json({ mensagem: "Usuário já se candidatou a esta vaga." });
        return;
      }

      user.vagas.push(vaga);
      await userRepository.save(user);

      res.status(200).json({ mensagem: "Candidatura realizada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensagem: "Erro ao se candidatar à vaga." });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { titulo, descricao, localizacao } = req.body;

    try {
      const vaga = await vagaRepository.findOneBy({ id: Number(id) });

      if (!vaga) {
        return res.status(404).json({ message: "Vaga não encontrada" });
      }

      vaga.titulo = titulo || vaga.titulo;
      vaga.descricao = descricao || vaga.descricao;
      vaga.localizacao = localizacao || vaga.localizacao;

      await vagaRepository.save(vaga);
      return res.status(200).json(vaga);
    } catch (error) {
      console.error("Erro ao atualizar vaga:", error);
      return res.status(500).json({ message: "Erro ao atualizar vaga" });
    }
  }
}