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
import { EditUserAction } from '../../actions/user/edit';
import { getTokenFromAuthHeaders, getUserFromToken } from '../../../infra/utils/security';

@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetUserAction) public getUserAction: GetUserAction,
    @inject(IOC_TYPE.EditUserAction) public editUserAction: EditUserAction,
  ) { }

  @httpGet('/get')
  private async get(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const tokenUser = getUserFromToken(getTokenFromAuthHeaders(authHeader) || request.query.token);

      const result = await this.getUserAction.execute(tokenUser);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'User is empty!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/edit')
  private async edit(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const tokenUser = getUserFromToken(getTokenFromAuthHeaders(authHeader) || request.query.token);

      const result = await this.editUserAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'User isnot existed!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}