import { Field } from "src/fields/models/field.entity";
import { Clause } from "src/clause/models/clause.entity";
import { ContractStatus } from "src/utils/contractStatues";
import { Comment } from "src/comment/models/comment.entity";
import { Addendum } from "src/addendum/models/addendum.entity";
import { Component } from "src/component/models/component.entity";
import { ContractType } from "src/contractType/models/contractType.entity";
import {
  Column,
  Entity,
  OneToOne,
  JoinTable,
  OneToMany,
  JoinColumn,
  ManyToMany,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { AdditionalFields } from "src/additional-fields/model/additional-fields.entity";

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  intendedAccountHolder: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  accountId: number;

  @Column({ nullable: true })
  createdById: number;

  @Column({ nullable: true })
  modifiedById: number;

  @Column({ nullable: false, type: "enum", default: ContractStatus.DRAFT, enum: ContractStatus })
  status: ContractStatus;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true, default: "v1" })
  version: string;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  referenceId: number;

  @Column({ nullable: true })
  legalEntity: string;

  @Column({ nullable: true })
  originalCompany: string;

  @Column({ nullable: true })
  termType: string;

  @Column({ nullable: true })
  originalExpDate: Date;

  @Column({ nullable: true })
  effectiveDate: Date;

  @Column({ nullable: true })
  currentExpDate: Date;

  @Column({ nullable: true })
  renewalInterval: number;

  @Column({ nullable: true })
  termStatus: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  // OTHER TABLES
  @ManyToOne(() => ContractType, { eager: true })
  contractType: ContractType;

  @OneToMany(() => Component, (component) => component.contract)
  components: Component[];

  @OneToMany(() => Comment, (comment) => comment.contract)
  comments: Comment[];

  @ManyToMany(() => Field, { cascade: true })
  fields: Field[];

  @ManyToMany(() => Clause, { cascade: true })
  clauses: Clause[];

  @OneToMany(() => Addendum, (addendum) => addendum.contract)
  addendums: Addendum[];

  @OneToOne(() => AdditionalFields, (additionalField) => additionalField.contract)
  additionalFields: AdditionalFields[];
}
