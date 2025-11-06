import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Vaga } from "./vaga";

@Entity("user")
export class User {
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

  @ManyToMany(() => Vaga, (vaga) => vaga.candidatos)
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
