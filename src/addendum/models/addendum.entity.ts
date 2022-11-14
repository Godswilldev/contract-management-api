import { Contract } from "src/contract/models/contract.entity";
import { ContractType } from "src/contractType/models/contractType.entity";
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Addendum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  expirationEmail: string;

  @Column({ nullable: true })
  effectiveDate: Date;

  @Column({ nullable: true })
  expirationDate: Date;

  @ManyToOne(() => Contract, (contract) => contract.addendums)
  contract: Contract;

  @ManyToOne(() => ContractType, { eager: true })
  contractType: ContractType;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
