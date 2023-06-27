import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './current-user.decorator';
import { DocumentType } from '@typegoose/typegoose';
import { User } from 'src/user/entities/user.entity';
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Get('getUserInfo')
  @UseGuards(AuthGuard('jwt'))
  getUserInfo(@CurrentUser() user: DocumentType<User>) {
    return user;
  }
  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  logOut(@CurrentUser() user: DocumentType<User>) {
    return this.authService.logOut(user);
  }
}
