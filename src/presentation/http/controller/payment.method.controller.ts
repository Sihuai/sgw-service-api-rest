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
import { GetAddressAction } from '../../actions/address/get';
import { CreateAddressAction } from '../../actions/address/create';
import { EditAddressAction } from '../../actions/address/edit';
import { DeleteAddressAction } from '../../actions/address/delete';

@controller('/paymentmethod')
export class PaymentMethodController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetAddressAction) private getAddressAction: GetAddressAction,
    @inject(IOC_TYPE.CreateAddressAction) private createAddressAction: CreateAddressAction,
    @inject(IOC_TYPE.EditAddressAction) private editAddressAction: EditAddressAction,
    @inject(IOC_TYPE.DeleteAddressAction) private deleteAddressAction: DeleteAddressAction,
  ) { }

  /**
* @swagger
  * /paymentmethod/pay:
  *   post:
  *     summary: Pay by payment method.
  *     description: Pay by payment method.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               country:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The address's country.
  *                 example: SINGAPORE
  *               block:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The address's block.
  *                 example: "40"
  *               propertyName:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The address's property name.
  *                 example: The Excell
  *               street:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The address's street.
  *                 example: East Coast Road
  *               unit:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The address's unit.
  *                 example: "03-80"
  *               province:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The address's province.
  *                 example: SINGAPORE
  *               city:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The address's city.
  *                 example: SINGAPORE
  *               postal:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The address's postal.
  *                 example: "090088"
  *               isDefault:
  *                 type: boolean
  *                 allowEmptyValue: false
  *                 description: The user's default address.
  *                 example: false
  *               recipient:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The address's recipient.
  *                 example: "Mark Louise"
  *               nameLast:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The address's name last.
  *                 example: "Louise"
  *               mobile:
  *                 type: string
  *                 allowEmptyValue: true
  *                 description: The address's mobile.
  *                 example: "+082 2568425"
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
  @httpPost('/pay')
  private async pay(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.createAddressAction.execute(token, request.body);
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Country is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Property name is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Street is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Unit is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Postal is empty!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Existed default address!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to create!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}