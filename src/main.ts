import fastifyMultipart from 'fastify-multipart'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  )
  // enable validation globally
  // this is from NestJS docs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // Register fastify-multipart
  app.register(fastifyMultipart)

  // enable DI for class-validator
  // this is an important step, for further steps in this article
  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  // enable CORS
  app.enableCors({
    origin: '*',
  })

  await app.listen(3001, '0.0.0.0', () => {
    console.log('Server is running on port 3001')
  })
}
bootstrap()
