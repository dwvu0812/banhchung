import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('progress')
  async getUserProgress(@Request() req) {
    return this.userService.getUserProgress(req.user.id);
  }

  @Get('due-vocabulary')
  async getDueVocabulary(@Request() req) {
    return this.userService.getDueVocabulary(req.user.id);
  }

  @Post('progress/:vocabularyId')
  async updateProgress(
    @Request() req,
    @Param('vocabularyId') vocabularyId: string,
    @Body('correct') correct: boolean,
  ) {
    return this.userService.updateProgress(req.user.id, vocabularyId, correct);
  }
}