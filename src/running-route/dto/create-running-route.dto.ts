import {
  IsString,
  IsArray,
  IsDateString,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';

type eachPoint = {
  latitude: string;
  longitude: string;
};

export class CreateRunningRouteDto {
  @IsString()
  readonly routeName: string;

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

  @IsString()
  readonly routeImage: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly recommendedTags: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly secureTags: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly files: string[];

  @IsOptional()
  readonly mainRoute: number;
}
