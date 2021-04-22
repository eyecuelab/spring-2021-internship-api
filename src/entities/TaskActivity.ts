import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./Task";

@Entity()
export class TaskActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dateTime: Date;

  @Column()
  description: string;

  @ManyToOne(() => Task, (task) => task.taskActivities)
  task: Task;
}
