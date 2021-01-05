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
import { GetProductAction } from '../../actions/product/get';
import { CreateProductAction } from '../../actions/product/create';
import { EditProductAction } from '../../actions/product/edit';
import { DeleteProductAction } from '../../actions/product/delete';

@controller('/product')
export class ProductController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetProductAction) private getProductAction: GetProductAction,
    @inject(IOC_TYPE.CreateProductAction) private createProductAction: CreateProductAction,
    @inject(IOC_TYPE.EditProductAction) private editProductAction: EditProductAction,
    @inject(IOC_TYPE.DeleteProductAction) private deleteProductAction: DeleteProductAction,
  ) { }

  /**
* @swagger
  * /product/get:
  *   get:
  *     summary: Retrieve a list of product.
  *     description: Retrieve a list of product.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of product.
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
  *                         description: The product's key.
  *                         example: "123456"
  *                       sku:
  *                         type: string
  *                         description: The product's sku.
  *                         example: "A-2020-01"
  *                       name:
  *                         type: string
  *                         description: The product's name.
  *                         example: "Product A-1"
  *                       description:
  *                         type: string
  *                         description: The product's description.
  *                         example: "Lorem ipsum dolor sit amet, consectetur..."
  *                       options:
  *                         type: object
  *                         properties:
  *                           models:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: number
  *                                   description: The product model's type.
  *                                   example: 1
  *                                 code:
  *                                   type: string
  *                                   description: The product model's code.
  *                                   example: "BR-90"
  *                                 name:
  *                                   type: string
  *                                   description: The product model's name?
  *                                   example: "BR-90"
  *                           bundles:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: number
  *                                   description: The product bundle's type.
  *                                   example: 1
  *                                 code:
  *                                   type: string
  *                                   description: The product bundle's code.
  *                                   example: "01"
  *                                 name:
  *                                   type: string
  *                                   description: The product bundle's name?
  *                                   example: "Standard"
  *                           colors:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   ype: number
  *                                   description: The product color's type.
  *                                   example: 2
  *                                 code:
  *                                   type: string
  *                                   description: The product color's code.
  *                                   example: "01"
  *                                 name:
  *                                   type: string
  *                                   description: The product color's name?
  *                                   example: "Standard"
  *                           wgt:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: number
  *                                   description: The product wgt's type.
  *                                   example: 1
  *                                 code:
  *                                   type: string
  *                                   description: The product wgt's code.
  *                                   example: "C-250"
  *                                 name:
  *                                   type: string
  *                                   description: The product wgt's name.
  *                                   example: "250g"
  *                       delivery:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             type:
  *                               type: number
  *                               description: The product delivery's type.
  *                               example: 1
  *                             code:
  *                               type: string
  *                               description: The product delivery's code.
  *                               example: "DOOR-TO-DOOR"
  *                             name:
  *                               type: string
  *                               description: The product delivery's name.
  *                               example: "Door-to-Door"
  *                       price:
  *                         type: object
  *                         properties:
  *                           value:
  *                             type: number
  *                             description: The product price's value.
  *                             example: 10.0
  *                           currency:
  *                             type: string
  *                             description: The product price's currency.
  *                             example: "SGD"
  *                           taxable:
  *                             type: boolean
  *                             description: Does product price taxable?
  *                             example: false
  *                           taxInPercentage:
  *                             type: number
  *                             description: The product price tax in percentage.
  *                             example: 7
  *                           taxIncluded:
  *                             type: boolean
  *                             description: Does product price included tax?
  *                             example: false
  *                       posters:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             type:
  *                               type: string
  *                               description: The product's string.
  *                               example: "PHOTO"
  *                             orientation:
  *                               type: string
  *                               description: The product's orientation.
  *                               example: "LANDSCAPE"
  *                             format:
  *                               type: string
  *                               description: The product's format.
  *                               example: "3R"
  *                             uri:
  *                               type: string
  *                               description: The product's uri.
  *                               example: "https://via.placeholder.com/450x315.png"
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

      const result = await this.getProductAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /product/create:
  *   post:
  *     summary: Create product.
  *     description: Create product.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               sku:
  *                 type: string
  *                 description: The product's sku.
  *                 example: "A-2020-01"
  *               name:
  *                 type: string
  *                 description: The product's name.
  *                 example: "Product A-1"
  *               description:
  *                 type: string
  *                 description: The product's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               options:
  *                 type: object
  *                 properties:
  *                   models:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           type: number
  *                           description: The product model's type.
  *                           example: 1
  *                         code:
  *                           type: string
  *                           description: The product model's code.
  *                           example: "BR-90"
  *                         name:
  *                           type: string
  *                           description: The product model's name?
  *                           example: "BR-90"
  *                   bundles:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           type: number
  *                           description: The product bundle's type.
  *                           example: 1
  *                         code:
  *                           type: string
  *                           description: The product bundle's code.
  *                           example: "01"
  *                         name:
  *                           type: string
  *                           description: The product bundle's name?
  *                           example: "Standard"
  *                   colors:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           ype: number
  *                           description: The product color's type.
  *                           example: 2
  *                         code:
  *                           type: string
  *                           description: The product color's code.
  *                           example: "01"
  *                         name:
  *                           type: string
  *                           description: The product color's name?
  *                           example: "Standard"
  *                   wgt:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           type: number
  *                           description: The product wgt's type.
  *                           example: 1
  *                         code:
  *                           type: string
  *                           description: The product wgt's code.
  *                           example: "C-250"
  *                         name:
  *                           type: string
  *                           description: The product wgt's name.
  *                           example: "250g"
  *               delivery:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: number
  *                       description: The product delivery's type.
  *                       example: 1
  *                     code:
  *                       type: string
  *                       description: The product delivery's code.
  *                       example: "DOOR-TO-DOOR"
  *                     name:
  *                       type: string
  *                       description: The product delivery's name.
  *                       example: "Door-to-Door"
  *               price:
  *                 type: object
  *                 properties:
  *                   value:
  *                     type: number
  *                     description: The product price's value.
  *                     example: 10.0
  *                   currency:
  *                     type: string
  *                     description: The product price's currency.
  *                     example: "SGD"
  *                   taxable:
  *                     type: boolean
  *                     description: Does product price taxable?
  *                     example: false
  *                   taxInPercentage:
  *                     type: number
  *                     description: The product price tax in percentage.
  *                     example: 7
  *                   taxIncluded:
  *                     type: boolean
  *                     description: Does product price included tax?
  *                     example: false
  *               posters:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: string
  *                       description: The product's string.
  *                       example: "PHOTO"
  *                     orientation:
  *                       type: string
  *                       description: The product's orientation.
  *                       example: "LANDSCAPE"
  *                     format:
  *                       type: string
  *                       description: The product's format.
  *                       example: "3R"
  *                     uri:
  *                       type: string
  *                       description: The product's uri.
  *                       example: "https://via.placeholder.com/450x315.png"
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
  *                       description: The product's key.
  *                       example: "123456"
  *                     sku:
  *                         type: string
  *                         description: The product's sku.
  *                         example: "A-2020-01"
  *                     name:
  *                         type: string
  *                         description: The product's name.
  *                         example: "Product A-1"
  *                     description:
  *                         type: string
  *                         description: The product's description.
  *                         example: "Lorem ipsum dolor sit amet, consectetur..."
  *                     options:
  *                       type: object
  *                       properties:
  *                         models:
  *                           type: array
  *                           items:
  *                             type: object
  *                             properties:
  *                               type:
  *                                 type: number
  *                                 description: The product model's type.
  *                                 example: 1
  *                               code:
  *                                 type: string
  *                                 description: The product model's code.
  *                                 example: "BR-90"
  *                               name:
  *                                 type: string
  *                                 description: The product model's name?
  *                                 example: "BR-90"
  *                         bundles:
  *                           type: array
  *                           items:
  *                             type: object
  *                             properties:
  *                               type:
  *                                 type: number
  *                                 description: The product bundle's type.
  *                                 example: 1
  *                               code:
  *                                 type: string
  *                                 description: The product bundle's code.
  *                                 example: "01"
  *                               name:
  *                                 type: string
  *                                 description: The product bundle's name?
  *                                 example: "Standard"
  *                         colors:
  *                           type: array
  *                           items:
  *                             type: object
  *                             properties:
  *                               type:
  *                                 ype: number
  *                                 description: The product color's type.
  *                                 example: 2
  *                               code:
  *                                 type: string
  *                                 description: The product color's code.
  *                                 example: "01"
  *                               name:
  *                                 type: string
  *                                 description: The product color's name?
  *                                 example: "Standard"
  *                         wgt:
  *                           type: array
  *                           items:
  *                             type: object
  *                             properties:
  *                               type:
  *                                 type: number
  *                                 description: The product wgt's type.
  *                                 example: 1
  *                               code:
  *                                 type: string
  *                                 description: The product wgt's code.
  *                                 example: "C-250"
  *                               name:
  *                                 type: string
  *                                 description: The product wgt's name.
  *                                 example: "250g"
  *                     delivery:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           type:
  *                             type: number
  *                             description: The product delivery's type.
  *                             example: 1
  *                           code:
  *                             type: string
  *                             description: The product delivery's code.
  *                             example: "DOOR-TO-DOOR"
  *                           name:
  *                             type: string
  *                             description: The product delivery's name.
  *                             example: "Door-to-Door"
  *                     price:
  *                       type: object
  *                       properties:
  *                         value:
  *                           type: number
  *                           description: The product price's value.
  *                           example: 10.0
  *                         currency:
  *                           type: string
  *                           description: The product price's currency.
  *                           example: "SGD"
  *                         taxable:
  *                           type: boolean
  *                           description: Does product price taxable?
  *                           example: false
  *                         taxInPercentage:
  *                           type: number
  *                           description: The product price tax in percentage.
  *                           example: 7
  *                         taxIncluded:
  *                           type: boolean
  *                           description: Does product price included tax?
  *                           example: false
  *                     posters:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           type:
  *                             type: string
  *                             description: The product's string.
  *                             example: "PHOTO"
  *                           orientation:
  *                             type: string
  *                             description: The product's orientation.
  *                             example: "LANDSCAPE"
  *                           format:
  *                             type: string
  *                             description: The product's format.
  *                             example: "3R"
  *                           uri:
  *                             type: string
  *                             description: The product's uri.
  *                             example: "https://via.placeholder.com/450x315.png"
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
      
      const result = await this.createProductAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'SKU is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Options is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Delivery is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price value is less than zero!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price currency is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters type is empty!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters orientation is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters format is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters uri is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Exist same SKU!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /product/edit:
  *   post:
  *     summary: Edit user's product.
  *     description: Edit user's product.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               sku:
  *                 type: string
  *                 description: The product's sku.
  *                 example: "A-2020-01"
  *               name:
  *                 type: string
  *                 description: The product's name.
  *                 example: "Product A-1"
  *               description:
  *                 type: string
  *                 description: The product's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               options:
  *                 type: object
  *                 properties:
  *                   models:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           type: number
  *                           description: The product model's type.
  *                           example: 1
  *                         code:
  *                           type: string
  *                           description: The product model's code.
  *                           example: "BR-90"
  *                         name:
  *                           type: string
  *                           description: The product model's name?
  *                           example: "BR-90"
  *                   bundles:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           type: number
  *                           description: The product bundle's type.
  *                           example: 1
  *                         code:
  *                           type: string
  *                           description: The product bundle's code.
  *                           example: "01"
  *                         name:
  *                           type: string
  *                           description: The product bundle's name?
  *                           example: "Standard"
  *                   colors:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           ype: number
  *                           description: The product color's type.
  *                           example: 2
  *                         code:
  *                           type: string
  *                           description: The product color's code.
  *                           example: "01"
  *                         name:
  *                           type: string
  *                           description: The product color's name?
  *                           example: "Standard"
  *                   wgt:
  *                     type: array
  *                     items:
  *                       type: object
  *                       properties:
  *                         type:
  *                           type: number
  *                           description: The product wgt's type.
  *                           example: 1
  *                         code:
  *                           type: string
  *                           description: The product wgt's code.
  *                           example: "C-250"
  *                         name:
  *                           type: string
  *                           description: The product wgt's name.
  *                           example: "250g"
  *               delivery:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: number
  *                       description: The product delivery's type.
  *                       example: 1
  *                     code:
  *                       type: string
  *                       description: The product delivery's code.
  *                       example: "DOOR-TO-DOOR"
  *                     name:
  *                       type: string
  *                       description: The product delivery's name.
  *                       example: "Door-to-Door"
  *               price:
  *                 type: object
  *                 properties:
  *                   value:
  *                     type: number
  *                     description: The product price's value.
  *                     example: 10.0
  *                   currency:
  *                     type: string
  *                     description: The product price's currency.
  *                     example: "SGD"
  *                   taxable:
  *                     type: boolean
  *                     description: Does product price taxable?
  *                     example: false
  *                   taxInPercentage:
  *                     type: number
  *                     description: The product price tax in percentage.
  *                     example: 7
  *                   taxIncluded:
  *                     type: boolean
  *                     description: Does product price included tax?
  *                     example: false
  *               posters:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: string
  *                       description: The product's string.
  *                       example: "PHOTO"
  *                     orientation:
  *                       type: string
  *                       description: The product's orientation.
  *                       example: "LANDSCAPE"
  *                     format:
  *                       type: string
  *                       description: The product's format.
  *                       example: "3R"
  *                     uri:
  *                       type: string
  *                       description: The product's uri.
  *                       example: "https://via.placeholder.com/450x315.png"
  *               _key:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product's key.
  *                 example: "123456"
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
  *                       description: product's id.
  *                       example: "Product/123456"
  *                     _key:
  *                       type: string
  *                       description: product's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: product's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: product's old revision.
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

      const result = await this.editProductAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'SKU is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Options is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Delivery is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price value is less than zero!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price currency is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters type is empty!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters orientation is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters format is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters uri is empty!'));
      if (result == -104) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product key is empty!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /product/delete:
  *   delete:
  *     summary: Delete product.
  *     description: Delete product.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the product.
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

      const result = await this.deleteProductAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Not exist product!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}