import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  interfaces,
  next,
  request,
  requestHeaders,
  response,
} from 'inversify-express-utils';
import { IOC_TYPE } from '../../../config/type';
import { GetHomeAction } from '../../actions/home/get';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { getUserFromToken } from '../../../infra/utils/security';

@controller('/home')
export class HomeController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetHomeAction) public getHomeAction: GetHomeAction,
  ) { }

//   /**
// * @swagger
//   * /home/get:
//   *   get:
//   *     summary: Retrieve bill board & trail information for home page.
//   *     description: Retrieve bill board & trail information for home page.
//   *     security:
//   *       - apikey: []
//   *     responses:
//   *       200:
//   *         description: A list of bill board & trail data.
//   *         content:
//   *           application/json:
//   *             schema:
//   *               type: object
//   *               properties:
//   *                 code:
//   *                   type: integer
//   *                   description: Response code.
//   *                   example: 200
//   *                 msg:
//   *                   type: string
//   *                   description: Response message.
//   *                   example: ""
//   *                 data:
//   *                   type: array
//   *                   items:
//   *                     type: object
//   *                     properties:
//   *                       country:
//   *                         type: string
//   *                         description: The address's country.
//   *                         example: SINGAPORE
//   *                       block:
//   *                         type: string
//   *                         description: The address's block.
//   *                         example: 40
//   *                       propertyName:
//   *                         type: string
//   *                         description: The address's property name.
//   *                         example: The Excell
//   *                       street:
//   *                         type: string
//   *                         description: The address's street.
//   *                         example: East Coast Road
//   *                       unit:
//   *                         type: string
//   *                         description: The address's unit.
//   *                         example: 03-80
//   *                       province:
//   *                         type: string
//   *                         description: The address's province.
//   *                         example: SINGAPORE
//   *                       city:
//   *                         type: string
//   *                         description: The address's city.
//   *                         example: SINGAPORE
//   *                       postal:
//   *                         type: string
//   *                         description: The address's postal.
//   *                         example: 090088
//   *                       isDefault:
//   *                         type: boolean
//   *                         description: The user's default address.
//   *                         example: false
//   *                       key:
//   *                         type: string
//   *                         description: The address's key.
//   *                         example: "123456"
//   *       601:
//   *         description: Invalid Token.
//   *         content:
//   *           application/json:
//   *             schema:
//   *               type: object
//   *               properties:
//   *                 code:
//   *                   type: integer
//   *                   description: Response code.
//   *                   example: 601
//   *                 msg:
//   *                   type: string
//   *                   description: Response message.
//   *                   example: "Invalid Token!"
//   *                 data:
//   *                   type: string
//   *                   description: Response data.
//   *                   example: ""
//   *       602:
//   *         description: Unexpected.
//   *         content:
//   *           application/json:
//   *             schema:
//   *               type: object
//   *               properties:
//   *                 code:
//   *                   type: integer
//   *                   description: Response code.
//   *                   example: 602
//   *                 msg:
//   *                   type: string
//   *                   description: Response message.
//   *                   example: "Unexpected!"
//   *                 data:
//   *                   type: string
//   *                   description: Response data.
//   *                   example: ""
//   *       604:
//   *         description: Not Authorized.
//   *         content:
//   *           application/json:
//   *             schema:
//   *               type: object
//   *               properties:
//   *                 code:
//   *                   type: integer
//   *                   description: Response code.
//   *                   example: 604
//   *                 msg:
//   *                   type: string
//   *                   description: Response message.
//   *                   example: "Not Authorized"
//   *                 data:
//   *                   type: string
//   *                   description: Response data.
//   *                   example: ""
//   *       606:
//   *         description: Token Time Out.
//   *         content:
//   *           application/json:
//   *             schema:
//   *               type: object
//   *               properties:
//   *                 code:
//   *                   type: integer
//   *                   description: Response code.
//   *                   example: 606
//   *                 msg:
//   *                   type: string
//   *                   description: Response message.
//   *                   example: "Token Time Out!"
//   *                 data:
//   *                   type: string
//   *                   description: Response data.
//   *                   example: ""
//   */
  @httpGet('/get')
  private async get(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.getHomeAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}