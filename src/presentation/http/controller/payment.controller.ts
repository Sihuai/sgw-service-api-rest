import { Request, Response } from 'express-serve-static-core';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  interfaces,
  next,
  request,
  requestHeaders,
  response,
} from 'inversify-express-utils';
import { IOC_TYPE } from '../../../config/type';
import { getResponseDataCode, ResponseDataCode } from '../constants/response.data.code';
import { ResponseFailure, ResponseSuccess } from '../../utils/response.data';
import { getUserFromToken } from '../../../infra/utils/security';
import { GetPaymentAction } from '../../actions/payment/get';
import { CreatePaymentAction } from '../../actions/payment/create';

@controller('/payment')
export class PaymentController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetPaymentAction) private getPaymentAction: GetPaymentAction,
    @inject(IOC_TYPE.CreatePaymentAction) private createPaymentAction: CreatePaymentAction,
  ) { }

  /**
* @swagger
  * /payment/create:
  *   post:
  *     summary: Create a pay for order.
  *     description: Create a pay for order.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               orderkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The order key.
  *                 example: "123456"
  *               paymentaccountkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The Payment AccountKey's key.
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
  *                     _key:
  *                       type: string
  *                       description: address's key.
  *                       example: "123456"
  *                     country:
  *                       type: string
  *                       description: The address's country.
  *                       example: SINGAPORE
  *                     block:
  *                       type: string
  *                       description: The address's block.
  *                       example: "40"
  *                     propertyName:
  *                       type: string
  *                       description: The address's property name.
  *                       example: The Excell
  *                     street:
  *                       type: string
  *                       description: The address's street.
  *                       example: East Coast Road
  *                     unit:
  *                       type: string
  *                       description: The address's unit.
  *                       example: "03-80"
  *                     province:
  *                       type: string
  *                       description: The address's province.
  *                       example: SINGAPORE
  *                     city:
  *                       type: string
  *                       description: The address's city.
  *                       example: SINGAPORE
  *                     postal:
  *                       type: string
  *                       description: The address's postal.
  *                       example: "090088"
  *                     isDefault:
  *                       type: boolean
  *                       description: The user's default address.
  *                       example: false
  *                     recipient:
  *                       type: string
  *                       description: The address's recipient.
  *                       example: "Mark Louise"
  *                     mobile:
  *                       type: string
  *                       description: The address's mobile.
  *                       example: "+082 2568425"
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
      
      const result = await this.createPaymentAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Address key is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Payment Account key is empty!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to get order information!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to get payment account information!'));
      if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to pay!'));
      if (result == -14) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to save transaction data!'));
      if (result == -15) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to save order transaction edge!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}