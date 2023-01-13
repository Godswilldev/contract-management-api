import { Contract } from "src/contract/models/contract.entity";
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
import { Clause } from "./clause.entity";

@Entity()
export class ClauseTemplates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  accountId: number;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  fileUrl: string;

  @ManyToOne(() => Contract, (contract) => contract.clauseTemplates)
  contract: Contract;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
