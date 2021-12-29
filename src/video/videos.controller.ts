import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { VideoDto } from './dto/video.dto';
import { S3UploadResponseDto } from './dto/s3-upload-response.dto';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiImplicitFile,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guard/roles.guard';

@ApiUseTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private videosService: VideosService) {}

  @ApiImplicitFile({ name: 'file', required: true })
  @ApiCreatedResponse({ description: 'upload result', type: S3UploadResponseDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  // doc
  @UseGuards(new RolesGuard('admin'))
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(@UploadedFile() file: Express.Multer.File): Promise<S3UploadResponseDto> {
    return await this.videosService.create({
      Key: String(file.originalname),
      Body: file.buffer,
    });
  }

  @ApiOkResponse({ description: 'list of videos', type: VideoDto, isArray: true })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  // doc
  @UseGuards(AuthGuard())
  @Get()
  async get(@GetUser() user: User): Promise<VideoDto[]> {
    return await this.videosService.get(user);
  }

  @ApiOkResponse({ description: 'The video has been successfully liked.', type: VideoDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  // doc
  @UseGuards(AuthGuard())
  @Patch('/:guid/like')
  async like(@Param('guid', ParseUUIDPipe) guid: string, @GetUser() user: User): Promise<VideoDto> {
    return await this.videosService.like(guid, user);
  }

  @ApiOkResponse({ description: 'The video has been successfully unliked.', type: VideoDto })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  // doc
  @UseGuards(AuthGuard())
  @Patch('/:guid/unlike')
  async unlike(@Param('guid', ParseUUIDPipe) guid: string, @GetUser() user: User): Promise<VideoDto> {
    return await this.videosService.like(guid, user, true);
  }
}
