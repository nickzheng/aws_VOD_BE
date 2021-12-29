import { ApiModelProperty } from '@nestjs/swagger';

export class VideoDto {
  @ApiModelProperty()
  guid: string;

  @ApiModelProperty()
  hlsUrl: string;

  @ApiModelProperty()
  srcVideo: string;

  @ApiModelProperty()
  likes: string;

  @ApiModelProperty()
  liked?: boolean;
}
