import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  interfaces,
  next,
  request,
  requestHeaders,
  response,
} from 'inversify-express-utils';
import { IOC_TYPE } from '../../../config/type';
import { RegisterUserAction } from '../../actions/auth/register';
import { SigninAuthAction } from '../../actions/auth/signin';
import { SignoutAuthAction } from '../../actions/auth/signout';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { GetTokenAction } from '../../actions/security/token';
import { ResetPWExecuteUserAction } from '../../actions/security/reset.pw.execute';
import { ResetPWRequestUserAction } from '../../actions/security/reset.pw.request';

@controller('/security')
export class SecurityController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.RegisterUserAction) public registerUserAction: RegisterUserAction,
    @inject(IOC_TYPE.SigninAuthAction) public signinAuthAction: SigninAuthAction,
    @inject(IOC_TYPE.SignoutAuthAction) public signoutAuthAction: SignoutAuthAction,
    @inject(IOC_TYPE.GetTokenAction) public getTokenAction: GetTokenAction,
    @inject(IOC_TYPE.ResetPWRequestUserAction) public resetPWRequestUserAction: ResetPWRequestUserAction,
    @inject(IOC_TYPE.ResetPWExecuteUserAction) public resetPWExecuteUserAction: ResetPWExecuteUserAction,
  ) { }

  @httpGet('/getToken')
  private async getToken(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = request.cookies['r-token'];
      if (token == null) return response.status(ResponseDataCode.InvalidToken).json(ResponseFailure(ResponseDataCode.InvalidToken, 'Token is empty.'));

      const result = await this.getTokenAction.execute(token);
      if (result == -1) return response.status(ResponseDataCode.InvalidToken).json(ResponseFailure(ResponseDataCode.InvalidToken, 'Token is not existed!'));
      if (result == -2) return response.status(ResponseDataCode.InvalidToken).json(ResponseFailure(ResponseDataCode.InvalidToken, 'Invalid Token.  Access Forbidden by API service.'));
      if (result == -3) return response.status(ResponseDataCode.Forbidden).json(ResponseFailure(ResponseDataCode.Forbidden, 'Access Forbidden by API servcie.'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result.token));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/resetPassword/request')
  private async request(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.resetPWRequestUserAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Password is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'You are not register!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/resetPassword/execute')
  private async execute(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.resetPWExecuteUserAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Password is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Code is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'You are not register!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'You had reset!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Your request is expired!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}