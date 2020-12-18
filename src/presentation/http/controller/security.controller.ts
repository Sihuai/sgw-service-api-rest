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
import { getUserFromToken } from '../../../infra/utils/security';

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

  /**
* @swagger
  * /security/refreshtoken:
  *   get:
  *     summary: Refresh token before expiry.
  *     description: Refresh token before expiry.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: Access token.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 200
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: ""
  *                 data:
  *                   type: string
  *                   description: Access token.
  *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *       403:
  *         description: Forbidden.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 403
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Forbidden!"
  *                 data:
  *                   type: string
  *                   description: Response data.
  *                   example: ""
  *       601:
  *         description: Invalid Token.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 601
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Invalid Token!"
  *                 data:
  *                   type: string
  *                   description: Response data.
  *                   example: ""
  *       603:
  *         description: Validation Error.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 603
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Email is empty!"
  *                 data:
  *                   type: string
  *                   description: Response data.
  *                   example: ""
  *       604:
  *         description: Not Authorized.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 604
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Not Authorized"
  *                 data:
  *                   type: string
  *                   description: Response data.
  *                   example: ""
  *       606:
  *         description: Token Time Out.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 606
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Token Time Out!"
  *                 data:
  *                   type: string
  *                   description: Response data.
  *                   example: ""
  */
  @httpGet('/refreshtoken')
  private async getToken(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.getTokenAction.execute(request.cookies['r-token']);
      if (result == -10) return response.status(ResponseDataCode.InvalidToken).json(ResponseFailure(ResponseDataCode.InvalidToken, 'Token is not existed!'));
      if (result == -12) return response.status(ResponseDataCode.InvalidToken).json(ResponseFailure(ResponseDataCode.InvalidToken, 'Invalid Token.  Access Forbidden by API service.'));
      if (result == -13) return response.status(ResponseDataCode.Forbidden).json(ResponseFailure(ResponseDataCode.Forbidden, 'Access Forbidden by API servcie.'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result.token));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  @httpPost('/resetpwrequest')
  private async request(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

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

  @httpPost('/resetpwexecute')
  private async execute(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
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