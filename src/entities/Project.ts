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

  @Column()
  hourly: number;

  @Column()
  units: number;

  @Column()
  markup: number;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task;

  @OneToMany(() => Item, (item) => item.project)
  items: Item;
}
