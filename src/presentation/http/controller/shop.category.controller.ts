import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  interfaces,
  next,
  queryParam,
  request,
  requestHeaders,
  response,
} from 'inversify-express-utils';
import { IOC_TYPE } from '../../../config/type';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { getUserFromToken } from '../../../infra/utils/security';
import { GetShopCategoryAction } from '../../actions/shop.category/get';

@controller('/shopcategory')
export class ShopCategoryController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetShopCategoryAction) private getShopCategoryAction: GetShopCategoryAction,
  ) { }

  /**
* @swagger
  * /shopcategory/getshop:
  *   get:
  *     summary: Retrieve a list of shop.
  *     description: Retrieve a list of shop.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               type:
  *                 type: string
  *                 description: The shop category's type(G-MALL/TRAILS-SHOPS).
  *                 example: "TRAILS-SHOPS"
  *               view:
  *                 type: string
  *                 description: The shop category's view(PRODUCTS/SHOPS/ALL).
  *                 example: "PRODUCTS"
  *     responses:
  *       200:
  *         description: A list of shop.
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
  *                   type: array
  *                   items:
  *                     type: object
  *                     properties:
  *                       _key:
  *                         type: string
  *                         description: The shop's key.
  *                         example: "123456"
  *                       categories:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             sequence:
  *                               type: number
  *                               description: The shop category's sequence.
  *                               example: 1
  *                             name:
  *                               type: string
  *                               description: The shop category's name.
  *                               example: "Level 1 / Brand A"
  *                             color:
  *                               type: string
  *                               description: The shop category's color.
  *                               example: "#5DB4E4"
  *                       trails:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             sequence:
  *                               type: number
  *                               description: The shop category's sequence.
  *                               example: 1
  *                             name:
  *                               type: string
  *                               description: The shop category's name.
  *                               example: "Bugis Trail"
  *                             color:
  *                               type: string
  *                               description: The shop category's color.
  *                               example: "#5DB4E4"
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
 @httpGet('/get')
 private async get(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

    //  const result = await this.getShopAction.execute(key);
    //  if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Category Key is empty!'));
    //  if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'No shop data!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess('result'));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }
}