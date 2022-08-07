import {
  IsString,
  IsArray,
  IsDateString,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';
import { IsFile, MemoryStoredFile } from 'nestjs-form-data';

type eachPoint = {
  latitude: string;
  longitude: string;
};

export class CreateRunningRouteDto {
  @IsArray()
  @ArrayMinSize(2)
  readonly arrayOfPos: eachPoint[];

  @IsString()
  readonly runningTime: string;

  @IsString()
  readonly review: string;

  @IsString()
  readonly location: string;

  @IsDateString()
  readonly runningDate: Date;

  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];

  @IsFile()
  readonly routeImage: MemoryStoredFile;

  @IsArray()
  @IsFile({ each: true })
  @IsOptional()
  readonly files: MemoryStoredFile[];
}
