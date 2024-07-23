import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto | UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = hashSync(createUserDto.password, 10);
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  findById(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  remove(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
