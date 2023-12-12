import { PrismaClient } from '@prisma/client';

import Roles from './auth/roles.seed';

const prisma = new PrismaClient();

export async function master() {
  for (const data of Roles) {
    await prisma.role.upsert({
      where: { id: data.id },
      create: data,
      update: { name: data.name },
    });
  }
}
