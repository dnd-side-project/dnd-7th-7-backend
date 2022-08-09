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
  readonly distance: string;

  @IsString()
  readonly review: string;

  @IsString()
  readonly firstLocation: string;

  @IsString()
  readonly secondLocation: string;

  @IsString()
  readonly thirdLocation: string;

  @IsDateString()
  readonly runningDate: Date;

  @IsFile()
  readonly routeImage: MemoryStoredFile;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly recommendedTags: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly secureTags: string[];

  @IsArray()
  @IsFile({ each: true })
  @IsOptional()
  readonly files: MemoryStoredFile[];

  @IsOptional()
  readonly mainRoute: number;
}
