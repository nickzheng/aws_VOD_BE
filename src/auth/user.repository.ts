import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);
    try {
      await this.save(user);
      delete user.salt;
      delete user.password;
      return user;
    } catch (error) {
      const { code, stack } = error;
      let reason: string;
      const method = 'Method name: signUp fails';
      const params = `call with args: ${JSON.stringify(arguments)}`;
      switch (code) {
        case '23505': {
          reason = 'reason: username already exists';
          this.logger.log(`${method},${reason},${params}`);
          throw new ConflictException(reason);
        }
        default: {
          reason = 'reason: unknown';
          this.logger.error(`${method},${reason},${params}`, stack);
          throw new InternalServerErrorException();
        }
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    return user && (await user.validatePassword(password)) ? user.username : null;
  }

  async like(guid: string, user: User, minus?: boolean) {
    const userData = await this.findOne({ id: user.id });
    const likes = JSON.parse(userData.likes);
    const existed = likes.find(_ => _ === guid);
    let newLike = likes;
    if (!minus && !existed) {
      newLike = [...likes, guid];
    }
    if (minus && existed) {
      newLike = likes.filter(item => item !== guid);
    }
    await this.save({ ...userData, likes: JSON.stringify(newLike) });
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
