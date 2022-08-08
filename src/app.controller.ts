import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './user/auth/auth.service';
import { SignupDto } from './user/dto/auth.dto';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }
}
