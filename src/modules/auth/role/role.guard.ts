import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User, UserRole } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  matchRoles(
    roles: string[],
    userRole: ({ role: Role } & UserRole)[],
  ): boolean {
    if (!roles) {
      return true;
    }

    const userRoles = userRole.map((userRole) => userRole.role.id);
    for (const role of roles) {
      const hasRole = userRoles.includes(role) ? true : false;

      if (hasRole) {
        return true;
      }
    }

    return false;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: user.id,
      },
      include: {
        role: true,
      },
    });

    return this.matchRoles(roles, userRoles);
  }
}
