import { Injectable } from '@nestjs/common';

import { AuthHelpers } from '../../shared/helpers/auth.helpers';

@Injectable()
export class UserListener {
  constructor(private readonly authHelpers: AuthHelpers) {}

  public async onCreated(params, next) {
    // Check incoming query type
    if (params.model == 'User') {
      if (params.action === 'create' || params.action === 'update') {
        const password = params.args['data'].password;

        const encryptedPass = await this.authHelpers.hash(password);

        params.args['data'] = {
          ...params.args['data'],
          password: encryptedPass,
        };
      }
    }

    return next(params);
  }
}
