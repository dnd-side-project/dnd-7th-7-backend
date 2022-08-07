import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const isExist = await this.userRepository.findOneBy({
      userId: createUserDto.userId,
    });
    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['Already registered userId'],
        error: 'Forbidden',
      });
    }

    if (!(createUserDto.gender === 'F' || createUserDto.gender === 'M')) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ['gender must be F or M'],
        error: 'Forbidden',
      });
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10); // FIX ME : use env
    const { password, ...result } = await this.userRepository.save(
      createUserDto,
    );
    return result;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const isExist = await this.userRepository.findOneBy({
      userId: updateUserDto.userId,
    });
    if (!isExist) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Register user first'],
        error: 'NotFound',
      });
    }
    if (updateUserDto.userId !== undefined) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: ["Can't update userID"],
        error: 'Forbidden',
      });
    }
    if (updateUserDto.password !== undefined) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10); // FIX ME : use env
    }
    await this.userRepository.update(userId, updateUserDto);
  }

  async remove(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
