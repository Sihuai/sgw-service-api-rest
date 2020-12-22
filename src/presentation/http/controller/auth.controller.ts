import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  interfaces,
  next,
  request,
  requestHeaders,
  response,
} from 'inversify-express-utils';
import { IOC_TYPE } from '../../../config/type';
import { getUserFromToken } from '../../../infra/utils/security';
import { RegisterUserAction } from '../../actions/auth/register';
import { SigninAuthAction } from '../../actions/auth/signin';
import { SignoutAuthAction } from '../../actions/auth/signout';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.RegisterUserAction) private registerUserAction: RegisterUserAction,
    @inject(IOC_TYPE.SigninAuthAction) private signinAuthAction: SigninAuthAction,
    @inject(IOC_TYPE.SignoutAuthAction) private signoutAuthAction: SignoutAuthAction,
  ) { }

  /**
* @swagger
  * /auth/register:
  *   post:
  *     summary: User register
  *     description: User register for SGW.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's email.
  *                 example: mark.louise@sgw.com
  *               nameFirst:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's first name.
  *                 example: Mark
  *               nameLast:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's last name.
  *                 example: Louise
  *               pwhash:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's password.
  *                 example: 48ab1d7a4f1d0f231ca46d9cc865c66f
  *     responses:
  *       200:
  *         description: Register Success.
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
  *                     access:
  *                       type: string
  *                       description: Access token.
  *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *                     refresh:
  *                       type: string
  *                       description: Refresh token.
  *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *       404:
  *         description: Not Found.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 404
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Not Found"
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
  */
  @httpPost('/register')
  private async register(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      // 1. Register.
      const registerResult = await this.registerUserAction.execute(request.body);
      if (registerResult == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email is empty!'));
      if (registerResult == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Password is empty!'));
      if (registerResult == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'First name is empty!'));
      if (registerResult == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Last name is empty!'));
      if (registerResult == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email has been used by another User!'));

      // 2. Signin.
      const signinResult = await this.signinAuthAction.execute(request.body);
      if (signinResult == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email or Password is incorrect!'));
      if (signinResult == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email or Password is incorrect!'));
      if (signinResult == -3) return response.status(ResponseDataCode.NotFound).json(ResponseFailure(ResponseDataCode.NotFound, 'Fail to authenticate user credential passed in.'));
      if (signinResult == -11) return response.status(ResponseDataCode.Unexpected).json(ResponseFailure(ResponseDataCode.Unexpected, 'Fail to distribute token.'));

      // 3. Add token to cookie.
      const {refresh, ...rest } = signinResult;
      const cookieOptions = {httpOnly: true, secure: process.env.NODE_ENV === 'production'? true: false}
      response.cookie('r-token', refresh, cookieOptions)

      response.status(ResponseDataCode.OK).json(ResponseSuccess(signinResult));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /auth/signin:
  *   post:
  *     summary: User login
  *     description: User login to SGW.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's email.
  *                 example: mark.louise@sgw.com
  *               pwhash:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's password.
  *                 example: 48ab1d7a4f1d0f231ca46d9cc865c66f
  *     responses:
  *       200:
  *         description: User login Success.
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
  *                     access:
  *                       type: string
  *                       description: Access token.
  *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *                     refresh:
  *                       type: string
  *                       description: Refresh token.
  *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  *       404:
  *         description: Not Found.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 code:
  *                   type: integer
  *                   description: Response code.
  *                   example: 404
  *                 msg:
  *                   type: string
  *                   description: Response message.
  *                   example: "Not Found"
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
  */
  @httpPost('/signin')
  private async signin(
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const result = await this.signinAuthAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email or Password is incorrect!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Email or Password is incorrect!'));
      if (result == -3) return response.status(ResponseDataCode.NotFound).json(ResponseFailure(ResponseDataCode.NotFound, 'Fail to authenticate user credential passed in.'));
      if (result == -11) return response.status(ResponseDataCode.Unexpected).json(ResponseFailure(ResponseDataCode.Unexpected, 'Fail to distribute token.'));

      // Add token to cookie.
      const {refresh, ...rest } = result;
      const cookieOptions = {httpOnly: true, secure: process.env.NODE_ENV === 'production'? true: false}
      response.cookie('r-token', refresh, cookieOptions)

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /auth/signout:
  *   post:
  *     summary: User logout
  *     description: User logout SGW.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: User login Success.
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
  *                   description: Response message.
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
  *                   example: "Invalid Token"
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
  @httpPost('/signout')
  private async signout(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.signoutAuthAction.execute(authHeader, token.email);
      
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