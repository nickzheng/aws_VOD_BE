import { ApiModelProperty } from '@nestjs/swagger';

export class S3UploadResponseDto {
  @ApiModelProperty()
  ServerSideEncryption: string;

  @ApiModelProperty()
  Location: string;

  @ApiModelProperty()
  Bucket: string;

  @ApiModelProperty()
  Key: string;

  @ApiModelProperty()
  ETag: string;
}
