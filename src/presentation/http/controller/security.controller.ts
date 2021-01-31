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
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { GetTokenAction } from '../../actions/security/token';
import { ResetPWExecuteUserAction } from '../../actions/security/reset.pw.execute';
import { ResetPWRequestUserAction } from '../../actions/security/reset.pw.request';
import { getUserFromToken } from '../../../infra/utils/security';
import { ResetPWAction } from '../../actions/security/reset.pw';

@controller('/security')
export class SecurityController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetTokenAction) private getTokenAction: GetTokenAction,
    @inject(IOC_TYPE.ResetPWAction) private resetPWAction: ResetPWAction,
    @inject(IOC_TYPE.ResetPWRequestUserAction) private resetPWRequestUserAction: ResetPWRequestUserAction,
    @inject(IOC_TYPE.ResetPWExecuteUserAction) private resetPWExecuteUserAction: ResetPWExecuteUserAction,
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

  /**
* @swagger
  * /security/resetpw:
  *   post:
  *     summary: Reset user's password.
  *     description: Reset user's password.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               oldpw:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's old password.
  *                 example: '123456'
  *               newpw:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's new password.
  *                 example: '654321'
  *     responses:
  *       200:
  *         description: Success Reset.
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
  *                   type: object
  *                   properties:
  *                     _id:
  *                       type: string
  *                       description: user's id.
  *                       example: "User/123456"
  *                     _key:
  *                       type: string
  *                       description: user's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: user's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: user's old revision.
  *                       example: _blBFzW----
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
  *       602:
  *         description: Unexpected.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 602
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Unexpected!"
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
  @httpPost('/resetpw')
  private async resetPassword(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.resetPWAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Old Password is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'New Password is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'User isnot existed!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Old Password is wrong!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
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