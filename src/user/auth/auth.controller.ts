import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup();
  }
}
