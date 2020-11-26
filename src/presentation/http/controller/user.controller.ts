import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPatch,
  httpPost,
  interfaces,
  next,
  queryParam,
  request,
  requestHeaders,
  requestParam,
  response,
} from 'inversify-express-utils';
import { IOC_TYPE } from '../../../config/type';
import { ERROR2STATUS_CODE } from '../constants/errors';
import { APP_ERRORS } from '../../../app/errors/error.interface';
import { GetUserAction } from '../../actions/user/get';

@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetUserAction) public getUserAction: GetUserAction,
  ) { }


  @httpGet('/profile')// :profile
  private async get(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.getUserAction.execute(request.body);
      // const result = ctlr.getProfile(request, response);
      response.json(result);
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }
}