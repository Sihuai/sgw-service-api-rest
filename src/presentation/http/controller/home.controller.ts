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
import { IndexHomeAction } from '../../actions/home/index';

@controller('/home')
export class HomeController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.IndexHomeAction) public indexHomeAction: IndexHomeAction,
  ) { }

  @httpGet('/:index')
  private async get(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.indexHomeAction.execute();

      response.sendStatus(200).json(result);
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }
}