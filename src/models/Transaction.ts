import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from "typeorm";
import Category from "./Category";

@Entity("transactions")
class Transaction {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "title",
    type: "varchar"
  })
  title: string;

  @Column({
    name: "type",
    type: "varchar"
  })
  type: 'income' | 'outcome';

  @Column({
    name: "value",
    type: "integer",
  })
  value: number;

  @Column({
    name: "category_id",
    type: "varchar"
  })
  category_id: string;

  @JoinColumn({
    name: "category_id",
  })
  @ManyToOne(() => Category, {
    cascade: ["insert", "update"],
    nullable: true
  })
  category: Category;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp"
  })
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp"
  })
  updated_at: Date;
}

export default Transaction;
