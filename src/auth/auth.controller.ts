import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, Delete, Patch, Param, ParseUUIDPipe, Get, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @Auth(ValidRoles.admin)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Get('usuarios')
  @Auth(ValidRoles.admin)
  findAllUsers() {
    return this.authService.findAllUsers();
  }
  @Delete(':id/delete')
  @Auth(ValidRoles.admin)
  deleteUser(@Param('id', ParseUUIDPipe) idUser: string) {
    return this.authService.deleteUser(idUser);
    // return idUser;
  }
  @Patch(':id/update')
  @Auth(ValidRoles.admin)
  updateUser(@Param('id', ParseUUIDPipe) idUser: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(idUser, updateUserDto);
    // return idUser;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    console.log({ loginUserDto })
    const auth = await this.authService.login(loginUserDto);
    console.log({ auth })
    return auth;
  }

  @HttpCode(HttpStatus.OK)
  @Post('token/renew')
  async tokenRenew(@Body('idToken') idToken: string) {
    if (!idToken) {
      throw new UnauthorizedException('Token no proporcionado');
    }
    //
    const user = await this.authService.renewToken(idToken);
    return user;
  }
}
