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
import { GetShopAction } from '../../actions/shop/get';
import { CreateShopAction } from '../../actions/shop/create';
import { EditShopAction } from '../../actions/shop/edit';
import { DeleteShopAction } from '../../actions/shop/delete';
import { AddProductToShopAction } from '../../actions/shop/add.product';
import { RemoveProductFromShopAction } from '../../actions/shop/remove.product';
import { GetProductFromShopAction } from '../../actions/shop/get.product';
import { AddToPitStopAction } from '../../actions/shop/add.to.pit.stop';
import { RemoveFromPitStopAction } from '../../actions/shop/remove.from.pit.stop';
import { GetPitStopFromShopAction } from '../../actions/shop/get.pit.stop';

@controller('/shop')
export class ShopController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetShopAction) private getShopAction: GetShopAction,
    @inject(IOC_TYPE.CreateShopAction) private createShopAction: CreateShopAction,
    @inject(IOC_TYPE.EditShopAction) private editShopAction: EditShopAction,
    @inject(IOC_TYPE.DeleteShopAction) private deleteShopAction: DeleteShopAction,
    @inject(IOC_TYPE.AddProductToShopAction) private addProductAction: AddProductToShopAction,
    @inject(IOC_TYPE.RemoveProductFromShopAction) private removeProductAction: RemoveProductFromShopAction,
    @inject(IOC_TYPE.GetProductFromShopAction) private getProductFromShopAction: GetProductFromShopAction,
    @inject(IOC_TYPE.AddToPitStopAction) private addToPitStopAction: AddToPitStopAction,
    @inject(IOC_TYPE.RemoveFromPitStopAction) private removeFromPitStopAction: RemoveFromPitStopAction,
    @inject(IOC_TYPE.GetPitStopFromShopAction) private getPitStopFromShopAction: GetPitStopFromShopAction,
  ) { }

   /**
* @swagger
  * /shop/get:
  *   get:
  *     summary: Retrieve shop information.
  *     description: Retrieve shop information.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of shop data.
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
  *                       sequence:
  *                         type: string
  *                         description: The shop's sequence.
  *                         example: 1
  *                       name:
  *                         type: string
  *                         description: The shop's name.
  *                         example: "Product A-1"
  *                       type:
  *                         type: string
  *                         description: The shop's type(G-MALL/TRAILS-SHOPS).
  *                         example: "TRAILS-SHOPS"
  *                       isLocked:
  *                         type: boolean
  *                         description: The shop's isLocked.
  *                         example: true
  *                       posters:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             type:
  *                               type: string
  *                               description: The shop poster's string.
  *                               example: "PHOTO"
  *                             tag:
  *                               type: string
  *                               description: The shop poster's tag.
  *                               example: "@1X"
  *                             orientation:
  *                               type: string
  *                               description: The shop poster's orientation.
  *                               example: "LANDSCAPE"
  *                             format:
  *                               type: string
  *                               description: The shop poster's format.
  *                               example: "3R"
  *                             uri:
  *                               type: string
  *                               description: The shop poster's uri.
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

      const result = await this.getShopAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /shop/create:
  *   post:
  *     summary: Create shop.
  *     description: Create shop.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               name:
  *                 type: string
  *                 description: The shop's name.
  *                 example: "Shop  A-1"
  *               type:
  *                 type: string
  *                 description: The shop's type(G-MALL/TRAILS-SHOPS).
  *                 example: "TRAILS-SHOPS"
  *               isLocked:
  *                 type: boolean
  *                 description: The shop's isLocked.
  *                 example: true
  *               posters:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: string
  *                       description: The shop poster's string.
  *                       example: "PHOTO"
  *                     tag:
  *                       type: string
  *                       description: The shop poster's tag.
  *                       example: "@1X"
  *                     orientation:
  *                       type: string
  *                       description: The shop poster's orientation.
  *                       example: "LANDSCAPE"
  *                     format:
  *                       type: string
  *                       description: The shop poster's format.
  *                       example: "3R"
  *                     uri:
  *                       type: string
  *                       description: The shop poster's uri.
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
  *                       description: The shop's key.
  *                       example: "123456"
  *                     name:
  *                       type: string
  *                       description: The shop's name.
  *                       example: "Product A-1"
  *                     type:
  *                       type: string
  *                       description: The shop's type(G-MALL/TRAILS-SHOPS).
  *                       example: "TRAILS-SHOPS"
  *                     isLocked:
  *                       type: boolean
  *                       description: The shop's isLocked.
  *                       example: true
  *                     posters:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           type:
  *                             type: string
  *                             description: The shop poster's string.
  *                             example: "PHOTO"
  *                           tag:
  *                             type: string
  *                             description: The shop poster's tag.
  *                             example: "@1X"
  *                           orientation:
  *                             type: string
  *                             description: The shop poster's orientation.
  *                             example: "LANDSCAPE"
  *                           format:
  *                             type: string
  *                             description: The shop poster's format.
  *                             example: "3R"
  *                           uri:
  *                             type: string
  *                             description: The shop poster's uri.
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
      
      const result = await this.createShopAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Is locked is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters type is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters tag is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters orientation is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters format is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters uri is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop name existed!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /shop/edit:
  *   post:
  *     summary: Edit shop.
  *     description: Edit shop.
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
  *                 description: The shop's key.
  *                 example: "123456"
  *               name:
  *                 type: string
  *                 description: The shop's name.
  *                 example: "Shop  A-1"
  *               type:
  *                 type: string
  *                 description: The shop's type(G-MALL/TRAILS-SHOPS).
  *                 example: "TRAILS-SHOPS"
  *               isLocked:
  *                 type: boolean
  *                 description: The shop's isLocked.
  *                 example: true
  *               posters:
  *                 type: array
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: string
  *                       description: The shop poster's string.
  *                       example: "PHOTO"
  *                     tag:
  *                       type: string
  *                       description: The shop poster's tag.
  *                       example: "@1X"
  *                     orientation:
  *                       type: string
  *                       description: The shop poster's orientation.
  *                       example: "LANDSCAPE"
  *                     format:
  *                       type: string
  *                       description: The shop poster's format.
  *                       example: "3R"
  *                     uri:
  *                       type: string
  *                       description: The shop poster's uri.
  *                       example: "https://via.placeholder.com/450x315.png"
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
  *                       description: shop's id.
  *                       example: "Shop/123456"
  *                     _key:
  *                       type: string
  *                       description: shop's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: shop's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: shop's old revision.
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

      const result = await this.editShopAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Is locked is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters type is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters tag is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters orientation is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters format is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Posters uri is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Shop is not exist!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cannot change shop name!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /shop/delete:
  *   delete:
  *     summary: Delete shop.
  *     description: Delete shop.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the shop.
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

      const result = await this.deleteShopAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Shop is not exist!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Please remove product first!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
  
  /**
* @swagger
  * /shop/getshopproduct:
  *   get:
  *     summary: Retrieve a list of shop products.
  *     description: Retrieve a list of shop products.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the shop.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: A list of shop products.
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
  *                         example: 1
  *                       name:
  *                         type: string
  *                         description: The product's name.
  *                         example: "Product A-1"
  *                       description:
  *                         type: string
  *                         description: The product's description.
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
 @httpGet('/getshopproduct')
 private async getShopProduct(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.getProductFromShopAction.execute(key);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'No ShopProduct data!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

  /**
* @swagger
  * /shop/addproduct:
  *   post:
  *     summary: Add product to shop.
  *     description: Add product to shop.
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
  *               shopkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The shop key.
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
  *                       description: shop product's id.
  *                       example: "ShopProduct/123456"
  *                     _key:
  *                       type: string
  *                       description: shop product's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: shop product's revision.
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
 @httpPost('/addproduct')
 private async addProduct(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.addProductAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));
     
     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
 * /shop/removeproduct:
 *   delete:
 *     summary: Remove product from shop.
 *     description: Remove product from shop.
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
  *               shopkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The shop key.
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
 @httpDelete('/removeproduct')
 private async removeProduct(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.removeProductAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));

     if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This ShopProduct is not exist!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

  /**
* @swagger
  * /shop/getshoppitstop:
  *   get:
  *     summary: Retrieve a shop pit stop.
  *     description: Retrieve a shop pit stop.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the shop.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: A shop pit stop.
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
  *                       description: The animation's key.
  *                       example: "123456"
  *                     type:
  *                       type: string
  *                       description: The animation's type.
  *                       example: "SINGLE"
  *                     orientation:
  *                       type: string
  *                       description: The animation's orientation.
  *                       example: "LANDSCAPE"
  *                     nextPitStop:
  *                       type: object
  *                       properties:
  *                         name:
  *                           type: string
  *                           description: The animation's next pit stop name.
  *                           example: "01"
  *                         animations:
  *                           type: array
  *                           items:
  *                             type: object
  *                             properties:
  *                               tag:
  *                                 type: string
  *                                 description: The animation animations's tag.
  *                                 example: "BASE"
  *                               uri:
  *                                 type: string
  *                                 description: The animation animations's uri.
  *                                 example: "https://fs.zulundatumsolutions.net:3001/animations/JSON_SGW_Bugis_Trail_Map.json"
  *                     buttons:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The animation buttons's sequence.
  *                             example: 1
  *                           tag:
  *                             type: string
  *                             description: The animation buttons's tag.
  *                             example: "01"
  *                           uri:
  *                             type: string
  *                             description: The animation buttons's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                           isNext:
  *                             type: boolean
  *                             description: The animation buttons's isNext.
  *                             example: false
  *                           styles:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: string
  *                                   description: The animation buttons's type.
  *                                   example: "800x650"
  *                                 parameters:
  *                                   type: object
  *                                   properties:
  *                                     top:
  *                                       type: string
  *                                       description: The animation buttons's top.
  *                                       example: "50%"
  *                                     left:
  *                                       type: string
  *                                       description: The animation buttons's left.
  *                                       example: "50%"
  *                                     width:
  *                                       type: number
  *                                       description: The animation buttons's width.
  *                                       example: 10
  *                                     height:
  *                                       type: number
  *                                       description: The animation buttons's height.
  *                                       example: 10
  *                                     zIndex:
  *                                       type: number
  *                                       description: The animation buttons's zIndex.
  *                                       example: 1000
  *                           location:
  *                             type: object
  *                             properties:
  *                               x:
  *                                 type: number
  *                                 description: The animation buttons's x axis.
  *                                 example: 1.0215428
  *                               y:
  *                                 type: number
  *                                 description: The animation buttons's y axis.
  *                                 example: 5.5482162
  *                     icons:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The animation icons's sequence.
  *                             example: 1
  *                           tag:
  *                             type: string
  *                             description: The animation icons's tag.
  *                             example: "01"
  *                           uri:
  *                             type: string
  *                             description: The animation icons's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                           styles:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: string
  *                                   description: The animation icons's type.
  *                                   example: "800x650"
  *                                 parameters:
  *                                   type: object
  *                                   properties:
  *                                     top:
  *                                       type: string
  *                                       description: The animation icons's top.
  *                                       example: "50%"
  *                                     left:
  *                                       type: string
  *                                       description: The animation icons's left.
  *                                       example: "50%"
  *                                     width:
  *                                       type: number
  *                                       description: The animation icons's width.
  *                                       example: 10
  *                                     height:
  *                                       type: number
  *                                       description: The animation icons's height.
  *                                       example: 10
  *                                     zIndex:
  *                                       type: number
  *                                       description: The animation icons's zIndex.
  *                                       example: 1000
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
 @httpGet('/getshoppitstop')
 private async getShopPitStop(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.getPitStopFromShopAction.execute(key);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'No GenericEdge data!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
  * /shop/addtopitstop:
  *   post:
  *     summary: Add shop to pit stop in animation.
  *     description: Add shop to pit stop in animation.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               fromkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The shop key.
  *                 example: "123456"
  *               tokey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The animation key.
  *                 example: "654321"
  *               sequence:
  *                 type: number
  *                 allowEmptyValue: false
  *                 description: The pit stop sequence.
  *                 example: 1
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
  *                       description: GenericEdge's id.
  *                       example: "GenericEdge/123456"
  *                     _key:
  *                       type: string
  *                       description: GenericEdge's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: GenericEdge's revision.
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
 @httpPost('/addtopitstop')
 private async addToPitStop(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.addToPitStopAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Pit Stop Key is empty!'));
     if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Pit Stop Sequence less than zero!'));
     
     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
 * /shop/removefrompitstop:
 *   delete:
 *     summary: Remove shop from pit stop in animation.
 *     description: Remove shop from pit stop in animation.
 *     security:
 *       - apikey: []
 *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               fromkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The shop key.
  *                 example: "123456"
  *               tokey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The animation key.
  *                 example: "654321"
  *               sequence:
  *                 type: number
  *                 allowEmptyValue: false
  *                 description: The pit stop sequence.
  *                 example: 1
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
 @httpDelete('/removefrompitstop')
 private async removeFromPitStop(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.removeFromPitStopAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'PitStop Key is empty!'));
     if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Pit Stop Sequence less than zero!'));

     if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This GenericEdge is not exist!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }
}