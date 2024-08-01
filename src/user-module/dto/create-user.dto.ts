import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;
}
