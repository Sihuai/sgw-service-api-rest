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
import { ERROR2STATUS_CODE } from '../constants/errors';
import { APP_ERRORS } from '../../../app/errors/error.interface';
// import { GetUserAction } from '../../actions/user/get';
import { RegisterUserAction } from '../../actions/auth/register';
import { SigninAuthAction } from '../../actions/auth/signin';
// import { GetTokenAction } from '../../actions/auth/get.token';
import { SignoutAuthAction } from '../../actions/auth/signout';

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.RegisterUserAction) public registerUserAction: RegisterUserAction,
    // @inject(IOC_TYPE.GetUserAction) public getUserAction: GetUserAction,
    @inject(IOC_TYPE.SigninAuthAction) public signinAuthAction: SigninAuthAction,
    @inject(IOC_TYPE.SignoutAuthAction) public signoutAuthAction: SignoutAuthAction,
    // @inject(IOC_TYPE.GetTokenAction) public getTokenAction: GetTokenAction,
  ) { }

  @httpPost('/register')
  private async register(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.registerUserAction.execute(request.body);
      response.sendStatus(200);
    } catch (e) {
      if ([APP_ERRORS.UserAlreadyExists, APP_ERRORS.ValidationError].includes(e.name)) {
        return response.status(400).json(e.json());
      }
      next(e);
    }
  }

  @httpPost('/signin')
  private async signin(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.signinAuthAction.execute(request.body);
      if (result == null) response.sendStatus(403);

      // const {refresh, ...rest } = result.token;
      // const cookieOptions = {httpOnly: true, secure: process.env.NODE_ENV === 'production'? true: false}
      // response.cookie('r-token', refresh, cookieOptions)
      response.sendStatus(200).json({ token: result == null ? "" : result.token });
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }

  @httpPost('/:signout')
  private async signout(
    @requestHeaders('Authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      await this.signoutAuthAction.execute(authHeader);
      
      // token handling. clear the cookie.
      // response.clearCookie('r-token', {path: '/'});
      response.sendStatus(200);
    } catch (e) {
      const code = ERROR2STATUS_CODE[e.name];
      if (code) {
        return response.status(code).json(e.json());
      }
      next(e);
    }
  }

  // @httpGet('/:token')
  // private async token(
  //   @request() request: Request, @response() response: Response, @next() next: Function,
  // ) {
  //   try {
  //     const result = await this.getTokenAction.execute(request.body);
  //     response.sendStatus(200).json({ token: result.token });
  //   } catch (e) {
  //     if ([APP_ERRORS.UserAlreadyExists, APP_ERRORS.ValidationError].includes(e.name)) {
  //       return response.status(400).json(e.json());
  //     }
  //     next(e);
  //   }
  // }

  // @httpPost('/:resetPassword/request')
  // private async request(
  //   @request() request: Request, @response() response: Response, @next() next: Function,
  // ) {
  //   try {
  //     const result = await this.createUserAction.execute(request.body);

  //     response.json({ result });
  //   } catch (e) {
  //     if ([APP_ERRORS.UserAlreadyExists, APP_ERRORS.ValidationError].includes(e.name)) {
  //       return response.status(400).json(e.json());
  //     }
  //     next(e);
  //   }
  // }

  // @httpPost('/:resetPassword/execute')
  // private async execute(
  //   @request() request: Request, @response() response: Response, @next() next: Function,
  // ) {
  //   try {
  //     const result = await this.createUserAction.execute(request.body);

  //     response.json({ result });
  //   } catch (e) {
  //     if ([APP_ERRORS.UserAlreadyExists, APP_ERRORS.ValidationError].includes(e.name)) {
  //       return response.status(400).json(e.json());
  //     }
  //     next(e);
  //   }
  // }
}