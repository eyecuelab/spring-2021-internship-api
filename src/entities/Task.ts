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

  @Column("text")
  taskDesc: string;

  @Column()
  position: number;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: Project;

  @OneToMany(() => TaskActivity, (activity) => activity.task, {
    eager: true,
  })
  activity: TaskActivity;
}
