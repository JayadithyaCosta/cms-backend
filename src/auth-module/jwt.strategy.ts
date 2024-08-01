import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user-module/user.service'; // Import the User service

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Use an environment variable for the secret key
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;
    const user = await this.userService.findOne(sub);
    if (!user) {
      throw new Error('Unauthorized');
    }
    return user;
  }
}
