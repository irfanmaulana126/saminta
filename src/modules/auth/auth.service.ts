import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { AuthHelpers } from '../../shared/helpers/auth.helpers';
import { GLOBAL_CONFIG } from '../../configs/global.config';

import { AuthDataDTO, LoginUserDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly authHelpers: AuthHelpers,
  ) {}

  public async login(loginUserDTO: LoginUserDTO): Promise<AuthDataDTO> {
    const userData = await this.userService.findUser(loginUserDTO.email);

    if (!userData) {
      throw new UnauthorizedException('Invalid user or password');
    }

    const isMatch = await this.authHelpers.verify(
      loginUserDTO.password,
      userData.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid user or password');
    }

    const payload = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      roles: userData.userRole.map((role) => ({
        id: role.roleId,
        name: role.role.name,
      })),
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: GLOBAL_CONFIG.security.expiresIn,
    });
    const issuedAt = new Date().getTime();

    return {
      ...payload,
      accessToken: accessToken,
      issuedAt: issuedAt,
      expiresIn: GLOBAL_CONFIG.security.expiresIn - 1,
    };
  }
}
