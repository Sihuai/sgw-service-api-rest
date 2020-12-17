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
import { GetUserAction } from '../../actions/user/get';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { EditUserAction } from '../../actions/user/edit';
import { getUserFromToken } from '../../../infra/utils/security';

@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetUserAction) public getUserAction: GetUserAction,
    @inject(IOC_TYPE.EditUserAction) public editUserAction: EditUserAction,
  ) { }

  /**
* @swagger
  * /user/get:
  *   get:
  *     summary: Retrieve user's profile.
  *     description: Retrieve user's profile.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: User's profile information.
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
  *                     email:
  *                       type: string
  *                       description: The user's email.
  *                       example: mark.louise@sgw.com
  *                     nameFirst:
  *                       type: string
  *                       description: The user's first name.
  *                       example: Mark
  *                     nameLast:
  *                       type: string
  *                       description: The user's last name.
  *                       example: Louise
  *                     nick:
  *                       type: string
  *                       description: The user's nick name.
  *                       example: Louise
  *                     gender:
  *                       type: string
  *                       description: The user's gender.
  *                       example: 25
  *                     dob:
  *                       type: string
  *                       description: The user's dob.
  *                       example: 2000-05-09
  *                     headerUri:
  *                       type: string
  *                       description: The user's header uri.
  *                       example: https://sgw.com/image/123456.png
  *                     role:
  *                       type: string
  *                       description: The user's role.
  *                       example: Guest
  *                     _key:
  *                       type: string
  *                       description: The user's key.
  *                       example: "123456"
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
  @httpGet('/get')
  private async get(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.getUserAction.execute(token);
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /user/edit:
  *   post:
  *     summary: Edit user's profile.
  *     description: Edit user's profile.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nameFirst:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The user's first name.
  *                 example: Mark
  *               nameLast:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The user's last name.
  *                 example: Louise
  *               nick:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The user's nick name.
  *                 example: Louise
  *               gender:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The user's gender.
  *                 example: 25
  *               dob:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The user's dob.
  *                 example: 2000-05-09
  *               headerUri:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The user's header uri.
  *                 example: https://sgw.com/image/123456.png
  *               _key:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The user's key.
  *                 example: 123456
  *     responses:
  *       200:
  *         description: Success edit user's profile.
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
  *                       example: "Users/123456"
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
  @httpPost('/edit')
  private async edit(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.editUserAction.execute(request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'User isnot existed!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}