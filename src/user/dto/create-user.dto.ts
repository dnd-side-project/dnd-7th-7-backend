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
  @IsOptional()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly nickname: string;

  @IsString()
  readonly userId: string;

  @IsString()
  password: string;

  @IsDateString()
  @IsOptional()
  readonly birthDate: Date;

  @IsString()
  @IsOptional()
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
}
