import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsNumber, IsInt, Length, Min } from "class-validator";
import { Project } from "./Project";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  itemName: string;

  @Column({ nullable: true })
  @Min(0)
  @IsNumber()
  itemPrice: number;

  @Column({ nullable: true })
  @Min(1)
  @IsInt()
  quantity: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  @IsNumber()
  minutes: number;

  @Column()
  @IsNumber()
  hours: number;

  @ManyToOne(() => Project, (project) => project.items)
  project: Project;
}
