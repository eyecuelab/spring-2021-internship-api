import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Length } from "class-validator";
import { Task } from "./Task";
import { Item } from "./Item";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  projectName: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  uuid: string;

  @Column("decimal", { precision: 8, scale: 2, nullable: true })
  hourly: number;

  @Column("decimal", { precision: 8, scale: 2, nullable: true })
  units: number;

  @Column("decimal", { precision: 8, scale: 2, nullable: true })
  markup: number;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task;

  @OneToMany(() => Item, (item) => item.project)
  items: Item;
}
