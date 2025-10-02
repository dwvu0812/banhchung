import { Controller, Get, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {
    // This route initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const loginResult = await this.authService.login(req.user);
    const frontendUrl = this.configService.get('FRONTEND_URL');
    
    // Redirect to frontend with token
    res.redirect(
      `${frontendUrl}/auth/callback?token=${loginResult.access_token}&user=${encodeURIComponent(JSON.stringify(loginResult.user))}`
    );
  }
}