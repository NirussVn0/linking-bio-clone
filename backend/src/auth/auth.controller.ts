import { Controller, Get, Post, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserDocument } from '../schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Initiates Discord OAuth flow
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordCallback(@Req() req: any, @Res() res: Response) {
    const user: UserDocument = req.user;
    const token = await this.authService.generateJwtToken(user);
    
    // Set HTTP-only cookie
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/auth/success`);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    return req.user;
  }
}
