import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookmarkDto {
  @IsNumber()
  @IsNotEmpty()
  runningRoute: number;
}
