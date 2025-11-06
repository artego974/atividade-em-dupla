import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Empresa } from "./empresa";
import { User } from "./user";

@Entity("vaga")
export class Vaga {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  titulo!: string;

  @Column({ type: "text" })
  descricao!: string;

  @Column({ type: "varchar", length: 255 })
  localizacao!: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.vagas, { onDelete: "CASCADE" })
  empresa!: Empresa;

  @ManyToMany(() => User, (user) => user.vagas)
  @JoinTable({
    name: "usuario_vaga",
    joinColumn: { name: "vaga_id" },
    inverseJoinColumn: { name: "user_id" },
  })
  candidatos!: User[];

  constructor(titulo?: string, descricao?: string, localizacao?: string) {
    if (titulo) this.titulo = titulo;
    if (descricao) this.descricao = descricao;
    if (localizacao) this.localizacao = localizacao;
  }
}
