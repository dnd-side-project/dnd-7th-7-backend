import { IsString } from 'class-validator';

export class CityQueryStringDto {
  @IsString()
  readonly city: string;

  @IsString()
  readonly state: string;
}
