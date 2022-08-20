import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteBookmarkDto {
  @IsNumber()
  @IsNotEmpty()
  runningRoute: number;
}
