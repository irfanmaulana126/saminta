import { Prisma, Role, User, UserRole } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { PrismaService } from 'nestjs-prisma';
import { createPaginator } from 'prisma-pagination';
import { PaginatedOutputDTO } from 'src/shared/dto/paginated-output.dto';
import { AuthHelpers } from 'src/shared/helpers/auth.helpers';
import { ROLES } from 'src/shared/constants/global.constants';

import {
  UserCreateFormDTO,
  UserFilterDTO,
  UserUpdateFormDTO,
} from './user.dto';

const paginate = createPaginator({ perPage: 10 });
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authHelpers: AuthHelpers,
  ) {}

  async findUser(
    email: string,
  ): Promise<({ userRole: (UserRole & { role: Role })[] } & User) | null> {
    return this.prisma.user.findFirst({
      include: {
        userRole: {
          include: {
            role: true,
          },
        },
      },
      where: {
        email: email,
      },
    });
  }

  async userById(id: string): Promise<any | null> {
    const objectId = new ObjectId(id);
    const where: Prisma.UserWhereInput = {
      id: objectId.toHexString(),
    };

    return this.prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        emailIsVerified: true,
        password: false,
        createdAt: true,
        updatedAt: true,
        userRole: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
      where: where,
    });
  }

  async users(query: UserFilterDTO): Promise<PaginatedOutputDTO<User>> {
    let where: Prisma.UserWhereInput = {};
    const { page, perPage, searchTerm, roles } = query;

    if (searchTerm || roles?.length) {
      where = {
        ...(searchTerm && {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: searchTerm,
              },
            },
          ],
        }),
        AND: [
          ...(roles?.length
            ? [
                {
                  userRole: {
                    some: {
                      role: {
                        id: {
                          in: roles,
                        },
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      };
    }
    return paginate<User, Prisma.UserFindManyArgs>(
      this.prisma.user,
      {
        select: {
          id: true,
          email: true,
          name: true,
          emailIsVerified: true,
          password: false,
          createdAt: true,
          updatedAt: true,
          userRole: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
        where: where,
        orderBy: {
          createdAt: 'asc',
        },
      },
      {
        page,
        perPage,
      },
    );
  }

  async createUser(body: UserCreateFormDTO): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const dataPayload: Prisma.UserCreateInput = {
        email: body.email,
        ...(body.password && {
          password: await this.authHelpers.hash(body.password),
        }),
        name: body.name,
        createdBy: this.authHelpers.currentUser().id,
      };

      const user = await tx.user.create({
        data: {
          ...dataPayload,
        },
      });

      await tx.userRole.createMany({
        data: body.role.map((r) => ({
          roleId: r,
          userId: user.id,
        })),
      });

      return await tx.user.findUnique({
        select: {
          id: true,
          email: true,
          name: true,
          emailIsVerified: true,
          password: false,
          createdAt: true,
          updatedAt: true,
          userRole: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
        where: {
          id: user.id,
        },
      });
    });
  }

  async updateUser(id: string, body: UserUpdateFormDTO): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const currentUser = await tx.user.findFirstOrThrow({
        where: {
          id: id,
        },
      });

      const dataPayload: Prisma.UserUpdateInput = {
        email: body.email ?? currentUser.email,
        name: body.name ?? currentUser.name,
        updatedBy: this.authHelpers.currentUser().id,
      };

      if (body.role) {
        await tx.userRole.deleteMany({
          where: {
            userId: id,
          },
        });
        await tx.userRole.createMany({
          data: body.role.map((r) => ({
            roleId: r,
            userId: id,
          })),
        });
      }

      return await tx.user.update({
        select: {
          id: true,
          email: true,
          name: true,
          emailIsVerified: true,
          password: false,
          createdAt: true,
          updatedAt: true,
          userRole: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
        where: {
          id: id,
        },
        data: {
          ...dataPayload,
        },
      });
    });
  }

  async deleteUser(id: string): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      const currentUser = await tx.user.findFirstOrThrow({
        where: {
          id: id,
        },
      });

      if (currentUser.deletedAt) {
        throw new Error('User is already deleted');
      }

      const user = await tx.user.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: this.authHelpers.currentUser().id,
        },
      });

      return user;
    });
  }

  async roles(query): Promise<PaginatedOutputDTO<Role>> {
    let where: Prisma.RoleWhereInput = {};
    const { page, perPage, searchTerm } = query;

    where = {
      ...(searchTerm && {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      }),
      ...((await this.authHelpers.isStreamer()) && {
        id: {
          not: {
            equals: ROLES['superadmin'],
          },
        },
      }),
    };

    return paginate<Role, Prisma.RoleFindManyArgs>(
      this.prisma.role,
      {
        where: where,
        orderBy: {
          createdAt: 'asc',
        },
      },
      {
        page,
        perPage,
      },
    );
  }
}
