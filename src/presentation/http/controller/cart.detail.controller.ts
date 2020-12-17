import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
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
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { getUserFromToken } from '../../../infra/utils/security';
import { GetCartDetailAction } from '../../actions/cart.detail/get';

@controller('/cartdetail')
export class CartDetailController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetCartDetailAction) public getCartDetailAction: GetCartDetailAction,
  ) { }

  @httpGet('/get')
  private async get(
    @requestHeaders('authorization') authHeader: string,
    @queryParam('key') key: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      // const tokenUser = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.getCartDetailAction.execute(key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}