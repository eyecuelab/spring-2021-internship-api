import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import {
  IsNumber,
  IsInt,
  Length,
  Min,
  IsOptional,
  IsNumberString,
} from "class-validator";
import { Project } from "./Project";
// import { Transform } from "node:stream";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  itemName: string;

  @Column("decimal", { nullable: true })
  @IsOptional()
  @IsNumberString()
  itemPrice: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumberString()
  quantity: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  date: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumberString()
  minutes: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumberString()
  hours: number;

  @ManyToOne(() => Project, (project) => project.items, { onDelete: "CASCADE" })
  project: Project;
}
