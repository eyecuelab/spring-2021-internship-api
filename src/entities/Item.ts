import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IsNumber, Length, IsOptional } from "class-validator";
import { Project } from "./Project";

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 20)
  itemName: string;

  @Column("decimal", { precision: 8, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  itemPrice: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @Column()
  category: string;

  @Column({ nullable: true })
  date: string;

  @Column("decimal", { precision: 8, scale: 2, nullable: true })
  @IsOptional()
  @IsNumber()
  hours: number;

  @ManyToOne(() => Project, (project) => project.items, { onDelete: "CASCADE" })
  project: Project;
}
