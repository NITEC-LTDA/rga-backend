import 'dotenv/config'
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
    await prisma.tutor_Addresses.deleteMany()
    await prisma.tutors.deleteMany()
    await prisma.$disconnect()
    await app.close()
  })

  it('/ (POST)', async () => {
    await request(app.getHttpServer())
      .post('/tutors')
      .send({
        name: 'John Doe',
        email: 'john@gmail.com',
        password: 'aaaaaqqqqq',
        cpf: '123.456.789-10',
        phone: '(11) 99999-9999',
      })
      .expect(201)

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        cpf: '123.456.789-10',
        password: 'aaaaaqqqqq',
      })

    console.log(body)

    const { accessToken } = body
    console.log(accessToken)

    const response = await request(app.getHttpServer())
      .post('/tutor-addresses')
      .send({
        street: '123 Main Street',
        number: '456',
        zipcode: '90210',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States',
        neighborhood: 'Beverly Hills',
      })
      .auth(accessToken, { type: 'bearer' })
      .expect(201)

    expect(response.body.street).toBe('123 Main Street')
    expect(response.body.number).toBe('456')
  })
})
