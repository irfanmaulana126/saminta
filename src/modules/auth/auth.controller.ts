import { Body, Controller, Post, Response } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SingleModelResponseDTO } from 'src/shared/dto/single-output.dto';
import { JWT_EXPIRY_SECONDS } from 'src/shared/constants/global.constants';

import { AuthService } from './auth.service';
import { AuthDataDTO, LoginUserDTO } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ description: 'Login user' })
  @ApiBody({ type: LoginUserDTO })
  @ApiResponse({ type: SingleModelResponseDTO<AuthDataDTO> })
  async login(
    @Body() user: LoginUserDTO,
    @Response() res,
  ): Promise<SingleModelResponseDTO<AuthDataDTO>> {
    const loginData = await this.authService.login(user);

    res.cookie('accessToken', loginData.accessToken, {
      expires: new Date(new Date().getTime() + JWT_EXPIRY_SECONDS * 1000),
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
    });

    return res.status(200).send({
      message: 'Login success',
      data: loginData,
    });
  }

  @Post('logout')
  @ApiResponse({ type: SingleModelResponseDTO<AuthDataDTO> })
  logout(@Response() res): Promise<SingleModelResponseDTO<AuthDataDTO>> {
    res.clearCookie('accessToken');
    return res.status(200).send({ message: 'Logout success' });
  }
}
