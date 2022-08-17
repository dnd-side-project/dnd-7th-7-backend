import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class LocationQueryStringDto {
  @IsNumber()
  @Type(() => Number)
  readonly latitude: number;

  @IsNumber()
  @Type(() => Number)
  readonly longitude: number;
}
