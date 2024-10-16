import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
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

    const user = await this.authService.renewToken(idToken);
    return user;
  }
}
