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
import { IndexHomeAction } from '../../actions/home/index';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';

@controller('/home')
export class HomeController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.IndexHomeAction) public indexHomeAction: IndexHomeAction,
  ) { }

  @httpGet('/index')
  private async index(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.indexHomeAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpGet('/card')
  private async card(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.indexHomeAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}