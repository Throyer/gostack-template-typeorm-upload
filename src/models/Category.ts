import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity("categories")
class Category {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "title",
    type: "varchar",
    unique: true,
  })
  title: string;

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

export default Category;
