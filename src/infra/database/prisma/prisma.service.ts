// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly connectionUrl?: string) {
    super(
      connectionUrl
        ? { datasources: { db: { url: connectionUrl } } }
        : undefined,
    )
  }

  async onModuleInit() {
    await this.$connect()
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}
