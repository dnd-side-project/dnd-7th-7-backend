import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsOptional()
  readonly city: string;

  @IsString()
  @IsOptional()
  readonly state: string;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly recommendedTags: number[];

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  readonly secureTags: number[];

  @IsEmail()
  readonly email: string;
}
