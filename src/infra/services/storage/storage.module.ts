import { Module } from '@nestjs/common'
import { S3StorageService } from './aws/s3.service'
import { StorageService } from './storage.service'
@Module({
  providers: [
    {
      provide: StorageService,
      useClass: S3StorageService,
    },
  ],
  exports: [StorageService],
})
export class AppModule {}
