import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user-module/schemas/user.schema'; // Import your User schema

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwt(user: User): Promise<string> {
    const payload = { username: user.name, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
