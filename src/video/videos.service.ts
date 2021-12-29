import { Injectable } from '@nestjs/common';
import { VideosRepository } from './videos.repository';
import { S3UploadResponseDto } from './dto/s3-upload-response.dto';
import { VideoDto } from './dto/video.dto';
import { User } from '../auth/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private videosRepository: VideosRepository,
  ) {}

  async create(createVideoDto): Promise<S3UploadResponseDto> {
    return await this.videosRepository.upload(createVideoDto);
  }

  async get(user: User): Promise<VideoDto[]> {
    const data = await this.videosRepository.get();
    const likes = JSON.parse(user.likes);
    return data.filter(({ hlsUrl }) => hlsUrl).map(_ => ({ ..._, liked: likes.includes(_.guid) }));
  }

  async like(guid: string, user: User, minus?: boolean): Promise<VideoDto> {
    await this.userRepository.like(guid, user, minus);
    return await this.videosRepository.like(guid, minus);
  }
}
