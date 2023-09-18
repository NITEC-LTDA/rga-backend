import { Admins as RawAdmins } from '@prisma/client'

import { Admin } from '@/app/admins/entities/admin.entity'

export class AdminsMapper {
  static toHttp(raw: RawAdmins) {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      cpf: raw.cpf,
      phone: raw.phone,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  static toPrisma(admin: Admin) {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      password: admin.password,
      cpf: admin.cpf,
      phone: admin.phone,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }
}
