import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interfaces';
import { LoginUserDto } from './dto/login-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
  }
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getjwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }
  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }
  private getjwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        select: {
          email: true,
          password: true,
          id: true,
          rut: true,
          nombre: true,
          apellidoPaterno: true,
          apellidoMaterno: true,
          imageUrl: true,
          roles: true,
        },
      });
      console.log({ user });
      if (!user) {
        throw new UnauthorizedException('Credenciales no validas');
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credenciales no validas');
      }
      delete user.password
      delete user.isActive
      return {
        ...user,
        token: this.getjwtToken({ id: user.id }),
      };
    } catch (error) {
      throw error;
      // throw new BadRequestException(error.message);
      // return error;
      // this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    console.log(error);

    throw new InternalServerErrorException(
      'Ocurrio un error no controlado, mirar los Logs.',
    );
  }

  async deleteAll() {
    const query1 = this.userRepository.createQueryBuilder('users');
    try {
      await query1.delete().where({}).execute();
      return;
    } catch (error) {
      throw error;
    }
  }
}
