import { ContractType } from "src/contractType/models/contractType.entity";
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  accountId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  label: string;

  @ManyToOne(() => ContractType, { eager: true })
  contractType: ContractType;

  @Column({ nullable: true })
  status: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
