import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

@Module({
  providers: [
    {
      provide: PrismaService,
      useValue: new PrismaService(process.env.DATABASE_URL),
    },
  ],
  exports: [PrismaService],
})
export class DatabaseModule {}
