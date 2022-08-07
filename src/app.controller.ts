import { Controller, Post } from '@nestjs/common';
import { AuthService } from './user/auth/auth.service';

@Controller('auth')
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup() {
    return this.authService.signup();
  }
}
