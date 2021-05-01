import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// https://orkhan.gitbook.io/typeorm/docs/validation
// https://github.com/typestack/class-validator
import { Length, IsEmail } from "class-validator";

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
  @IsEmail()
  email: string;

  @Column()
  uuid: string;
}
