import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { ApiUseTags } from '@nestjs/swagger';
import ResponseUtils from '../utils/responseUtils';
import { ResponseDto } from '../dto/response.dto';

@ApiUseTags('auth')
// @ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<ResponseDto<User>> {
    const user = await this.authService.signUp(authCredentialsDto);
    return ResponseUtils.mapResponse(user);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<ResponseDto<Object>> {
    const token = await this.authService.signIn(authCredentialsDto);
    return ResponseUtils.mapResponse(token);
  }

  // @Get('/test')
  // @UseGuards(AuthGuard())
  // async test(@GetUser() user: User) {
  //   return user;
  // }
}
