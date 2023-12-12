import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

import Users from './auth/users.seed';
import UserRoles from './auth/user-roles.seed';
import { master as masterDataSeeder } from './master';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
dotenv.config();

async function main() {
  console.log('Seeding...');
  console.log('[1] Seeding Master');
  await masterDataSeeder();
  // superadmin
  await prisma.user.upsert({
    where: { id: Users[0].id },
    create: Users[0],
    update: {
      email: Users[0].email,
      name: Users[0].name,
      password: Users[0].password,
      createdBy: Users[0].createdBy,
    },
  });

  // below this line is for development purposes
  if (process.env.APP_ENV != 'production' || args[0] == 'force') {
    console.log('[2] Seeding User');
    Users.shift(); // deleting first user because it already exists
    for (const data of Users) {
      await prisma.user.upsert({
        where: { id: data.id },
        create: data,
        update: {
          email: data.email,
          name: data.name,
          password: data.password,
          createdBy: data.createdBy,
        },
      });
    }
    for (const data of UserRoles) {
      await prisma.userRole.upsert({
        where: { id: data.id },
        create: data,
        update: {
          userId: data.userId,
          roleId: data.roleId,
          createdBy: data.createdBy,
        },
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
