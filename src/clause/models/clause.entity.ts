import { ContractType } from "src/contractType/models/contractType.entity";
import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

@Entity()
export class Clause {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  accountId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  clauseType: string;

  @Column({ nullable: true, type: "text" })
  content: string;

  @ManyToOne(() => ContractType, { eager: true })
  contractType: ContractType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
