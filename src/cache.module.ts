import { Module, Global } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 3 * 60, // seconds (5 minutes)
      max: 100,
    }),
  ],
  exports: [CacheModule], // Make sure to export it so other modules can use it
})
export class CacheConfigModule {}
