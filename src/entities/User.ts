import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// https://orkhan.gitbook.io/typeorm/docs/validation
// https://github.com/typestack/class-validator
import { IsInt, Length, IsEmail, Min, Max } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2)
  firstName: string;

  @Column()
  @Length(2)
  lastName: string;

  @Column()
  @IsInt()
  @Min(0)
  @Max(120)
  age: number;

  @Column()
  @IsEmail()
  email: string;
}
