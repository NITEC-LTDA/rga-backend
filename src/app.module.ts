import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TutorAddressesModule } from './app/tutor_addresses/tutor_addresses.module'
import { TutorsModule } from './app/tutors/tutors.module'
import { AuthModule } from './app/auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { AtGuard } from './commons/guards/at.guard'
import { PetsModule } from './app/pets/pets.module'
import { AppController } from './app.controller'
import { PetsTransferRequestsModule } from './app/pets_transfer_requests/pets_transfer_requests.module'
import { AdminsModule } from './app/admins/admins.module'
import { AdminOnlyMiddleware } from './commons/middlewares/admin-only.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TutorsModule,
    TutorAddressesModule,
    PetsModule,
    PetsTransferRequestsModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminOnlyMiddleware).forRoutes('/admins/*')
  }
}
