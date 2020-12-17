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
import { GetTrailDetailAction } from '../../actions/trail.detail/get';
import { CreateTrailDetailAction } from '../../actions/trail.detail/create';
import { EditTrailDetailAction } from '../../actions/trail.detail/edit';
import { DeleteTrailDetailAction } from '../../actions/trail.detail/delete';

@controller('/traildetail')
export class TrailDetailController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetTrailDetailAction) public getTrailDetailAction: GetTrailDetailAction,
    @inject(IOC_TYPE.CreateTrailDetailAction) public createTrailDetailAction: CreateTrailDetailAction,
    @inject(IOC_TYPE.EditTrailDetailAction) public editTrailDetailAction: EditTrailDetailAction,
    @inject(IOC_TYPE.DeleteTrailDetailAction) public deleteTrailDetailAction: DeleteTrailDetailAction,
  ) { }

  @httpGet('/get')
  private async get(
    @requestHeaders('authorization') authHeader: string,
    @queryParam('trailkey') trailKey: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      // const tokenUser = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.getTrailDetailAction.execute(trailKey);
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Key is empty!'));
      if (result == -11) return response.status(ResponseDataCode.OK).json(ResponseSuccess(''));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/create')
  private async create(
    @requestHeaders('authorization') authHeader: string,
    @queryParam('trailkey') trailKey: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      // const tokenUser = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.createTrailDetailAction.execute(trailKey, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Title is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Bill board is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sections is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Key is empty!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cannot save trail detail information!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cannot create trail detail relation!'));

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
      // const tokenUser = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.editTrailDetailAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Title is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Bill board is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sections is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This TrailDetail is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpDelete('/delete')
  private async delete(
    @requestHeaders('authorization') authHeader: string,
    @queryParam('key') key: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      // const tokenUser = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.deleteTrailDetailAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This TrailDetail is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}