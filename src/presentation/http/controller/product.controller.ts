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
import { CreateProductAction } from '../../actions/product/create';
import { EditProductAction } from '../../actions/product/edit';
import { DeleteProductAction } from '../../actions/product/delete';
import { AddToCategoryAction } from '../../actions/product/add.to.category';
import { RemoveFromCategoryAction } from '../../actions/product/remove.from.category';
import { GetProductCategoryFromProductAction } from '../../actions/product/get.category';
import { GetProductBrandFromProductAction } from '../../actions/product/get.brand';
import { AddToBrandAction } from '../../actions/product/add.to.brand';
import { RemoveFromBrandAction } from '../../actions/product/remove.from.brand';
import { GetProductAction } from '../../actions/product/get';

@controller('/product')
export class ProductController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetProductAction) private getProductAction: GetProductAction,
    @inject(IOC_TYPE.CreateProductAction) private createProductAction: CreateProductAction,
    @inject(IOC_TYPE.EditProductAction) private editProductAction: EditProductAction,
    @inject(IOC_TYPE.DeleteProductAction) private deleteProductAction: DeleteProductAction,
    @inject(IOC_TYPE.GetProductCategoryFromProductAction) private getProductCategoryAction: GetProductCategoryFromProductAction,
    @inject(IOC_TYPE.AddToCategoryAction) private addToCategoryAction: AddToCategoryAction,
    @inject(IOC_TYPE.RemoveFromCategoryAction) private removeFromCategoryAction: RemoveFromCategoryAction,
    @inject(IOC_TYPE.GetProductBrandFromProductAction) private getProductBrandAction: GetProductBrandFromProductAction,
    @inject(IOC_TYPE.AddToBrandAction) private addToBrandAction: AddToBrandAction,
    @inject(IOC_TYPE.RemoveFromBrandAction) private removeFromBrandAction: RemoveFromBrandAction,
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
  *                       sequence:
  *                         type: string
  *                         description: The product's sequence.
  *                         example: 1
  *                       sku:
  *                         type: string
  *                         description: The product's sku.
  *                         example: "A-2020-01"
  *                       uom:
  *                         type: string
  *                         description: The product's uom(unit of measure)[include PCS, PACKET, BOTTLE, CARTON].
  *                         example: "PCS"
  *                       name:
  *                         type: string
  *                         description: The product's name.
  *                         example: "Product A-1"
  *                       description:
  *                         type: string
  *                         description: The product's description.
  *                         example: "Lorem ipsum dolor sit amet, consectetur..."
  *                       isLocked:
  *                         type: boolean
  *                         description: The product's isLocked.
  *                         example: true
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
  *               uom:
  *                 type: string
  *                 description: The product's uom(unit of measure)[include PCS, PACKET, BOTTLE, CARTON].
  *                 example: "PCS"
  *               name:
  *                 type: string
  *                 description: The product's name.
  *                 example: "Product A-1"
  *               description:
  *                 type: string
  *                 description: The product's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               isLocked:
  *                 type: boolean
  *                 description: The product's isLocked.
  *                 example: true
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
  *                       type: string
  *                       description: The product's sku.
  *                       example: "A-2020-01"
  *                     uom:
  *                       type: string
  *                       description: The product's uom(unit of measure)[include PCS, PACKET, BOTTLE, CARTON].
  *                       example: "PCS"
  *                     name:
  *                       type: string
  *                       description: The product's name.
  *                       example: "Product A-1"
  *                     description:
  *                       type: string
  *                       description: The product's description.
  *                       example: "Lorem ipsum dolor sit amet, consectetur..."
  *                     isLocked:
  *                       type: boolean
  *                       description: The product's isLocked.
  *                       example: true
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
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'UOM is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Is locked is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Options is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Delivery is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price value is less than zero!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price currency is empty!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters type is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters orientation is empty!'));
      if (result == -104) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters format is empty!'));
      if (result == -105) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters uri is empty!'));

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
  *               uom:
  *                 type: string
  *                 description: The product's uom(unit of measure)[include PCS, PACKET, BOTTLE, CARTON].
  *                 example: "PCS"
  *               name:
  *                 type: string
  *                 description: The product's name.
  *                 example: "Product A-1"
  *               description:
  *                 type: string
  *                 description: The product's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               isLocked:
  *                 type: boolean
  *                 description: The product's isLocked.
  *                 example: true
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
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'UOM is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Is locked is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Options is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Delivery is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price value is less than zero!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Price currency is empty!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters type is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters orientation is empty!'));
      if (result == -104) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters format is empty!'));
      if (result == -105) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters uri is empty!'));
      if (result == -106) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Product is not exist!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cannot change product SKU!'));
      
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
  
 /**
* @swagger
  * /product/getproductcategory:
  *   get:
  *     summary: Retrieve a product category.
  *     description: Retrieve a product category.
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
  *         description: A product category.
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
  *                     sequence:
  *                       type: number
  *                       description: The product's sequence.
  *                       example: 1
  *                     name:
  *                       type: string
  *                       description: The product's name.
  *                       example: "Product A-1"
  *                     description:
  *                       type: string
  *                       description: The product's description.
  *                       example: "Lorem ipsum dolor sit amet, consectetur..."
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
 @httpGet('/getproductcategory')
 private async getProductCategory(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.getProductCategoryAction.execute(key);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'No product category data!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(result[0]));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
  * /product/addtocategory:
  *   post:
  *     summary: Add product to category.
  *     description: Add product to category.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               productkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product key.
  *                 example: "123456"
  *               productcategorykey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product category key.
  *                 example: "654321"
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
  *                     _id:
  *                       type: string
  *                       description: ProductProductCategory's id.
  *                       example: "ProductProductCategory/123456"
  *                     _key:
  *                       type: string
  *                       description: ProductProductCategory's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: ProductProductCategory's revision.
  *                       example: _blDWGNW---
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
 @httpPost('/addtocategory')
 private async addToCategory(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.addToCategoryAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Category Key is empty!'));
     
     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
 * /product/removefromcategory:
 *   delete:
 *     summary: Remove product from category.
 *     description: Remove product from category.
 *     security:
 *       - apikey: []
 *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               productkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product key.
  *                 example: "123456"
  *               productcategorykey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product category key.
  *                 example: "654321"
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
 @httpDelete('/removefromcategory')
 private async removeFromCategory(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.removeFromCategoryAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Category Key is empty!'));

     if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This ProductProductCategory is not exist!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
  * /product/getproductbrand:
  *   get:
  *     summary: Retrieve a product brand.
  *     description: Retrieve a product brand.
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
  *         description: A product brand.
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
  *                     sequence:
  *                       type: number
  *                       description: The product's sequence.
  *                       example: 1
  *                     name:
  *                       type: string
  *                       description: The product's name.
  *                       example: "Product A-1"
  *                     description:
  *                       type: string
  *                       description: The product's description.
  *                       example: "Lorem ipsum dolor sit amet, consectetur..."
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
 @httpGet('/getproductbrand')
 private async getProductBrand(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.getProductBrandAction.execute(key);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'No product brand data!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(result[0]));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
  * /product/addtobrand:
  *   post:
  *     summary: Add product to brand.
  *     description: Add product to brand.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               productkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product key.
  *                 example: "123456"
  *               productbrandkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product brand key.
  *                 example: "654321"
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
  *                     _id:
  *                       type: string
  *                       description: ProductProductBrand's id.
  *                       example: "ProductProductBrand/123456"
  *                     _key:
  *                       type: string
  *                       description: ProductProductBrand's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: ProductProductBrand's revision.
  *                       example: _blDWGNW---
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
 @httpPost('/addtobrand')
 private async addToBrand(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.addToBrandAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Brand Key is empty!'));
     
     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
 * /product/removefrombrand:
 *   delete:
 *     summary: Remove product from brand.
 *     description: Remove product from brand.
 *     security:
 *       - apikey: []
 *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               productkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product key.
  *                 example: "123456"
  *               productbrandkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product brand key.
  *                 example: "654321"
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
 @httpDelete('/removefrombrand')
 private async removeFromBrand(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.removeFromBrandAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Brand Key is empty!'));

     if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This ProductProductBrand is not exist!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }
}