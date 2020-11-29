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

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.RegisterUserAction) public registerUserAction: RegisterUserAction,
    @inject(IOC_TYPE.SigninAuthAction) public signinAuthAction: SigninAuthAction,
    @inject(IOC_TYPE.SignoutAuthAction) public signoutAuthAction: SignoutAuthAction,
  ) { }

  @httpPost('/register')
  private async register(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.registerUserAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Password is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Nike is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email has been used by another User!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/signin')
  private async signin(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.signinAuthAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email or Password is incorrect!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email or Password is incorrect!'));
      if (result == -3) return response.status(ResponseDataCode.NotFound).json(ResponseFailure(ResponseDataCode.NotFound, 'Fail to authenticate user credential passed in.'));
      if (result == -4) return response.status(ResponseDataCode.Unexpected).json(ResponseFailure(ResponseDataCode.Unexpected, 'Fail to distribute token.'));

      // Add token to cookie.
      const {refresh, ...rest } = result;
      const cookieOptions = {httpOnly: true, secure: process.env.NODE_ENV === 'production'? true: false}
      response.cookie('r-token', refresh, cookieOptions)

      response.status(ResponseDataCode.OK).json(ResponseSuccess({...rest}));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/signout')
  private async signout(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = request.cookies['r-token'];
      if (token == null) return response.status(ResponseDataCode.InvalidToken).json(ResponseFailure(ResponseDataCode.InvalidToken, 'Token is empty.'));

      const result = await this.signoutAuthAction.execute(token, request.body);
      
      // token handling. clear the cookie.
      response.clearCookie('r-token', {path: '/'});
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}