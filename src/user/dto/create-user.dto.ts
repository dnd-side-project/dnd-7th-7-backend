import { IsDateString, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly nickname: string;

  @IsString()
  readonly userId: string;

  @IsString()
  password: string;

  @IsDateString()
  readonly birthDate: Date;

  @IsString()
  readonly gender: string;

  @IsString()
  readonly address: string;
}
