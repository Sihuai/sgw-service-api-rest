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
import { GetOrderAction } from '../../actions/order/get';
import { CreateOrderAction } from '../../actions/order/create';
import { DeleteOrderAction } from '../../actions/order/delete';
import { PagingOrderAction } from '../../actions/order/paging';

@controller('/order')
export class OrderController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetOrderAction) private getOrderAction: GetOrderAction,
    @inject(IOC_TYPE.PagingOrderAction) private pagingOrderAction: PagingOrderAction,
    @inject(IOC_TYPE.CreateOrderAction) private createOrderAction: CreateOrderAction,
    @inject(IOC_TYPE.DeleteOrderAction) private deleteOrderAction: DeleteOrderAction,
  ) { }

  /**
* @swagger
  * /order/get:
  *   get:
  *     summary: Retrieve a list of order.
  *     description: Retrieve a list of order.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of order.
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
  *                         description: The order's key.
  *                         example: "123456"
  *                       sn:
  *                         type: string
  *                         description: The order's sn (YYMMDD-HHmmss-SSS).
  *                         example: "210101-144129-526"
  *                       tag:
  *                         type: string
  *                         description: The order's tag (user email/key).
  *                         example: "mark.louise@sgw.com"
  *                       quantity:
  *                         type: number
  *                         description: The order's quantity.
  *                         example: 2
  *                       status:
  *                         type: string
  *                         description: The order's status (OPEN/CLOSED).
  *                         example: "OPEN"
  *                       amount:
  *                         type: object
  *                         properties:
  *                           value:
  *                             type: number
  *                             description: The order price's value.
  *                             example: 10.0
  *                           currency:
  *                             type: string
  *                             description: The order price's currency.
  *                             example: "SGD"
  *                           taxable:
  *                             type: boolean
  *                             description: Does order price taxable?
  *                             example: false
  *                           taxInPercentage:
  *                             type: number
  *                             description: The order price tax in percentage.
  *                             example: 7
  *                           taxIncluded:
  *                             type: boolean
  *                             description: Does order price included tax?
  *                             example: false
  *                       delivery:
  *                         type: object
  *                         properties:
  *                           model:
  *                             type: object
  *                             properties:
  *                               country:
  *                                 type: string
  *                                 description: The order address's country.
  *                                 example: SINGAPORE
  *                               block:
  *                                 type: string
  *                                 description: The order address's block.
  *                                 example: 40
  *                               propertyName:
  *                                 type: string
  *                                 description: The order address's property name.
  *                                 example: The Excell
  *                               street:
  *                                 type: string
  *                                 description: The order address's street.
  *                                 example: East Coast Road
  *                               unit:
  *                                 type: string
  *                                 description: The order address's unit.
  *                                 example: 03-80
  *                               province:
  *                                 type: string
  *                                 description: The order address's province.
  *                                 example: SINGAPORE
  *                               city:
  *                                 type: string
  *                                 description: The order address's city.
  *                                 example: SINGAPORE
  *                               postal:
  *                                 type: string
  *                                 description: The order address's postal.
  *                                 example: 090088
  *                               isDefault:
  *                                 type: boolean
  *                                 description: The user's default order address.
  *                                 example: false
  *                               recipient:
  *                                 type: string
  *                                 description: The order address's recipient.
  *                                 example: "Mark Louise"
  *                               mobile:
  *                                 type: string
  *                                 description: The order address's mobile.
  *                                 example: "+082 2568425"
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
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.getOrderAction.execute(token);

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /order/paging:
  *   get:
  *     summary: Retrieve order information by paging.
  *     description: Retrieve order information by paging.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: index
  *         required: true
  *         allowEmptyValue: false
  *         description: index of the order.
  *         schema:
  *           type: number
  *         style: simple
  *         example: 0
  *     responses:
  *       200:
  *         description: A list of order data.
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
  *                     _key:
  *                       type: string
  *                       description: The order's key.
  *                       example: "123456"
  *                     sn:
  *                       type: string
  *                       description: The order's sn (YYMMDD-HHmmss-SSS).
  *                       example: "210101-144129-526"
  *                     tag:
  *                       type: string
  *                       description: The order's tag (user email/key).
  *                       example: "mark.louise@sgw.com"
  *                     quantity:
  *                       type: number
  *                       description: The order's quantity.
  *                       example: 2
  *                     status:
  *                       type: string
  *                       description: The order's status (OPEN/CLOSED).
  *                       example: "OPEN"
  *                     amount:
  *                       type: object
  *                       properties:
  *                         value:
  *                           type: number
  *                           description: The order price's value.
  *                           example: 10.0
  *                         currency:
  *                           type: string
  *                           description: The order price's currency.
  *                           example: "SGD"
  *                         taxable:
  *                           type: boolean
  *                           description: Does order price taxable?
  *                           example: false
  *                         taxInPercentage:
  *                           type: number
  *                           description: The order price tax in percentage.
  *                           example: 7
  *                         taxIncluded:
  *                           type: boolean
  *                           description: Does order price included tax?
  *                           example: false
  *                     delivery:
  *                       type: object
  *                       properties:
  *                         model:
  *                           type: object
  *                           properties:
  *                             country:
  *                               type: string
  *                               description: The order address's country.
  *                               example: SINGAPORE
  *                             block:
  *                               type: string
  *                               description: The order address's block.
  *                               example: 40
  *                             propertyName:
  *                               type: string
  *                               description: The order address's property name.
  *                               example: The Excell
  *                             street:
  *                               type: string
  *                               description: The order address's street.
  *                               example: East Coast Road
  *                             unit:
  *                               type: string
  *                               description: The order address's unit.
  *                               example: 03-80
  *                             province:
  *                               type: string
  *                               description: The order address's province.
  *                               example: SINGAPORE
  *                             city:
  *                               type: string
  *                               description: The order address's city.
  *                               example: SINGAPORE
  *                             postal:
  *                               type: string
  *                               description: The order address's postal.
  *                               example: 090088
  *                             isDefault:
  *                               type: boolean
  *                               description: The user's default order address.
  *                               example: false
  *                             recipient:
  *                               type: string
  *                               description: The order address's recipient.
  *                               example: "Mark Louise"
  *                             mobile:
  *                               type: string
  *                               description: The order address's mobile.
  *                               example: "+082 2568425"
  *                     pagination:
  *                       type: object
  *                       properties:
  *                         total:
  *                           type: number
  *                           description: The order pagination's total.
  *                           example: 1
  *                         index:
  *                           type: number
  *                           description: The order pagination's index.
  *                           example: 1
  *                         records:
  *                           type: object
  *                           properties:
  *                             pageSize:
  *                               type: number
  *                               description: The order pagination's pageSize.
  *                               example: 10
  *                             pageIndex:
  *                               type: number
  *                               description: The order pagination's pageIndex.
  *                               example: 0
  *                             total:
  *                               type: number
  *                               description: The order pagination's total.
  *                               example: 1
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
 @httpGet('/paging')
 private async paging(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('index') index: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.pagingOrderAction.execute(token, parseInt(index));
     
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /order/create:
  *   post:
  *     summary: Create order item for checkout.
  *     description: Create order item for checkout.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: addresskey
  *         required: false
  *         allowEmptyValue: false
  *         description: Key of the address.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: Create Success.
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
  *                     _key:
  *                       type: string
  *                       description: order's key.
  *                       example: "123456"
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
  @httpPost('/create')
  private async create(
    @requestHeaders('authorization') authHeader: string,
    @queryParam('addresskey') addressKey: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.createOrderAction.execute(token, addressKey);

      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Order items have difference currency!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Address key is empty!'));
      if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to create order information!'));
      if (result == -14) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to create order item information!'));
      if (result == -15) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to create order & order item relation!'));
      if (result == -16) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to create cart item & order item relation!'));
      if (result == -17) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to create order & order address relation!'));
      if (result == -18) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove cart item!'));
      if (result == -19) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to get cart & trail & product relation!'));
      if (result == -20) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove cart & trail & product relation!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /order/delete:
  *   delete:
  *     summary: Delete order.
  *     description: Delete order.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the order.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: Delete Success.
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
  @httpDelete('/delete')
  private async delete(
    @requestHeaders('authorization') authHeader: string,
    @queryParam('key') key: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.deleteOrderAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Order is not exist!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Order & Order Item relation is not exist!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Order Item is not exist!'));
      if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Cart Item & Order Item relation is not exist!'));
      if (result == -14) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove Order Item!'));
      if (result == -15) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Order & Order Item relation is not exist!'));
      if (result == -16) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove Order & Order Item relation!'));
      if (result == -17) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove Order Address!'));
      if (result == -18) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Order & Order Address relation is not exist!'));
      if (result == -19) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove Cart Item & Order Item relation!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}