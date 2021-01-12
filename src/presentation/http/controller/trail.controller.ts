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
import { GetTrailAction } from '../../actions/trail/get';
import { CreateTrailAction } from '../../actions/trail/create';
import { EditTrailAction } from '../../actions/trail/edit';
import { DeleteTrailAction } from '../../actions/trail/delete';
import { CreateTrailAnimationAction } from '../../actions/trail/add.animation';
import { DeleteTrailAnimationAction } from '../../actions/trail/remove.animation';
import { MyTrailAction } from '../../actions/trail/my';

@controller('/trail')
export class TrailController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetTrailAction) private getTrailAction: GetTrailAction,
    @inject(IOC_TYPE.CreateTrailAction) private createTrailAction: CreateTrailAction,
    @inject(IOC_TYPE.EditTrailAction) private editTrailAction: EditTrailAction,
    @inject(IOC_TYPE.DeleteTrailAction) private deleteTrailAction: DeleteTrailAction,
    @inject(IOC_TYPE.MyTrailAction) private myTrailAction: MyTrailAction,
    @inject(IOC_TYPE.CreateTrailAnimationAction) private createTrailAnimationAction: CreateTrailAnimationAction,
    @inject(IOC_TYPE.DeleteTrailAnimationAction) private deleteTrailAnimationAction: DeleteTrailAnimationAction,
  ) { }

   /**
* @swagger
  * /trail/get:
  *   get:
  *     summary: Retrieve trail information.
  *     description: Retrieve trail information.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of trail data.
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
  *                         description: The trail's key.
  *                         example: "123456"
  *                       sequence:
  *                         type: number
  *                         description: The trail's sequence.
  *                         example: 1
  *                       title:
  *                         type: string
  *                         description: The trail's title.
  *                         example: "BUGIS Trail - 01"
  *                       media:
  *                         type: object
  *                         properties:
  *                           type:
  *                             type: string
  *                             description: The trail's string.
  *                             example: "PHOTO"
  *                           orientation:
  *                             type: string
  *                             description: The trail's orientation.
  *                             example: "LANDSCAPE"
  *                           format:
  *                             type: string
  *                             description: The trail's format.
  *                             example: "3R"
  *                           uri:
  *                             type: string
  *                             description: The trail's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png"
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

      const result = await this.getTrailAction.execute();

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /trail/create:
  *   post:
  *     summary: Create trail.
  *     description: Create trail.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               sequence:
  *                 type: number
  *                 allowEmptyValue: false
  *                 description: The trail's sequence.
  *                 example: 1
  *               title:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The trail's title.
  *                 example: "BUGIS Trail - 01"
  *               media:
  *                 type: object
  *                 allowEmptyValue: false
  *                 properties:
  *                   type:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's string.
  *                     example: "PHOTO"
  *                   orientation:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's orientation.
  *                     example: "LANDSCAPE"
  *                   format:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's format.
  *                     example: "3R"
  *                   uri:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's uri.
  *                     example: "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png"
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
      
      const result = await this.createTrailAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sequence is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Title is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Media is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail type is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail orientation is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail format is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail URI is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Sequence existed!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /trail/edit:
  *   post:
  *     summary: Edit trail.
  *     description: Edit trail.
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
  *                 description: The trail's key.
  *                 example: "123456"
  *               sequence:
  *                 type: number
  *                 allowEmptyValue: false
  *                 description: The trail's sequence.
  *                 example: 1
  *               title:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The trail's title.
  *                 example: "BUGIS Trail - 01"
  *               media:
  *                 type: object
  *                 allowEmptyValue: false
  *                 properties:
  *                   type:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's string.
  *                     example: "PHOTO"
  *                   orientation:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's orientation.
  *                     example: "LANDSCAPE"
  *                   format:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's format.
  *                     example: "3R"
  *                   uri:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The trail's uri.
  *                     example: "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png"
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
  *                       description: trail's id.
  *                       example: "Trail/123456"
  *                     _key:
  *                       type: string
  *                       description: trail's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: trail's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: trail's old revision.
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

      const result = await this.editTrailAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sequence is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Title is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Media is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail type is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail orientation is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail format is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail URI is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sequence is not existed!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sequence is used to other trail!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Trail is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /trail/delete:
  *   delete:
  *     summary: Delete trail.
  *     description: Delete trail.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the trail.
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

      const result = await this.deleteTrailAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This Trail is not exist!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Please remove Trail Detail first!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
  
  /**
* @swagger
  * /trail/addanimation:
  *   post:
  *     summary: Add animation to trail.
  *     description: Add animation to trail.
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
  *                 description: The animation key.
  *                 example: "123456"
  *               tokey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The trail key.
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
 @httpPost('/addanimation')
 private async addAnimation(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.createTrailAnimationAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Animation Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Key is empty!'));
     
     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

 /**
* @swagger
 * /trail/removeanimation:
 *   delete:
 *     summary: Remove animation from trail.
 *     description: Remove animation from trail.
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
  *                 description: The animation key.
  *                 example: "123456"
  *               tokey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The trail key.
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
 @httpDelete('/removeanimation')
 private async removeAnimation(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     const token = getUserFromToken(authHeader, request.cookies['r-token']);
     
     const result = await this.deleteTrailAnimationAction.execute(token, request.body);
     if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Animation Key is empty!'));
     if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Trail Key is empty!'));
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
  * /trail/my:
  *   get:
  *     summary: Retrieve my trail information.
  *     description: Retrieve my trail information.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of my trail data.
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
  *                         description: The order detail's key.
  *                         example: "123456"
  *                       type:
  *                         type: string
  *                         description: The order detail's type (TRAIL).
  *                         example: "TRAIL"
  *                       name:
  *                         type: string
  *                         description: The order detail's name.
  *                         example: "Bugis Trail"
  *                       description:
  *                         type: string
  *                         description: The order detail's description.
  *                         example: "Lorem ipsum dolor sit amet, consectetur..."
  *                       uri:
  *                         type: string
  *                         description: The order detail's uri.
  *                         example: "https://via.placeholder.com/450x315.png"
  *                       qty:
  *                         type: number
  *                         description: The order detail's qty.
  *                         example: 1
  *                       uom:
  *                         type: string
  *                         description: The order detail's uom.
  *                         example: "TICKET"
  *                       price:
  *                         type: object
  *                         properties:
  *                           value:
  *                             type: number
  *                             description: The order detail price's value.
  *                             example: 10.0
  *                           currency:
  *                             type: string
  *                             description: The order detail price's currency.
  *                             example: "SGD"
  *                           taxable:
  *                             type: boolean
  *                             description: Does order detail price taxable?
  *                             example: false
  *                           taxInPercentage:
  *                             type: number
  *                             description: The order detail price tax in percentage.
  *                             example: 7
  *                           taxIncluded:
  *                             type: boolean
  *                             description: Does order detail price included tax?
  *                             example: false
  *                       options:
  *                         type: object
  *                         properties:
  *                           personas:
  *                             type: array
  *                             items:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: string
  *                                   description: The order detail options personas's type.
  *                                   example: 1
  *                                 contents:
  *                                   type: array
  *                                   items:
  *                                     type: object
  *                                     properties:
  *                                       sequence:
  *                                         type: number
  *                                         description: The order detail's sequence.
  *                                         example: 1
  *                                       type:
  *                                         type: string
  *                                         description: The order detail's type.
  *                                         example: "PHOTO"
  *                                       orientation:
  *                                         type: string
  *                                         description: The order detail's orientation.
  *                                         example: "orientation"
  *                                       format:
  *                                         type: string
  *                                         description: The order detail's format.
  *                                         example: "3R"
  *                                       uri:
  *                                         type: string
  *                                         description: The order detail's uri.
  *                                         example: "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png"
  *                                       tag:
  *                                         type: string
  *                                         description: The order detail's tag.
  *                                         example: "TOURIST-INDIVIDUAL"
  *                                       data:
  *                                         type: object
  *                                         properties:
  *                                           content:
  *                                             type: string
  *                                             description: The order detail's content.
  *                                             example: "Tourist Individual participation information here...."
  *                                           price:
  *                                             type: object
  *                                             properties:
  *                                               value:
  *                                                 type: number
  *                                                 description: The order detail price's value.
  *                                                 example: 10.0
  *                                               currency:
  *                                                 type: string
  *                                                 description: The order detail price's currency.
  *                                                 example: "SGD"
  *                                               taxable:
  *                                                 type: boolean
  *                                                 description: Does order detail price taxable?
  *                                                 example: false
  *                                               taxInPercentage:
  *                                                 type: number
  *                                                 description: The order detail price tax in percentage.
  *                                                 example: 7
  *                                               taxIncluded:
  *                                                 type: boolean
  *                                                 description: Does order detail price included tax?
  *                                                 example: false
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
 @httpGet('/my')
 private async my(
   @requestHeaders('authorization') authHeader: string,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
    const token = getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.myTrailAction.execute(token);

     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }
}