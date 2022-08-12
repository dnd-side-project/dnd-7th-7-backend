import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SearchQueryStringDto {
  @IsNumber()
  @Type(() => Number)
  readonly radius: number;

  @IsNumber()
  @Type(() => Number)
  readonly latitude: number;

  @IsNumber()
  @Type(() => Number)
  readonly longitude: number;

  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  readonly recommendedTags: string[];

  @Transform(({ value }) => value.split(','))
  @IsString({ each: true })
  readonly secureTags: string[];
}
