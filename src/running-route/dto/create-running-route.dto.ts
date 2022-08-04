import { Type } from 'class-transformer';
import { IsString, IsArray, IsDateString } from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

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

  @IsArray()
  tags: number[];

  @IsFile()
  file: MemoryStoredFile;
}
