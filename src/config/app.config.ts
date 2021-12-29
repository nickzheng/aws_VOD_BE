import * as config from 'config';
import { JwtModuleOptions } from '@nestjs/jwt';
const serverConfig = config.get('server');
const jwtConfig = config.get('jwt');

const port = process.env.PORT || serverConfig.port || 3000;

const JwtOptions: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || jwtConfig.secret,
  signOptions: { expiresIn: jwtConfig.expiresIn },
};

export default {
  port,
  JwtOptions,
};
