import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(googleUser: any): Promise<User> {
    let user = await this.userService.findByGoogleId(googleUser.googleId);
    
    if (!user) {
      user = await this.userService.findByEmail(googleUser.email);
      if (!user) {
        user = await this.userService.create(googleUser);
      }
    }

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }
}