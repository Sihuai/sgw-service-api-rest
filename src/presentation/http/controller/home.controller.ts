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

  /**
* @swagger
  * /home/get:
  *   get:
  *     summary: Retrieve bill board & trail information for home page.
  *     description: Retrieve bill board & trail information for home page.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of bill board & trail data.
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
  *                     billboard:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           _key:
  *                             type: string
  *                             description: The bill board's key.
  *                             example: "123456"
  *                           type:
  *                             type: string
  *                             description: The bill board's type.
  *                             example: "1"
  *                           contents:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 sequence:
  *                                   type: number
  *                                   description: The bill board's sequence.
  *                                   example: 1
  *                                 titles:
  *                                   type: array
  *                                   items:
  *                                     type: string
  *                                     description: The bill board's titles.
  *                                     example: "BUGIS"
  *                                 captions:
  *                                   type: array
  *                                   items:
  *                                     type: string
  *                                     description: The bill board's captions.
  *                                     example: "Food"
  *                                 type:
  *                                   type: string
  *                                   description: The bill board's string.
  *                                   example: "PHOTO"
  *                                 orientation:
  *                                   type: string
  *                                   description: The bill board's orientation.
  *                                   example: "LANDSCAPE"
  *                                 format:
  *                                   type: string
  *                                   description: The bill board's format.
  *                                   example: "3R"
  *                                 uri:
  *                                   type: string
  *                                   description: The bill board's uri.
  *                                   example: "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png"
  *                     sections:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           _key:
  *                             type: string
  *                             description: The section's key.
  *                             example: "123456"
  *                           sequence:
  *                             type: number
  *                             description: The section's number.
  *                             example: 1
  *                           header:
  *                             type: string
  *                             description: The section's header.
  *                             example: "Foodie Trails"
  *                           uri:
  *                             type: string
  *                             description: The section's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Mobile_App-09.png"
  *                           color:
  *                             type: string
  *                             description: The section's color.
  *                             example: "#B267A9"
  *                           trails:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 sequence:
  *                                   type: number
  *                                   description: The section trail's sequence.
  *                                   example: 1
  *                                 title:
  *                                   type: string
  *                                   description: The section trail's title.
  *                                   example: "BUGIS Trail - 01"
  *                                 media:
  *                                   type: object
  *                                   properties:
  *                                     type:
  *                                       type: string
  *                                       description: The section trail's string.
  *                                       example: "PHOTO"
  *                                     orientation:
  *                                       type: string
  *                                       description: The section trail's orientation.
  *                                       example: "LANDSCAPE"
  *                                     format:
  *                                       type: string
  *                                       description: The section trail's format.
  *                                       example: "3R"
  *                                     uri:
  *                                       type: string
  *                                       description: The section trail's uri.
  *                                       example: "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png"
  *                           pagination:
  *                             type: object
  *                             properties:
  *                               total:
  *                                 type: number
  *                                 description: The section pagination's total.
  *                                 example: 1
  *                               index:
  *                                 type: number
  *                                 description: The section pagination's index.
  *                                 example: 1
  *                               records:
  *                                 type: object
  *                                 properties:
  *                                   pageSize:
  *                                     type: number
  *                                     description: The section pagination's pageSize.
  *                                     example: 10
  *                                   pageIndex:
  *                                     type: number
  *                                     description: The section pagination's pageIndex.
  *                                     example: 0
  *                                   total:
  *                                     type: number
  *                                     description: The section pagination's total.
  *                                     example: 1
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
  @httpGet('/get')
  private async get(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.getHomeAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}