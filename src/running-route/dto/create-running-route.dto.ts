import { Type } from 'class-transformer';
import { IsString, IsArray, IsNumber, IsDateString } from 'class-validator';

class location {
  public latitude: string;
  public longitude: string;
}

export class CreateRunningRouteDto {
  @IsArray()
  @Type(() => location)
  readonly arrayOfPos: location[];

  @IsString()
  readonly runningTime: string;

  @IsString()
  review: string;

  @IsDateString()
  runningDate: Date;

  @IsNumber({}, { each: true })
  tags: number[];
}
