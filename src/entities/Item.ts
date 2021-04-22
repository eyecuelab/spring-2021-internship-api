import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsNumber, IsInt, IsDate, Length, Min } from "class-validator";
import { Project } from "./Project";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  itemName: string;

  @Column()
  @Min(0)
  @IsNumber()
  itemPrice: number;

  @Column()
  @Min(1)
  @IsInt()
  quantity: number;

  @Column()
  category: string;

  @Column()
  @IsDate()
  date: Date;

  @Column()
  @Min(0)
  @IsInt()
  minutes: number;

  @ManyToOne(() => Project, (project) => project.items)
  project: Project;
}
