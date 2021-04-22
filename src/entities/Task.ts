import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Length } from "class-validator";
import { Project } from "./Project";
import { TaskActivity } from "./TaskActivity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  taskName: string;

  @Column()
  taskStatus: string;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @OneToMany(() => TaskActivity, (taskActivity) => taskActivity.task)
  taskActivities: TaskActivity;
}
