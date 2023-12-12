// import { randomBytes, scrypt } from 'crypto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

import { ROLES } from '../constants/global.constants';

import { RequestContext } from './request-context';

@Injectable()
export class AuthHelpers {
  constructor(private prisma: PrismaService) {}
  verify(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  currentUser(): User {
    const req: any = RequestContext.currentContext.req;
    return req.user;
  }

  async userHasRole(roles: string[]): Promise<boolean> {
    const userRoles = await this.prisma.userRole.findMany({
      select: {
        role: true,
      },
      where: {
        userId: this.currentUser().id,
        role: {
          id: {
            in: roles,
          },
        },
        deletedAt: null,
      },
    });

    return !!userRoles.length;
  }

  async isSuperadmin(): Promise<boolean> {
    return this.userHasRole([ROLES.superadmin]);
  }

  async isSuperadminOrStreamer(): Promise<boolean> {
    return this.userHasRole([ROLES.superadmin, ROLES.streamer]);
  }

  async isStreamer(): Promise<boolean> {
    return this.userHasRole([ROLES.streamer]);
  }
  async isMember(): Promise<boolean> {
    return this.userHasRole([ROLES.member]);
  }
  async isGuest(): Promise<boolean> {
    return this.userHasRole([ROLES.guest]);
  }
}
