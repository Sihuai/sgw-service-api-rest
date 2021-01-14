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
import { GetCouponAction } from '../../actions/coupon/get';
import { CreateCouponAction } from '../../actions/coupon/create';
import { EditCouponAction } from '../../actions/coupon/edit';
import { DeleteCouponAction } from '../../actions/coupon/delete';
import { GetProductFromCouponAction } from '../../actions/coupon/get.product';
import { AddToProductAction } from '../../actions/coupon/add.to.product';
import { RemoveFromProductAction } from '../../actions/coupon/remove.from.product';
import { GetShopFromCouponAction } from '../../actions/coupon/get.shop';
import { AddToShopAction } from '../../actions/coupon/add.to.shop';
import { RemoveFromShopAction } from '../../actions/coupon/remove.from.shop';

@controller('/coupon')
export class CouponController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetCouponAction) private getCouponAction: GetCouponAction,
    @inject(IOC_TYPE.CreateCouponAction) private createCouponAction: CreateCouponAction,
    @inject(IOC_TYPE.EditCouponAction) private editCouponAction: EditCouponAction,
    @inject(IOC_TYPE.DeleteCouponAction) private deleteCouponAction: DeleteCouponAction,
    @inject(IOC_TYPE.GetProductFromCouponAction) private getProductFromCouponAction: GetProductFromCouponAction,
    @inject(IOC_TYPE.AddToProductAction) private addToProductAction: AddToProductAction,
    @inject(IOC_TYPE.RemoveFromProductAction) private removeFromProductAction: RemoveFromProductAction,
    @inject(IOC_TYPE.GetShopFromCouponAction) private getShopFromCouponAction: GetShopFromCouponAction,
    @inject(IOC_TYPE.AddToShopAction) private addToShopAction: AddToShopAction,
    @inject(IOC_TYPE.RemoveFromShopAction) private removeFromShopAction: RemoveFromShopAction,
  ) { }

  /**
* @swagger
  * /coupon/get:
  *   get:
  *     summary: Retrieve a list of coupon.
  *     description: Retrieve a list of coupon.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of coupon.
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
  *                         description: The coupon's key.
  *                         example: "123456"
  *                       type:
  *                         type: string
  *                         description: The coupon's type[include SAMPLER, PURCHASE, DISCOUNT].
  *                         example: "DISCOUNT"
  *                       name:
  *                         type: string
  *                         description: The coupon's name.
  *                         example: "Coupon A-1"
  *                       description:
  *                         type: string
  *                         description: The coupon's description.
  *                         example: "Lorem ipsum dolor sit amet, consectetur..."
  *                       hasMaxLimit:
  *                         type: boolean
  *                         description: The coupon has max limit.
  *                         example: false
  *                       maxLimit:
  *                         type: number
  *                         description: The coupon's max limit.
  *                         example: 0
  *                       expire:
  *                         type: string
  *                         description: The coupon's expire.
  *                         example: "2021-05-01"
  *                       option:
  *                         type: object
  *                         properties:
  *                           discount:
  *                             type: object
  *                             properties:
  *                               type:
  *                                 type: DiscountTypes
  *                                 description: The coupon option discount's type[PERCENTAGE, FIXED-AMOUNT, QTY].
  *                                 example: "PERCENTAGE"
  *                               value:
  *                                 type: string
  *                                 description: The coupon option discount's value.
  *                                 example: 60
  *                               uom:
  *                                 type: DiscountUOMTypes
  *                                 description: The coupon option discount's uom[%, SGD, PCS, PACK, g, kg]?
  *                                 example: "%"
  *                               deductFromOrderAmount:
  *                                 type: boolean
  *                                 description: The coupon option discount's deductFromOrderAmount.
  *                                 example: true
  *                               incrementOrderQty:
  *                                 type: boolean
  *                                 description: The coupon option discount's incrementOrderQty.
  *                                 example: false
  *                               targets:
  *                                 type: array
  *                                 items:
  *                                   type: object
  *                                   properties:
  *                                     type:
  *                                       type: DiscountTargetTypes
  *                                       description: The coupon option discount targets's type[PRODUCT, SHOP].
  *                                       example: PRODUCT
  *                           sampler:
  *                             type: string
  *                             description: The coupon option's sampler.
  *                             example: "Taste"
  *                           purchase:
  *                             type: number
  *                             description: The coupon option's purchase price.
  *                             example: 10
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

      const result = await this.getCouponAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /coupon/create:
  *   post:
  *     summary: Create coupon.
  *     description: Create coupon.
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
  *                 description: The coupon's type[include SAMPLER, PURCHASE, DISCOUNT].
  *                 example: "DISCOUNT"
  *               name:
  *                 type: string
  *                 description: The coupon's name.
  *                 example: "Coupon A-1"
  *               description:
  *                 type: string
  *                 description: The coupon's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               hasMaxLimit:
  *                 type: boolean
  *                 description: The coupon has max limit.
  *                 example: false
  *               maxLimit:
  *                 type: number
  *                 description: The coupon's max limit.
  *                 example: 0
  *               expire:
  *                 type: string
  *                 description: The coupon's expire.
  *                 example: "2021-05-01"
  *               option:
  *                 type: object
  *                 properties:
  *                   discount:
  *                     type: object
  *                     properties:
  *                       type:
  *                         type: DiscountTypes
  *                         description: The coupon option discount's type[PERCENTAGE, FIXED-AMOUNT, QTY].
  *                         example: "PERCENTAGE"
  *                       value:
  *                         type: string
  *                         description: The coupon option discount's value.
  *                         example: 60
  *                       uom:
  *                         type: DiscountUOMTypes
  *                         description: The coupon option discount's uom[%, SGD, PCS, PACK, g, kg]?
  *                         example: "%"
  *                       deductFromOrderAmount:
  *                         type: boolean
  *                         description: The coupon option discount's deductFromOrderAmount.
  *                         example: true
  *                       incrementOrderQty:
  *                         type: boolean
  *                         description: The coupon option discount's incrementOrderQty.
  *                         example: false
  *                       targets:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             type:
  *                               type: DiscountTargetTypes
  *                               description: The coupon option discount targets's type[PRODUCT, SHOP].
  *                               example: PRODUCT
  *                   sampler:
  *                     type: string
  *                     description: The coupon option's sampler.
  *                     example: "Taste"
  *                   purchase:
  *                     type: number
  *                     description: The coupon option's purchase price.
  *                     example: 10
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
  *                       description: The coupon's key.
  *                       example: "123456"
  *                     type:
  *                       type: string
  *                       description: The coupon's type[include SAMPLER, PURCHASE, DISCOUNT].
  *                       example: "DISCOUNT"
  *                     name:
  *                       type: string
  *                       description: The coupon's name.
  *                       example: "Coupon A-1"
  *                     description:
  *                       type: string
  *                       description: The coupon's description.
  *                       example: "Lorem ipsum dolor sit amet, consectetur..."
  *                     hasMaxLimit:
  *                       type: boolean
  *                       description: The coupon has max limit.
  *                       example: false
  *                     maxLimit:
  *                       type: number
  *                       description: The coupon's max limit.
  *                       example: 0
  *                     expire:
  *                       type: string
  *                       description: The coupon's expire.
  *                       example: "2021-05-01"
  *                     option:
  *                       type: object
  *                       properties:
  *                         discount:
  *                           type: object
  *                           properties:
  *                             type:
  *                               type: DiscountTypes
  *                               description: The coupon option discount's type[PERCENTAGE, FIXED-AMOUNT, QTY].
  *                               example: "PERCENTAGE"
  *                             value:
  *                               type: string
  *                               description: The coupon option discount's value.
  *                               example: 60
  *                             uom:
  *                               type: DiscountUOMTypes
  *                               description: The coupon option discount's uom[%, SGD, PCS, PACK, g, kg]?
  *                               example: "%"
  *                             deductFromOrderAmount:
  *                               type: boolean
  *                               description: The coupon option discount's deductFromOrderAmount.
  *                               example: true
  *                             incrementOrderQty:
  *                               type: boolean
  *                               description: The coupon option discount's incrementOrderQty.
  *                               example: false
  *                             targets:
  *                               type: array
  *                               items:
  *                                 type: object
  *                                 properties:
  *                                   type:
  *                                     type: DiscountTargetTypes
  *                                     description: The coupon option discount targets's type[PRODUCT, SHOP].
  *                                     example: PRODUCT
  *                         sampler:
  *                           type: string
  *                           description: The coupon option's sampler.
  *                           example: "Taste"
  *                         purchase:
  *                           type: number
  *                           description: The coupon option's purchase price.
  *                           example: 10
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
      
      const result = await this.createCouponAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Max Limit less than zero!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Expire is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Option is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Exist same Name!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /coupon/edit:
  *   post:
  *     summary: Edit user's coupon.
  *     description: Edit user's coupon.
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
  *                 description: The coupon's type[include SAMPLER, PURCHASE, DISCOUNT].
  *                 example: "DISCOUNT"
  *               name:
  *                 type: string
  *                 description: The coupon's name.
  *                 example: "Coupon A-1"
  *               description:
  *                 type: string
  *                 description: The coupon's description.
  *                 example: "Lorem ipsum dolor sit amet, consectetur..."
  *               hasMaxLimit:
  *                 type: boolean
  *                 description: The coupon has max limit.
  *                 example: false
  *               maxLimit:
  *                 type: number
  *                 description: The coupon's max limit.
  *                 example: 0
  *               expire:
  *                 type: string
  *                 description: The coupon's expire.
  *                 example: "2021-05-01"
  *               option:
  *                 type: object
  *                 properties:
  *                   discount:
  *                     type: object
  *                     properties:
  *                       type:
  *                         type: DiscountTypes
  *                         description: The coupon option discount's type[PERCENTAGE, FIXED-AMOUNT, QTY].
  *                         example: "PERCENTAGE"
  *                       value:
  *                         type: string
  *                         description: The coupon option discount's value.
  *                         example: 60
  *                       uom:
  *                         type: DiscountUOMTypes
  *                         description: The coupon option discount's uom[%, SGD, PCS, PACK, g, kg]?
  *                         example: "%"
  *                       deductFromOrderAmount:
  *                         type: boolean
  *                         description: The coupon option discount's deductFromOrderAmount.
  *                         example: true
  *                       incrementOrderQty:
  *                         type: boolean
  *                         description: The coupon option discount's incrementOrderQty.
  *                         example: false
  *                       targets:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             type:
  *                               type: DiscountTargetTypes
  *                               description: The coupon option discount targets's type[PRODUCT, SHOP].
  *                               example: PRODUCT
  *                   sampler:
  *                     type: string
  *                     description: The coupon option's sampler.
  *                     example: "Taste"
  *                   purchase:
  *                     type: number
  *                     description: The coupon option's purchase price.
  *                     example: 10
  *               _key:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The coupon's key.
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
  *                       description: coupon's id.
  *                       example: "Coupon/123456"
  *                     _key:
  *                       type: string
  *                       description: coupon's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: coupon's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: coupon's old revision.
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

      const result = await this.editCouponAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Description is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Max Limit less than zero!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Expire is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Option is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Coupon key is empty!'));

      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Coupon is not exist!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cannot change coupon Name!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /coupon/delete:
  *   delete:
  *     summary: Delete coupon.
  *     description: Delete coupon.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the coupon.
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

      const result = await this.deleteCouponAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Not exist coupon!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Please remove product & shop first!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
  
 /**
* @swagger
  * /coupon/getproduct:
  *   get:
  *     summary: Retrieve a list of products.
  *     description: Retrieve a list of products.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the coupon.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: A list of products.
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
 @httpGet('/getproduct')
 private async getProduct(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.getProductFromCouponAction.execute(key);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Coupon Key is empty!'));
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
  * /coupon/addtoproduct:
  *   post:
  *     summary: Add coupon to product.
  *     description: Add coupon to product.
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
  *                 description: The coupon key.
  *                 example: "123456"
  *               tokey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product key.
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
 @httpPost('/addtoproduct')
 private async addToProduct(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.addToProductAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Coupon Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));
     
     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
 * /coupon/removefromproduct:
 *   delete:
 *     summary: Remove coupon from product.
 *     description: Remove coupon from product.
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
  *                 description: The coupon key.
  *                 example: "123456"
  *               tokey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The product key.
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
 @httpDelete('/removefromproduct')
 private async removeFromProduct(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.removeFromProductAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Coupon Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Product Key is empty!'));

     if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This GenericEdge is not exist!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
  * /coupon/getshop:
  *   get:
  *     summary: Retrieve a list of shops.
  *     description: Retrieve a list of shops.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the coupon.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: A list of shops.
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
  *                         type: number
  *                         description: The shop's sequence.
  *                         example: 1
  *                       name:
  *                         type: string
  *                         description: The shop's name.
  *                         example: "Shop A-1"
  *                       description:
  *                         type: string
  *                         description: The shop's description.
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
 @httpGet('/getshop')
 private async getShop(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.getShopFromCouponAction.execute(key);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Coupon Key is empty!'));
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
  * /coupon/addtoshop:
  *   post:
  *     summary: Add coupon to shop.
  *     description: Add coupon to shop.
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
  *                 description: The coupon key.
  *                 example: "123456"
  *               tokey:
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
 @httpPost('/addtoshop')
 private async addToShop(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.addToShopAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Coupon Key is empty!'));
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
 * /coupon/removefromshop:
 *   delete:
 *     summary: Remove coupon from shop.
 *     description: Remove coupon from shop.
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
  *                 description: The coupon key.
  *                 example: "123456"
  *               tokey:
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
 @httpDelete('/removefromshop')
 private async removeFromShop(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.removeFromShopAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Coupon Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Shop Key is empty!'));

     if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This GenericEdge is not exist!'));

     response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }
}