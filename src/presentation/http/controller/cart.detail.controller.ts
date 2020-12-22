import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
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
import { GetCartDetailAction } from '../../actions/cart.detail/get';

@controller('/cartdetail')
export class CartDetailController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetCartDetailAction) private getCartDetailAction: GetCartDetailAction,
  ) { }

  /**
* @swagger
  * /cartdetail/get:
  *   get:
  *     summary: Retrieve cart item detail.
  *     description: Retrieve cart item detail.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: cartitemkey
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the cart item.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: Cart item detail.
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
  *                         description: The cart's key.
  *                         example: "123456"
  *                       type:
  *                         type: string
  *                         description: The cart's type (PRODUCT/TRAIL).
  *                         example: "TRAIL"
  *                       name:
  *                         type: string
  *                         description: The cart's name.
  *                         example: "Bugis Trail"
  *                       description:
  *                         type: string
  *                         description: The cart's description.
  *                         example: "Lorem ipsum dolor sit amet, consectetur..."
  *                       uri:
  *                         type: string
  *                         description: The cart's uri.
  *                         example: "https://via.placeholder.com/450x315.png"
  *                       qty:
  *                         type: number
  *                         description: The cart's qty.
  *                         example: 1
  *                       uom:
  *                         type: string
  *                         description: The cart's uom.
  *                         example: "TICKET"
  *                       price:
  *                         type: object
  *                         properties:
  *                           value:
  *                             type: number
  *                             description: The cart price's value.
  *                             example: 10.0
  *                           currency:
  *                             type: string
  *                             description: The cart price's currency.
  *                             example: "SGD"
  *                           taxable:
  *                             type: boolean
  *                             description: Does cart price taxable?
  *                             example: false
  *                           taxInPercentage:
  *                             type: number
  *                             description: The cart price tax in percentage.
  *                             example: 7
  *                           taxIncluded:
  *                             type: boolean
  *                             description: Does cart price included tax?
  *                             example: false
  *                       options:
  *                         type: object
  *                         properties:
  *                           model:
  *                             type: object
  *                             properties:
  *                               _key:
  *                                 type: string
  *                                 description: The cart options model's key.
  *                                 example: "123456"
  *                               type:
  *                                 type: number
  *                                 description: The cart options model's type.
  *                                 example: 1
  *                               code:
  *                                 type: string
  *                                 description: The cart options model's code.
  *                                 example: "BR-90"
  *                               name:
  *                                 type: string
  *                                 description: The cart options model's name?
  *                                 example: "BR-90"
  *                           bundle:
  *                             type: object
  *                             properties:
  *                               _key:
  *                                 type: string
  *                                 description: The cart options bundle's key.
  *                                 example: "123456"
  *                               type:
  *                                 type: number
  *                                 description: The cart options bundle's type.
  *                                 example: 1
  *                               code:
  *                                 type: string
  *                                 description: The cart options bundle's code.
  *                                 example: "01"
  *                               name:
  *                                 type: string
  *                                 description: The cart options bundle's name?
  *                                 example: "Standard"
  *                           color:
  *                             type: object
  *                             properties:
  *                               _key:
  *                                 type: string
  *                                 description: The cart options color's key.
  *                                 example: "123456"
  *                               type:
  *                                 type: number
  *                                 description: The cart options color's type.
  *                                 example: 2
  *                               code:
  *                                 type: string
  *                                 description: The cart options color's code.
  *                                 example: "01"
  *                               name:
  *                                 type: string
  *                                 description: The cart options color's name?
  *                                 example: "Standard"
  *                           wgt:
  *                             type: object
  *                             properties:
  *                               _key:
  *                                 type: string
  *                                 description: The cart options wgt's key.
  *                                 example: "123456"
  *                               type:
  *                                 type: number
  *                                 description: The cart options wgt's type.
  *                                 example: 1
  *                               code:
  *                                 type: string
  *                                 description: The cart options wgt's code.
  *                                 example: "C-250"
  *                               name:
  *                                 type: string
  *                                 description: The cart options wgt's name?
  *                                 example: "250g"
  *                           personas:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: string
  *                                   description: The cart options personas's type.
  *                                   example: 1
  *                                 contents:
  *                                   type: array
  *                                   items:
  *                                     type: object
  *                                     properties:
  *                                       sequence:
  *                                         type: number
  *                                         description: The trail detail's sequence.
  *                                         example: 1
  *                                       type:
  *                                         type: string
  *                                         description: The trail detail's type.
  *                                         example: "PHOTO"
  *                                       orientation:
  *                                         type: string
  *                                         description: The trail detail's orientation.
  *                                         example: "orientation"
  *                                       format:
  *                                         type: string
  *                                         description: The trail detail's format.
  *                                         example: "3R"
  *                                       uri:
  *                                         type: string
  *                                         description: The trail detail's uri.
  *                                         example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
  *                                       tag:
  *                                         type: string
  *                                         description: The trail detail's tag.
  *                                         example: "TOURIST-INDIVIDUAL"
  *                                       data:
  *                                         type: object
  *                                         properties:
  *                                           content:
  *                                             type: string
  *                                             description: The trail detail's content.
  *                                             example: "Tourist Individual participation information here...."
  *                                           price:
  *                                             type: object
  *                                             properties:
  *                                               value:
  *                                                 type: number
  *                                                 description: The trail detail price's value.
  *                                                 example: 10.0
  *                                               currency:
  *                                                 type: string
  *                                                 description: The trail detail price's currency.
  *                                                 example: "SGD"
  *                                               taxable:
  *                                                 type: boolean
  *                                                 description: Does trail detail price taxable?
  *                                                 example: false
  *                                               taxInPercentage:
  *                                                 type: number
  *                                                 description: The trail detail price tax in percentage.
  *                                                 example: 7
  *                                               taxIncluded:
  *                                                 type: boolean
  *                                                 description: Does trail detail price included tax?
  *                                                 example: false
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
    @queryParam('cartitemkey') cartItemKey: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.getCartDetailAction.execute(cartItemKey);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cart Item key is empty!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}