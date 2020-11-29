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
import { GetUserAction } from '../../actions/user/get';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';

@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetUserAction) public getUserAction: GetUserAction,
  ) { }

  @httpGet('/nick')
  private async getNick(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.getUserAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email is empty!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result.nick));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpGet('/profile')// :profile
  private async get(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.getUserAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email is empty!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}