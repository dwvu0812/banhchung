import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  googleId?: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}