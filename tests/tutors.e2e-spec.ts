import 'dotenv/config'
import { Prisma } from '@prisma/client'
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TutorAddressesModule } from '@/app/tutor_addresses/tutor_addresses.module'
import { TutorsModule } from '@/app/tutors/tutors.module'
import { execSync } from 'child_process'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AuthModule } from '@/app/auth/auth.module'
import { AtGuard } from '@/commons/guards/at.guard'
import { APP_GUARD } from '@nestjs/core'

describe('TutorsController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    prisma = new PrismaService(process.env.TEST_DATABASE_URL)

    // Run the migrations
    execSync('npx prisma migrate dev --preview-feature', {
      env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
    })

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        AuthModule,
        TutorsModule,
        TutorAddressesModule,
      ],
      controllers: [],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AtGuard,
        },
      ],
    })
      .overrideProvider(ConfigService) // Override ConfigService
      .useValue({
        get: (key: string): string => {
          // When requesting the DATABASE_URL, return the TEST_DATABASE_URL
          if (key === 'DATABASE_URL') {
            return process.env.TEST_DATABASE_URL
          }
          // Default behavior
          return process.env[key]
        },
      })
      .overrideProvider(PrismaService) // Override PrismaService
      .useValue(prisma) // Use our test PrismaService
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  }, 50000)

  afterAll(async () => {
    await prisma.$queryRaw(Prisma.sql`DELETE FROM "tutor_addresses";`)
    await prisma.$queryRaw(Prisma.sql`DELETE FROM "tutors";`)
    await prisma.$disconnect()
    await app.close()
  })

  it('/ (POST)', async () => {
    await request(app.getHttpServer())
      .post('/tutors')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: '123456789',
        cpf: '123.456.789-10',
      })
      .expect(201)
  })

  it('/ (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        cpf: '123.456.789-10',
        password: '123456789',
      })

    const { accessToken } = body

    const response = await request(app.getHttpServer())
      .get(`/tutors/me`)
      .auth(accessToken, { type: 'bearer' })
      .expect(200)

    expect(response.body.cpf).toBe('123.456.789-10')
  })

  it('/ (PATCH)', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        cpf: '123.456.789-10',
        password: '123456789',
      })

    const { accessToken } = body

    const response = await request(app.getHttpServer())
      .patch(`/tutors/me`)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: 'John Doe',
        email: 'john234@gmail.com',
        cpf: '123.456.789-10',
      })

    expect(response.body.email).toBe('john234@gmail.com')
  })
})
