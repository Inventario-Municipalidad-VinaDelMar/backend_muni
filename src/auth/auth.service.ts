import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './interfaces';
import { LoginUserDto } from './dto/login-user.dto';

import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
  }
  async findAllUsers(showAll: boolean = false) {
    try {

      const usuarios = await this.userRepository.find({
        where: {
          isActive: !showAll,
        }
      });
      return usuarios;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }
  async deleteUser(idUser: string) {
    try {
      const userData = await this.userRepository.findOneBy({ id: idUser });
      if (!userData) {
        throw new NotFoundException(`El usuario con id ${idUser} no existe.`)
      }
      userData.isActive = false;
      const user = await this.userRepository.save(userData);
      return user;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }
  async updateUser(idUser: string, updateUserDto: UpdateUserDto) {
    try {
      const userData = await this.userRepository.findOneBy({ id: idUser });
      if (!userData) {
        throw new NotFoundException(`El usuario con id ${idUser} no existe.`)
      }
      // Itera sobre las propiedades de updateUserDto y actualiza solo si están definidas.
      for (const [key, value] of Object.entries(updateUserDto)) {
        if (value !== undefined) {
          if (key === 'password') {
            userData.password = bcrypt.hashSync(value, 10); // Hashear solo si es la contraseña
          } else {
            userData[key] = value;
          }
        }
      }

      const user = await this.userRepository.save(userData);
      return user;
    } catch (error) {
      this.handleDbErrors(error);
    }
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
          isActive: true,
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
      if (!user) {
        throw new UnauthorizedException('Credenciales no validas');
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credenciales no validas');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
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

  async renewToken(idToken: string) {
    try {
      // Verificar el token (aunque esté caducado)
      const payload = this.jwtService.decode(idToken) as JwtPayload;

      if (!payload || !payload.id) {
        throw new UnauthorizedException('Token no válido');
      }

      const user = await this.getUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('Usuario inactivo');
      }
      // Generar un nuevo token JWT
      const newToken = this.getjwtToken({ id: user.id });

      // Devolver el usuario y el nuevo token
      delete user.password;
      delete user.isActive;
      return {
        ...user,
        token: newToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token no válido');
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
