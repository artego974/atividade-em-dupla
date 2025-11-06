import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Vaga } from "./vaga";

@Entity("empresa")
export class Empresa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  password!: string;

  @Column({ type: "varchar", default: "../../assets" })
  fotoPerfil!: string;

  // --- Relação: Empresa tem várias vagas
  @OneToMany(() => Vaga, (vaga) => vaga.empresa)
  vagas!: Vaga[];

  private originalPassword!: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.originalPassword = password;
  }

  @AfterLoad()
  setOriginalPassword() {
    this.originalPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password !== this.originalPassword) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
