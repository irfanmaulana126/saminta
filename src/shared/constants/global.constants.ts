//eslint-disable-next-line
require('dotenv').config();

export const APP_ENV = process.env.APP_ENV ?? 'local';
export const JWT_SECRET = process.env.JWT_SIGNATURE;
export const JWT_EXPIRY_SECONDS = process.env.JWT_EXPIRY_SECONDS
  ? parseInt(process.env.JWT_EXPIRY_SECONDS)
  : 7200;

export const ROLES = {
  superadmin: '65669bca77d7628213d4954d',
  streamer: '65669c61762d0d3324fdffb3',
  member: '65669c69b8b703ad7bf0bfd1',
  guest: '65673ef2be163e3d888f29a7',
};
export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 100;

export const DEFAULT_SORT_BY = 'id';

export const API_PREFIX = '/api/v1';

//Regex
export const PHONE_REGEX = /^[0-9\s+-.()]+$/;

export const SLUG_SEPARATOR = '-';

export const USE_REDIS = process.env.USE_REDIS === 'true';
export const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost';
export const REDIS_PORT = process.env.REDIS_PORT
  ? parseInt(process.env.REDIS_PORT)
  : 6379;
export const CACHE_TTL = process.env.CACHE_TTL
  ? parseInt(process.env.CACHE_TTL)
  : 3000000;

export const ID_MERCHANT_MIDTRANS =
  process.env.ID_MERCHANT_MIDTRANS ?? 'G789906322';
export const CLIENT_KEY_MIDTRANS =
  process.env.CLIENT_KEY_MIDTRANS ?? 'SB-Mid-client-3RIqon1xK06FVXDn';
export const SERVER_KEY_MIDTRANS =
  process.env.SERVER_KEY_MIDTRANS ?? 'SB-Mid-server-ntPcnamZNETrlQNY3G4tA0v_';
export const SENDBOX_MIDTRANS = process.env.SENDBOX_MIDTRANS === 'true';
export const ISGLOBAL_MIDTRANS = process.env.ISGLOBAL_MIDTRANS === 'true';
