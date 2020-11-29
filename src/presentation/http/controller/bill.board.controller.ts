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
import { CreateBillBoardAction } from '../../actions/billboard/create';
import { EditBillBoardAction } from '../../actions/billboard/edit';
import { GetBillBoardAction } from '../../actions/billboard/get';

@controller('/billboard')
export class BillBoardController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetBillBoardAction) public getBillBoardAction: GetBillBoardAction,
    @inject(IOC_TYPE.CreateBillBoardAction) public createBillBoardAction: CreateBillBoardAction,
    @inject(IOC_TYPE.EditBillBoardAction) public editBillBoardAction: EditBillBoardAction,
  ) { }

  @httpGet('/get')
  private async get(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.getBillBoardAction.execute();
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result.token));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/create')
  private async create(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.createBillBoardAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Contents is empty!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/edit')
  private async edit(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.editBillBoardAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Contents is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Bill board information is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpDelete('/delete')
  private async delete(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.editBillBoardAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Bill board information is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}