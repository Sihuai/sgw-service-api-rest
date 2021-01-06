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
import { CreateShopCategoryAction } from '../../actions/shop.category/create';
import { EditShopCategoryAction } from '../../actions/shop.category/edit';
import { DeleteShopCategoryAction } from '../../actions/shop.category/delete';

@controller('/shopcategory')
export class ShopCategoryController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetShopCategoryAction) private getShopCategoryAction: GetShopCategoryAction,
    @inject(IOC_TYPE.CreateShopCategoryAction) private createShopCategoryAction: CreateShopCategoryAction,
    @inject(IOC_TYPE.EditShopCategoryAction) private editShopCategoryAction: EditShopCategoryAction,
    @inject(IOC_TYPE.DeleteShopCategoryAction) private deleteShopCategoryAction: DeleteShopCategoryAction,
  ) { }

  /**
* @swagger
  * /shopcategory/get:
  *   get:
  *     summary: Retrieve a list of shop category.
  *     description: Retrieve a list of shop category.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of shop category.
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
  *                         description: The shop category's key.
  *                         example: "123456"
  *                       sequence:
  *                         type: number
  *                         description: The shop category's sequence.
  *                         example: 1
  *                       name:
  *                         type: string
  *                         description: The shop category's name.
  *                         example: "ShopCategory A-1"
  *                       description:
  *                         type: string
  *                         description: The shop category's description.
  *                         example: "Lorem ipsum dolor sit amet, consectetur..."
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

      const result = await this.getShopCategoryAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /shopcategory/create:
  *   post:
  *     summary: Create shop category.
  *     description: Create shop category.
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
  *               categories:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       description: The shop category's sequence.
  *                       example: 1
  *                     name:
  *                       type: string
  *                       description: The shop category's name.
  *                       example: "Level 1 / Brand A"
  *                     color:
  *                       type: string
  *                       description: The shop category's color.
  *                       example: "#5DB4E4"
  *               trails:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       description: The shop category's sequence.
  *                       example: 1
  *                     name:
  *                       type: string
  *                       description: The shop category's name.
  *                       example: "Bugis Trail"
  *                     color:
  *                       type: string
  *                       description: The shop category's color.
  *                       example: "#5DB4E4"
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
  *                       description: The shop category's key.
  *                       example: "123456"
  *                     type:
  *                       type: string
  *                       description: The shop category's type(G-MALL/TRAILS-SHOPS).
  *                       example: "TRAILS-SHOPS"
  *                     categories:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The shop category's sequence.
  *                             example: 1
  *                           name:
  *                             type: string
  *                             description: The shop category's name.
  *                             example: "Level 1 / Brand A"
  *                           color:
  *                             type: string
  *                             description: The shop category's color.
  *                             example: "#5DB4E4"
  *                     trails:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The shop category's sequence.
  *                             example: 1
  *                           name:
  *                             type: string
  *                             description: The shop category's name.
  *                             example: "Bugis Trail"
  *                           color:
  *                             type: string
  *                             description: The shop category's color.
  *                             example: "#5DB4E4"
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
      
      const result = await this.createShopCategoryAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Category Sequence less than zero!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Category Name is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Category Color is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Sequence less than zero!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Name is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Color is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type isnot in G-MALL/TRAILS-SHOPS!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /shopcategory/edit:
  *   post:
  *     summary: Edit user's shop category.
  *     description: Edit user's shop category.
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
  *               categories:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       description: The shop category's sequence.
  *                       example: 1
  *                     name:
  *                       type: string
  *                       description: The shop category's name.
  *                       example: "Level 1 / Brand A"
  *                     color:
  *                       type: string
  *                       description: The shop category's color.
  *                       example: "#5DB4E4"
  *               trails:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       description: The shop category's sequence.
  *                       example: 1
  *                     name:
  *                       type: string
  *                       description: The shop category's name.
  *                       example: "Bugis Trail"
  *                     color:
  *                       type: string
  *                       description: The shop category's color.
  *                       example: "#5DB4E4"
  *               _key:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The shop category's key.
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
  *                       description: shop category's id.
  *                       example: "ShopCategory/123456"
  *                     _key:
  *                       type: string
  *                       description: shop category's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: shop category's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: shop category's old revision.
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

      const result = await this.editShopCategoryAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Category Sequence less than zero!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Category Name is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Category Color is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Sequence less than zero!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Name is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Color is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type isnot in G-MALL/TRAILS-SHOPS!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Shop Category is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /shopcategory/delete:
  *   delete:
  *     summary: Delete shop category.
  *     description: Delete shop category.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the shop category.
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

      const result = await this.deleteShopCategoryAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Not exist shop category!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Please remove shop first!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

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
 @httpGet('/getshop')
 private async getShop(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
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

//  /**
// * @swagger
//   * /shopcategory/addshop:
//   *   post:
//   *     summary: Add shop to shop category.
//   *     description: Add shop to shop category.
//   *     security:
//   *       - apikey: []
//   *     requestBody:
//   *       required: true
//   *       content:
//   *         application/json:
//   *           schema:
//   *             type: object
//   *             properties:
//   *               shopkey:
//   *                 type: string
//   *                 allowEmptyValue: false
//   *                 description: The shop key.
//   *                 example: "123456"
//   *               shopcategorykey:
//   *                 type: string
//   *                 allowEmptyValue: false
//   *                 description: The shop category key.
//   *                 example: "654321"
//   *     responses:
//   *       200:
//   *         description: Create Success.
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
//   *                   type: object
//   *                   properties:
//   *                     _id:
//   *                       type: string
//   *                       description: ShopShopCategory's id.
//   *                       example: "ShopShopCategory/123456"
//   *                     _key:
//   *                       type: string
//   *                       description: ShopShopCategory's key.
//   *                       example: "123456"
//   *                     _rev:
//   *                       type: string
//   *                       description: ShopShopCategory's revision.
//   *                       example: _blDWGNW---
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
//   *       603:
//   *         description: Validation Error.
//   *         content:
//   *           application/json:
//   *             schema:
//   *               type: object
//   *               properties:
//   *                 code:
//   *                   type: integer
//   *                   description: Response code.
//   *                   example: 603
//   *                 msg:
//   *                   type: string
//   *                   description: Response message.
//   *                   example: "Email is empty!"
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
//  @httpPost('/addshop')
//  private async addShop(
//    @requestHeaders('authorization') authHeader: string,
//    @request() request: Request, @response() response: Response, @next() next: Function,
//  ) {
//    try {
//      const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
//      const result = await this.addShopAction.execute(token, request.body);
//      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));
//      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Category Key is empty!'));
     
//      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
//    } catch (e) {
//      const code = getResponseDataCode(e.name);
//      response.status(code).json(ResponseFailure(code, e.stack));
//      next(e);
//    }
//  }

//  /**
// * @swagger
//  * /shopcategory/removeshop:
//  *   delete:
//  *     summary: Remove shop from shop category.
//  *     description: Remove shop from shop category.
//  *     security:
//  *       - apikey: []
//  *     requestBody:
//   *       required: true
//   *       content:
//   *         application/json:
//   *           schema:
//   *             type: object
//   *             properties:
//   *               shopkey:
//   *                 type: string
//   *                 allowEmptyValue: false
//   *                 description: The shop key.
//   *                 example: "123456"
//   *               shopcategorykey:
//   *                 type: string
//   *                 allowEmptyValue: false
//   *                 description: The shop category key.
//   *                 example: "654321"
//  *     responses:
//  *       200:
//  *         description: Delete Success.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: integer
//  *                   description: Response code.
//  *                   example: 200
//  *                 msg:
//  *                   type: string
//  *                   description: Response message.
//  *                   example: ""
//  *                 data:
//  *                   type: string
//  *                   description: Response data.
//  *                   example: ""
//  *       601:
//  *         description: Invalid Token.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: integer
//  *                   description: Response code.
//  *                   example: 601
//  *                 msg:
//  *                   type: string
//  *                   description: Response message.
//  *                   example: "Invalid Token!"
//  *                 data:
//  *                   type: string
//  *                   description: Response data.
//  *                   example: ""
//  *       602:
//  *         description: Unexpected.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: integer
//  *                   description: Response code.
//  *                   example: 602
//  *                 msg:
//  *                   type: string
//  *                   description: Response message.
//  *                   example: "Unexpected!"
//  *                 data:
//  *                   type: string
//  *                   description: Response data.
//  *                   example: ""
//  *       603:
//  *         description: Validation Error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: integer
//  *                   description: Response code.
//  *                   example: 603
//  *                 msg:
//  *                   type: string
//  *                   description: Response message.
//  *                   example: "Email is empty!"
//  *                 data:
//  *                   type: string
//  *                   description: Response data.
//  *                   example: ""
//  *       604:
//  *         description: Not Authorized.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: integer
//  *                   description: Response code.
//  *                   example: 604
//  *                 msg:
//  *                   type: string
//  *                   description: Response message.
//  *                   example: "Not Authorized"
//  *                 data:
//  *                   type: string
//  *                   description: Response data.
//  *                   example: ""
//  *       606:
//  *         description: Token Time Out.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 code:
//  *                   type: integer
//  *                   description: Response code.
//  *                   example: 606
//  *                 msg:
//  *                   type: string
//  *                   description: Response message.
//  *                   example: "Token Time Out!"
//  *                 data:
//  *                   type: string
//  *                   description: Response data.
//  *                   example: ""
//  */
//  @httpDelete('/removeshop')
//  private async removeShop(
//    @requestHeaders('authorization') authHeader: string,
//    @request() request: Request, @response() response: Response, @next() next: Function,
//  ) {
//    try {
//      const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
//      const result = await this.removeShopAction.execute(token, request.body);
//      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));
//      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Category Key is empty!'));

//      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This ShopShopCategory is not exist!'));

//      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
//    } catch (e) {
//      const code = getResponseDataCode(e.name);
//      response.status(code).json(ResponseFailure(code, e.stack));
//      next(e);
//    }
//  }
}