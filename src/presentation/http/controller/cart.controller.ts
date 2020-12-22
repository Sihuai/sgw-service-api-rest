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
import { GetCartAction } from '../../actions/cart/get';
import { CreateCartAction } from '../../actions/cart/create';
import { EditCartAction } from '../../actions/cart/edit';
import { DeleteCartAction } from '../../actions/cart/delete';
import { CountCartAction } from '../../actions/cart/count';

@controller('/cart')
export class CartController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetCartAction) public getCartAction: GetCartAction,
    @inject(IOC_TYPE.CreateCartAction) public createCartAction: CreateCartAction,
    @inject(IOC_TYPE.EditCartAction) public editCartAction: EditCartAction,
    @inject(IOC_TYPE.DeleteCartAction) public deleteCartAction: DeleteCartAction,
    @inject(IOC_TYPE.CountCartAction) public countCartAction: CountCartAction,
  ) { }

  /**
* @swagger
  * /cart/get:
  *   get:
  *     summary: Retrieve a list of cart items.
  *     description: Retrieve a list of cart items.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of cart items.
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
  *                           persona:
  *                             type: object
  *                             properties:
  *                               type:
  *                                 type: number
  *                                 description: The cart options persona's type (trail detail persona sequence).
  *                                 example: 1
  *                               code:
  *                                 type: string
  *                                 description: The cart options persona's code (trail detail persona tag).
  *                                 example: "PERSONA-FAMILY-3PAX"
  *                               name:
  *                                 type: string
  *                                 description: The cart options persona's name (trail detail persona tag)?
  *                                 example: "PERSONA-FAMILY-3PAX"
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

      const result = await this.getCartAction.execute(token);

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /cart/count:
  *   get:
  *     summary: Retrieve cart item quantity.
  *     description: Retrieve cart item quantity.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: Cart Item item quantity.
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
  *                   type: number
  *                   description: Response data.
  *                   example: 1
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
  @httpGet('/count')
  private async count(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.countCartAction.execute(token);

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /cart/create:
  *   post:
  *     summary: Create cart item.
  *     description: Create cart item.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               typekey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The Product/Trail Detail key.
  *                 example: "123456"
  *               type:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's type (PRODUCT/TRAIL).
  *                 example: "TRAIL"
  *               name:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's name.
  *                 example: "Bugis Trail"
  *               description:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               uri:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's uri.
  *                 example: "https://via.placeholder.com/450x315.png"
  *               qty:
  *                 type: number
  *                 allowEmptyValue: false
  *                 description: The cart's qty.
  *                 example: 1
  *               uom:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's uom.
  *                 example: "TICKET"
  *               price:
  *                 type: object
  *                 properties:
  *                   value:
  *                     type: number
  *                     allowEmptyValue: false
  *                     description: The cart price's value.
  *                     example: 10.0
  *                   currency:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The cart price's currency.
  *                     example: "SGD"
  *                   taxable:
  *                     type: boolean
  *                     allowEmptyValue: false
  *                     description: Does cart price taxable?
  *                     example: false
  *                   taxInPercentage:
  *                     type: number
  *                     allowEmptyValue: true
  *                     description: The cart price tax in percentage.
  *                     example: 7
  *                   taxIncluded:
  *                     type: boolean
  *                     allowEmptyValue: true
  *                     description: Does cart price included tax?
  *                     example: false
  *               options:
  *                 type: object
  *                 allowEmptyValue: false
  *                 properties:
  *                   model:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options model's type.
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options model's code.
  *                         example: "BR-90"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options model's name?
  *                         example: "BR-90"
  *                   bundle:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options bundle's type.
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options bundle's code.
  *                         example: "01"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options bundle's name?
  *                         example: "Standard"
  *                   color:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options color's type.
  *                         example: 2
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options color's code.
  *                         example: "01"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options color's name?
  *                         example: "Standard"
  *                   wgt:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options wgt's type.
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options wgt's code.
  *                         example: "C-250"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options wgt's name?
  *                         example: "250g"
  *                   persona:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options persona's type (trail detail persona sequence).
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options persona's code (trail detail persona tag).
  *                         example: "PERSONA-FAMILY-3PAX"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options persona's name (trail detail persona tag)?
  *                         example: "PERSONA-FAMILY-3PAX"
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
  *                       description: cart's key.
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
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.createCartAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product/Trail key is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'URI is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Quantity is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'UOM is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price value is less than zero!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price currency is empty!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Can not save Cart Item information!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to save Cart Item Trail Product relation!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /cart/edit:
  *   post:
  *     summary: Edit cart item.
  *     description: Edit cart item.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               _key:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's key.
  *                 example: "123456"
  *               type:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's type (PRODUCT/TRAIL).
  *                 example: "TRAIL"
  *               name:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's name.
  *                 example: "Bugis Trail"
  *               description:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               uri:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's uri.
  *                 example: "https://via.placeholder.com/450x315.png"
  *               qty:
  *                 type: number
  *                 allowEmptyValue: false
  *                 description: The cart's qty.
  *                 example: 1
  *               uom:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The cart's uom.
  *                 example: "TICKET"
  *               price:
  *                 type: object
  *                 properties:
  *                   value:
  *                     type: number
  *                     allowEmptyValue: false
  *                     description: The cart price's value.
  *                     example: 10.0
  *                   currency:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The cart price's currency.
  *                     example: "SGD"
  *                   taxable:
  *                     type: boolean
  *                     allowEmptyValue: false
  *                     description: Does cart price taxable?
  *                     example: false
  *                   taxInPercentage:
  *                     type: number
  *                     allowEmptyValue: true
  *                     description: The cart price tax in percentage.
  *                     example: 7
  *                   taxIncluded:
  *                     type: boolean
  *                     allowEmptyValue: true
  *                     description: Does cart price included tax?
  *                     example: false
  *               options:
  *                 type: object
  *                 allowEmptyValue: false
  *                 properties:
  *                   model:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options model's type.
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options model's code.
  *                         example: "BR-90"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options model's name?
  *                         example: "BR-90"
  *                   bundle:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options bundle's type.
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options bundle's code.
  *                         example: "01"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options bundle's name?
  *                         example: "Standard"
  *                   color:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options color's type.
  *                         example: 2
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options color's code.
  *                         example: "01"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options color's name?
  *                         example: "Standard"
  *                   wgt:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options wgt's type.
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options wgt's code.
  *                         example: "C-250"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options wgt's name?
  *                         example: "250g"
  *                   persona:
  *                     type: object
  *                     allowEmptyValue: true
  *                     properties:
  *                       type:
  *                         type: number
  *                         allowEmptyValue: false
  *                         description: The cart options persona's type (trail detail persona sequence).
  *                         example: 1
  *                       code:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options persona's code (trail detail persona tag).
  *                         example: "PERSONA-FAMILY-3PAX"
  *                       name:
  *                         type: string
  *                         allowEmptyValue: false
  *                         description: The cart options persona's name (trail detail persona tag)?
  *                         example: "PERSONA-FAMILY-3PAX"
  *     responses:
  *       200:
  *         description: Success edit.
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
  *                       description: cart's id.
  *                       example: "CartItem/123456"
  *                     _key:
  *                       type: string
  *                       description: cart's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: cart's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: cart's old revision.
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
  @httpPost('/edit')
  private async edit(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.editCartAction.execute(token, request.body);
      // if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product/Trail key is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'URI is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Quantity is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'UOM is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price value is less than zero!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price currency is empty!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cart Item key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cart Item is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /cart/delete:
  *   delete:
  *     summary: Delete cart item.
  *     description: Delete cart item.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the cart item.
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

      const result = await this.deleteCartAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Cart Item is not exist!'));
      if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove Cart Item Trail Product relation!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}