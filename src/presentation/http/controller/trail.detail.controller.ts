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
import { GetTrailDetailAction } from '../../actions/trail.detail/get';
import { CreateTrailDetailAction } from '../../actions/trail.detail/create';
import { EditTrailDetailAction } from '../../actions/trail.detail/edit';
import { DeleteTrailDetailAction } from '../../actions/trail.detail/delete';

@controller('/traildetail')
export class TrailDetailController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetTrailDetailAction) public getTrailDetailAction: GetTrailDetailAction,
    @inject(IOC_TYPE.CreateTrailDetailAction) public createTrailDetailAction: CreateTrailDetailAction,
    @inject(IOC_TYPE.EditTrailDetailAction) public editTrailDetailAction: EditTrailDetailAction,
    @inject(IOC_TYPE.DeleteTrailDetailAction) public deleteTrailDetailAction: DeleteTrailDetailAction,
  ) { }

  /**
* @swagger
  * /traildetail/get:
  *   get:
  *     summary: Retrieve trail detail information.
  *     description: Retrieve trail detail information.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: trailkey
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the trail.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *     responses:
  *       200:
  *         description: A list of trail detail data.
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
  *                       description: The trail detail's key.
  *                       example: "123456"
  *                     name:
  *                       type: string
  *                       description: The trail detail's name.
  *                       example: "Bugis Trail Detail"
  *                     personas:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           type:
  *                             type: string
  *                             description: The trail detail's type.
  *                             example: "1"
  *                           contents:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 sequence:
  *                                   type: number
  *                                   description: The trail detail's sequence.
  *                                   example: 1
  *                                 type:
  *                                   type: string
  *                                   description: The trail detail's type.
  *                                   example: "PHOTO"
  *                                 orientation:
  *                                   type: string
  *                                   description: The trail detail's orientation.
  *                                   example: "orientation"
  *                                 format:
  *                                   type: string
  *                                   description: The trail detail's format.
  *                                   example: "3R"
  *                                 uri:
  *                                   type: string
  *                                   description: The trail detail's uri.
  *                                   example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
  *                                 tag:
  *                                   type: string
  *                                   description: The trail detail's tag.
  *                                   example: "TOURIST-INDIVIDUAL"
  *                                 data:
  *                                   type: object
  *                                   properties:
  *                                     content:
  *                                       type: string
  *                                       description: The trail detail's content.
  *                                       example: "Tourist Individual participation information here...."
  *                                     price:
  *                                       type: object
  *                                       properties:
  *                                         value:
  *                                           type: number
  *                                           description: The trail detail price's value.
  *                                           example: "10.0"
  *                                         currency:
  *                                           type: string
  *                                           description: The trail detail price's currency.
  *                                           example: "SGD"
  *                                         taxable:
  *                                           type: boolean
  *                                           description: Does trail detail price taxable?
  *                                           example: false
  *                                         taxInPercentage:
  *                                           type: number
  *                                           description: The trail detail price tax in percentage.
  *                                           example: 7
  *                                         taxIncluded:
  *                                           type: boolean
  *                                           description: Does trail detail price included tax?
  *                                           example: false
  *                     sections:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           type:
  *                             type: string
  *                             description: The trail detail section type.
  *                             example: "1"
  *                           sequence:
  *                             type: number
  *                             description: The trail detail section sequence.
  *                             example: 1
  *                           contents:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 price:
  *                                   type: string
  *                                   description: The trail detail section content price.
  *                                   example: "T.B.A"
  *                                 copy:
  *                                   type: string
  *                                   description: The trail detail section content copy.
  *                                   example: "Tourist Individual participation information here.... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  *                                 includeAddToCart:
  *                                   type: object
  *                                   properties:
  *                                     icon:
  *                                       type: boolean
  *                                       description: The trail detail section content includeAddToCart icon.
  *                                       example: true
  *                                     text:
  *                                       type: boolean
  *                                       description: The trail detail section content includeAddToCart text.
  *                                       example: true
  *                                     button:
  *                                       type: string
  *                                       description: The trail detail section content includeAddToCart button.
  *                                       example: true
  *                                     caption:
  *                                       type: string
  *                                       description: The trail detail section content includeAddToCart caption.
  *                                       example: "Add to Cart"
  *                                 photo:
  *                                   type: object
  *                                   properties:
  *                                     type:
  *                                       type: string
  *                                       description: The trail detail's photo type.
  *                                       example: "PHOTO"
  *                                     orientation:
  *                                       type: string
  *                                       description: The trail detail's photo orientation.
  *                                       example: "orientation"
  *                                     format:
  *                                       type: string
  *                                       description: The trail detail's photo format.
  *                                       example: "3R"
  *                                     uri:
  *                                       type: string
  *                                       description: The trail detail's photo uri.
  *                                       example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
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
    @queryParam('trailkey') trailkey: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      getUserFromToken(authHeader, request.cookies['r-token']);

      const result = await this.getTrailDetailAction.execute(trailkey);
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Key is empty!'));
      if (result == -11) return response.status(ResponseDataCode.OK).json(ResponseSuccess(''));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /traildetail/create:
  *   post:
  *     summary: Create trail detail.
  *     description: Create trail detail.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               trailkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The trail's key.
  *                 example: "123456"
  *               name:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The trail detail's name.
  *                 example: "Bugis Trail Detail"
  *               personas:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The trail detail personas's type.
  *                       example: "1"
  *                     contents:
  *                       type: array
  *                       items:
  *                         type: object
  *                         allowEmptyValue: false
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's sequence.
  *                             example: 1
  *                           type:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail's type.
  *                             example: "PHOTO"
  *                           orientation:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's orientation.
  *                             example: "orientation"
  *                           format:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's format.
  *                             example: "3R"
  *                           uri:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
  *                           tag:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's tag.
  *                             example: "TOURIST-INDIVIDUAL"
  *                           data:
  *                             type: object
  *                             allowEmptyValue: false
  *                             properties:
  *                               content:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail personas's content.
  *                                 example: "Tourist Individual participation information here...."
  *                               price:
  *                                 type: object
  *                                 properties:
  *                                   value:
  *                                     type: number
  *                                     allowEmptyValue: false
  *                                     description: The trail detail price's value.
  *                                     example: "10.0"
  *                                   currency:
  *                                     type: string
  *                                     allowEmptyValue: false
  *                                     description: The trail detail price's currency.
  *                                     example: "SGD"
  *                                   taxable:
  *                                     type: boolean
  *                                     allowEmptyValue: true
  *                                     description: Does trail detail price taxable?
  *                                     example: false
  *                                   taxInPercentage:
  *                                     type: number
  *                                     allowEmptyValue: true
  *                                     description: The trail detail price tax in percentage.
  *                                     example: 7
  *                                   taxIncluded:
  *                                     type: boolean
  *                                     allowEmptyValue: true
  *                                     description: Does trail detail price included tax?
  *                                     example: false
  *               sections:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   allowEmptyValue: false
  *                   properties:
  *                     type:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The trail detail section type.
  *                       example: "1"
  *                     sequence:
  *                       type: number
  *                       allowEmptyValue: false
  *                       description: The trail detail section sequence.
  *                       example: 1
  *                     contents:
  *                       type: array
  *                       allowEmptyValue: false
  *                       items:
  *                         type: object
  *                         allowEmptyValue: false
  *                         properties:
  *                           price:
  *                             type: string
  *                             allowEmptyValue: true
  *                             description: The trail detail section content price.
  *                             example: "T.B.A"
  *                           copy:
  *                             type: string
  *                             allowEmptyValue: true
  *                             description: The trail detail section content copy.
  *                             example: "Tourist Individual participation information here.... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  *                           includeAddToCart:
  *                             type: object
  *                             allowEmptyValue: true
  *                             properties:
  *                               icon:
  *                                 type: boolean
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart icon.
  *                                 example: true
  *                               text:
  *                                 type: boolean
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart text.
  *                                 example: true
  *                               button:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart button.
  *                                 example: true
  *                               caption:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart caption.
  *                                 example: "Add to Cart"
  *                           photo:
  *                             type: object
  *                             allowEmptyValue: true
  *                             properties:
  *                               type:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo type.
  *                                 example: "PHOTO"
  *                               orientation:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo orientation.
  *                                 example: "orientation"
  *                               format:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo format.
  *                                 example: "3R"
  *                               uri:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo uri.
  *                                 example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
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
  @httpPost('/create')
  private async create(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.createTrailDetailAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Name is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Personas is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sections is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Key is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona type is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents sequence less than zero!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents type is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents orientation is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents format is empty!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents URI is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents tag is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data is empty!'));
      if (result == -104) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data content is empty!'));
      if (result == -105) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data price is empty!'));
      if (result == -106) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data price value less than zero!'));
      if (result == -107) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data price currency!'));
      if (result == -108) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Section sequence less than zero!'));
      if (result == -109) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Section type is empty!'));
      if (result == -110) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Section contents is empty!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cannot save trail detail information!'));
      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Cannot create trail detail relation!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /traildetail/edit:
  *   post:
  *     summary: Edit trail detail.
  *     description: Edit trail detail.
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
  *                 description: The trail detail's key.
  *                 example: "123456"
  *               name:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The trail detail's name.
  *                 example: "Bugis Trail Detail"
  *               personas:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   properties:
  *                     type:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The trail detail personas's type.
  *                       example: "1"
  *                     contents:
  *                       type: array
  *                       items:
  *                         type: object
  *                         allowEmptyValue: false
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's sequence.
  *                             example: 1
  *                           type:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail's type.
  *                             example: "PHOTO"
  *                           orientation:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's orientation.
  *                             example: "orientation"
  *                           format:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's format.
  *                             example: "3R"
  *                           uri:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
  *                           tag:
  *                             type: string
  *                             allowEmptyValue: false
  *                             description: The trail detail personas's tag.
  *                             example: "TOURIST-INDIVIDUAL"
  *                           data:
  *                             type: object
  *                             allowEmptyValue: false
  *                             properties:
  *                               content:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail personas's content.
  *                                 example: "Tourist Individual participation information here...."
  *                               price:
  *                                 type: object
  *                                 properties:
  *                                   value:
  *                                     type: number
  *                                     allowEmptyValue: false
  *                                     description: The trail detail price's value.
  *                                     example: "10.0"
  *                                   currency:
  *                                     type: string
  *                                     allowEmptyValue: false
  *                                     description: The trail detail price's currency.
  *                                     example: "SGD"
  *                                   taxable:
  *                                     type: boolean
  *                                     allowEmptyValue: true
  *                                     description: Does trail detail price taxable?
  *                                     example: false
  *                                   taxInPercentage:
  *                                     type: number
  *                                     allowEmptyValue: true
  *                                     description: The trail detail price tax in percentage.
  *                                     example: 7
  *                                   taxIncluded:
  *                                     type: boolean
  *                                     allowEmptyValue: true
  *                                     description: Does trail detail price included tax?
  *                                     example: false
  *               sections:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   allowEmptyValue: false
  *                   properties:
  *                     type:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The trail detail section type.
  *                       example: "1"
  *                     sequence:
  *                       type: number
  *                       allowEmptyValue: false
  *                       description: The trail detail section sequence.
  *                       example: 1
  *                     contents:
  *                       type: array
  *                       allowEmptyValue: false
  *                       items:
  *                         type: object
  *                         allowEmptyValue: false
  *                         properties:
  *                           price:
  *                             type: string
  *                             allowEmptyValue: true
  *                             description: The trail detail section content price.
  *                             example: "T.B.A"
  *                           copy:
  *                             type: string
  *                             allowEmptyValue: true
  *                             description: The trail detail section content copy.
  *                             example: "Tourist Individual participation information here.... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  *                           includeAddToCart:
  *                             type: object
  *                             allowEmptyValue: true
  *                             properties:
  *                               icon:
  *                                 type: boolean
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart icon.
  *                                 example: true
  *                               text:
  *                                 type: boolean
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart text.
  *                                 example: true
  *                               button:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart button.
  *                                 example: true
  *                               caption:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail section content includeAddToCart caption.
  *                                 example: "Add to Cart"
  *                           photo:
  *                             type: object
  *                             allowEmptyValue: true
  *                             properties:
  *                               type:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo type.
  *                                 example: "PHOTO"
  *                               orientation:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo orientation.
  *                                 example: "orientation"
  *                               format:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo format.
  *                                 example: "3R"
  *                               uri:
  *                                 type: string
  *                                 allowEmptyValue: false
  *                                 description: The trail detail's photo uri.
  *                                 example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
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
  *                       description: trail detail's id.
  *                       example: "TrailDetail/123456"
  *                     _key:
  *                       type: string
  *                       description: trail detail's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: trail detail's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: trail detail's old revision.
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

      const result = await this.editTrailDetailAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Title is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Personas is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sections is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona type is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents sequence less than zero!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents type is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents orientation is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents format is empty!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents URI is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents tag is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data is empty!'));
      if (result == -104) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data content is empty!'));
      if (result == -105) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data price is empty!'));
      if (result == -106) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data price value less than zero!'));
      if (result == -107) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Persona contents data price currency!'));
      if (result == -108) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Section sequence less than zero!'));
      if (result == -109) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Section type is empty!'));
      if (result == -110) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Section contents is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Trail Detail is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /traildetail/delete:
  *   delete:
  *     summary: Delete trail detail.
  *     description: Delete trail detail.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the trail detail.
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
  *                   description: Response code.
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

      const result = await this.deleteTrailDetailAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Trail Detail is not exist!'));
      if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove Trail Trail-Detail data!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}