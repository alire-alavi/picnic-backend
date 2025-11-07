import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Client } from '@aws-sdk/client-s3'

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)
  private s3: S3Client
  private bucket: string

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET') || 'uploads'
  }

  private async getClient(): Promise<S3Client> {
    if (this.s3) return this.s3
    const {
      S3_ENDPOINT,
      S3_REGION,
      S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY,
      S3_FORCE_PATH_STYLE,
    } = this.getEnv()

    const { S3Client } = await import('@aws-sdk/client-s3')

    this.s3 = new S3Client({
      region: S3_REGION || 'us-east-1',
      endpoint: S3_ENDPOINT || undefined,
      forcePathStyle: S3_FORCE_PATH_STYLE === 'true',
      credentials:
        S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
          ? {
              accessKeyId: S3_ACCESS_KEY_ID,
              secretAccessKey: S3_SECRET_ACCESS_KEY,
            }
          : undefined,
    })
    return this.s3
  }

  private getEnv() {
    return {
      S3_ENDPOINT: this.config.get<string>('S3_ENDPOINT'),
      S3_REGION: this.config.get<string>('S3_REGION'),
      S3_ACCESS_KEY_ID: this.config.get<string>('S3_ACCESS_KEY_ID'),
      S3_SECRET_ACCESS_KEY: this.config.get<string>('S3_SECRET_ACCESS_KEY'),
      S3_BUCKET: this.bucket,
      S3_FORCE_PATH_STYLE: this.config.get<string>('S3_FORCE_PATH_STYLE'),
      S3_SIGNED_URL_TTL: this.config.get<string>('S3_SIGNED_URL_TTL') || '900',
    }
  }

  async ensureBucket(): Promise<void> {
    const client = await this.getClient()
    const { HeadBucketCommand, CreateBucketCommand } = await import(
      '@aws-sdk/client-s3'
    )
    try {
      await client.send(new HeadBucketCommand({ Bucket: this.bucket }))
    } catch (e: any) {
      this.logger.log(`Bucket ${this.bucket} missing, creating…`)
      try {
        await client.send(new CreateBucketCommand({ Bucket: this.bucket }))
      } catch (err) {
        // If bucket exists in race conditions, ignore
        const code = (err as any)?.name || (err as any)?.Code
        if (
          code !== 'BucketAlreadyOwnedByYou' &&
          code !== 'BucketAlreadyExists'
        )
          throw err
      }
    }
  }

  async uploadBuffer(key: string, body: Buffer, contentType?: string) {
    const client = await this.getClient()
    const { PutObjectCommand } = await import('@aws-sdk/client-s3')
    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    )
    return {
      bucket: this.bucket,
      key,
      url: this.publicUrl(key),
    }
  }

  async getPresignedPutUrl(key: string, contentType?: string) {
    const client = await this.getClient()
    const { PutObjectCommand } = await import('@aws-sdk/client-s3')
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')
    const ttl = parseInt(this.getEnv().S3_SIGNED_URL_TTL || '900', 10)
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    })
    const url = await getSignedUrl(client, command, { expiresIn: ttl })
    return { url, expiresIn: ttl, key, bucket: this.bucket }
  }

  publicUrl(key: string) {
    const { S3_ENDPOINT } = this.getEnv()
    if (S3_ENDPOINT) {
      // Compatible with path-style and localhost MinIO setup
      const pathStyle =
        this.config.get<string>('S3_FORCE_PATH_STYLE') === 'true'
      if (pathStyle)
        return `${S3_ENDPOINT.replace(/\/$/, '')}/${this.bucket}/${key}`
      // virtual-hosted-style (may require DNS-compatible bucket name)
      const url = new URL(S3_ENDPOINT)
      return `${url.protocol}//${this.bucket}.${url.host}/${key}`
    }
    // Fallback to AWS pattern
    const region = this.config.get<string>('S3_REGION') || 'us-east-1'
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`
  }
}
