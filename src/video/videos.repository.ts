// import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { VideoDto } from './dto/video.dto';
import { S3UploadResponseDto } from './dto/s3-upload-response.dto';
import * as config from 'config';
import { NotFoundException } from '@nestjs/common';
const awsConfig = config.get('aws');
AWS.config.update({ region: 'us-east-1' });

export class VideosRepository {
  private dynamoDBClient = new AWS.DynamoDB.DocumentClient();
  private s3 = new AWS.S3({ apiVersion: '2006-03-01' });

  async get(): Promise<VideoDto[]> {
    const data = await this.dynamoDBClient.scan({ TableName: awsConfig.videoTableName }).promise();
    return data.Items.map(({ hlsUrl, srcVideo, guid, likes, liked }) => ({ guid, hlsUrl, srcVideo, likes, liked }));
  }

  async upload(params): Promise<S3UploadResponseDto> {
    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          ...params,
          Bucket: awsConfig.s3Bucket,
        },
        (err, data) => {
          if (err) {
            reject(err);
          }
          if (data) {
            resolve(data);
          }
        },
      );
    });
  }

  async like(guid: string, minus?: boolean): Promise<VideoDto> {
    const data = await this.dynamoDBClient.get({ Key: { guid }, TableName: awsConfig.videoTableName }).promise();
    if (!data.Item) {
      throw new NotFoundException();
    }

    const operation = minus ? '-' : '+';

    const param = !data.Item.likes
      ? {
          TableName: awsConfig.videoTableName,
          Key: { guid },
          ReturnValues: 'ALL_NEW',
          //
          UpdateExpression: 'set likes= :initValue + :i',
          ExpressionAttributeValues: {
            ':i': 1,
            ':initValue': 0,
          },
        }
      : {
          TableName: awsConfig.videoTableName,
          Key: { guid },
          ReturnValues: 'ALL_NEW',
          //
          UpdateExpression: `set likes= likes ${operation} :i`,
          ExpressionAttributeValues: {
            ':i': 1,
          },
        };

    const {
      Attributes: { hlsUrl, srcVideo, likes },
    } = await this.dynamoDBClient.update(param).promise();

    return {
      guid,
      hlsUrl,
      srcVideo,
      likes,
    };
  }
}
