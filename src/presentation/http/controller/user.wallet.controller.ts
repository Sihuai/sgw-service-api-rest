import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
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
import { GetUserWalletAction } from '../../actions/user.wallet/get';
import { DeleteUserWalletAction } from '../../actions/user.wallet/delete';

@controller('/user/wallet')
export class UserWalletController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetUserWalletAction) private getUserWalletAction: GetUserWalletAction,
    @inject(IOC_TYPE.DeleteUserWalletAction) private deleteUserWalletAction: DeleteUserWalletAction,
  ) { }

  /**
* @swagger
  * /userWallet/get:
  *   get:
  *     summary: Retrieve a list of user's wallet items.
  *     description: Retrieve a list of user's wallet items.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of user's wallet items.
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
  *                       tag:
  *                         type: string
  *                         description: The shop key.
  *                         example: "123456"
  *                       coupons:
  *                         type: array
  *                         items:
  *                           type:
  *                             type: string
  *                             description: The coupon's type[include SAMPLER, PURCHASE, DISCOUNT].
  *                             example: "DISCOUNT"
  *                           name:
  *                             type: string
  *                             description: The coupon's name.
  *                             example: "Coupon A-1"
  *                           description:
  *                             type: string
  *                             description: The coupon's description.
  *                             example: "Lorem ipsum dolor sit amet, consectetur..."
  *                           hasMaxLimit:
  *                             type: boolean
  *                             description: The coupon has max limit.
  *                             example: false
  *                           maxLimit:
  *                             type: number
  *                             description: The coupon's max limit.
  *                             example: 0
  *                           expire:
  *                             type: string
  *                             description: The coupon's expire.
  *                             example: "2021-05-01"
  *                           option:
  *                             type: object
  *                             properties:
  *                               discount:
  *                                 type: object
  *                                 properties:
  *                                   type:
  *                                     type: DiscountTypes
  *                                     description: The coupon option discount's type[PERCENTAGE, FIXED-AMOUNT, QTY].
  *                                     example: "PERCENTAGE"
  *                                   value:
  *                                     type: string
  *                                     description: The coupon option discount's value.
  *                                     example: 60
  *                                   uom:
  *                                     type: DiscountUOMTypes
  *                                     description: The coupon option discount's uom[%, SGD, PCS, PACK, g, kg]?
  *                                     example: "%"
  *                                   deductFromOrderAmount:
  *                                     type: boolean
  *                                     description: The coupon option discount's deductFromOrderAmount.
  *                                     example: true
  *                                   incrementOrderQty:
  *                                     type: boolean
  *                                     description: The coupon option discount's incrementOrderQty.
  *                                     example: false
  *                                   targets:
  *                                     type: array
  *                                     items:
  *                                       type: object
  *                                       properties:
  *                                         type:
  *                                           type: DiscountTargetTypes
  *                                           description: The coupon option discount targets's type[PRODUCT, SHOP].
  *                                           example: PRODUCT
  *                               sampler:
  *                                 type: string
  *                                 description: The coupon option's sampler.
  *                                 example: "Taste"
  *                               purchase:
  *                                 type: number
  *                                 description: The coupon option's purchase price.
  *                                 example: 10
  *                       _key:
  *                         type: string
  *                         description: The userWallet's key.
  *                         example: "123456"
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

      const result = await this.getUserWalletAction.execute(token);
      if (result == -10) return response.status(ResponseDataCode.OK).json(ResponseSuccess(''));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

//   /**
// * @swagger
//   * /userWallet/delete:
//   *   delete:
//   *     summary: Delete user's wallet item.
//   *     description: Delete user's wallet item.
//   *     security:
//   *       - apikey: []
//   *     parameters:
//   *       - in: query
//   *         name: key
//   *         required: true
//   *         allowEmptyValue: false
//   *         description: Key of the wallet item.
//   *         schema:
//   *           type: string
//   *         style: simple
//   *         example: "123456"
//   *     responses:
//   *       200:
//   *         description: Delete Success.
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
//   *                   type: string
//   *                   description: Response data.
//   *                   example: ""
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
//   @httpDelete('/delete')
//   private async delete(
//     @requestHeaders('authorization') authHeader: string,
//     @queryParam('key') key: string,
//     @request() request: Request, @response() response: Response, @next() next: Function,
//   ) {
//     try {
//       const token = getUserFromToken(authHeader, request.cookies['r-token']);

//       const result = await this.deleteUserWalletAction.execute(token, key);
//       if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
//       if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Not exist userWallet!'));
//       if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove UserWallet User-UserWallet data!'));
      
//       response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
//     } catch (e) {
//       const code = getResponseDataCode(e.name);
//       response.status(code).json(ResponseFailure(code, e.stack));
//       next(e);
//     }
//   }
}