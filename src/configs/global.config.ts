import {
  API_PREFIX,
  JWT_EXPIRY_SECONDS,
  REDIS_HOST,
  REDIS_PORT,
} from '../shared/constants/global.constants';

import { Config } from './config.interface';

export const GLOBAL_CONFIG: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'SAMINTA 1.0 API',
    description: 'API Repository for SAMINTA 1.0',
    version: '1.0-rc1',
    path: API_PREFIX,
  },
  security: {
    expiresIn: JWT_EXPIRY_SECONDS,
    bcryptSaltOrRound: 10,
  },
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
};
