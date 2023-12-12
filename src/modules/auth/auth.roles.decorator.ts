import { SetMetadata } from '@nestjs/common';

export const UserRoles = (...args: string[]) => SetMetadata('roles', args);
