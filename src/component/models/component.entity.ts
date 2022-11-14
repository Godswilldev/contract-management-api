import { Contract } from "src/contract/models/contract.entity";
import {
  UpdateDateColumn,
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Component {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  unit: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => Contract, (contract) => contract.components)
  contract: Contract;
}
