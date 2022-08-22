import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { DeleteBookmarkDto } from './dto/delete-bookmark.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Put(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.userService.update(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/bookmark/getAll')
  getBookmarks(@Req() req) {
    return this.userService.getBookmarks(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookmark/create')
  async createBookmark(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @Req() req,
  ) {
    return await this.userService.createBookmark(
      createBookmarkDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('bookmark/delete')
  async deleteBookmark(
    @Body() deleteBookmarkDto: DeleteBookmarkDto,
    @Req() req,
  ) {
    return await this.userService.deleteBookmark(
      deleteBookmarkDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/getUseRecommended')
  getUseRecommended(@Req() req) {
    return this.userService.getUseRecommended(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/increaseUseRecommended')
  increaseUseRecommended(@Req() req) {
    return this.userService.increaseUseRecommended(req.user.userId);
  }
}
