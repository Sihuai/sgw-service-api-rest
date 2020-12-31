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
import { GetAnimationPlaybackAction } from '../../actions/animation.playback/get';
import { CreateAnimationPlaybackAction } from '../../actions/animation.playback/create';
import { DeleteAnimationPlaybackAction } from '../../actions/animation.playback/delete';
import { EditAnimationPlaybackAction } from '../../actions/animation.playback/edit';

@controller('/animationplayback')
export class AnimationPlaybackController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetAnimationPlaybackAction) private getAnimationPlaybackAction: GetAnimationPlaybackAction,
    @inject(IOC_TYPE.CreateAnimationPlaybackAction) private createAnimationPlaybackAction: CreateAnimationPlaybackAction,
    @inject(IOC_TYPE.EditAnimationPlaybackAction) private editAnimationPlaybackAction: EditAnimationPlaybackAction,
    @inject(IOC_TYPE.DeleteAnimationPlaybackAction) private deleteAnimationPlaybackAction: DeleteAnimationPlaybackAction,
  ) { }

  /**
* @swagger
  * /animationplayback/get:
  *   get:
  *     summary: Retrieve animation playback.
  *     description: Retrieve animation playback.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: Animation playback.
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
  *                       description: The animation playback's key.
  *                       example: "123456"
  *                     type:
  *                       type: string
  *                       description: The animation playback's type.
  *                       example: "SINGLE"
  *                     orientation:
  *                       type: string
  *                       description: The animation playback's orientation.
  *                       example: "LANDSCAPE"
  *                     nextPitStop:
  *                       type: object
  *                       properties:
  *                         name:
  *                           type: string
  *                           description: The animation playback's name.
  *                           example: "01"
  *                         animations:
  *                           type: array
  *                           items:
  *                             type: object
  *                             properties:
  *                               tag:
  *                                 type: string
  *                                 description: The animation playback animations's tag.
  *                                 example: "BASE"
  *                               uri:
  *                                 type: string
  *                                 description: The animation playback animations's uri.
  *                                 example: "https://fs.zulundatumsolutions.net:3001/animations/JSON_SGW_Bugis_Trail_Map.json"
  *                     buttons:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The animation playback buttons's sequence.
  *                             example: 1
  *                           tag:
  *                             type: string
  *                             description: The animation playback buttons's tag.
  *                             example: "01"
  *                           uri:
  *                             type: string
  *                             description: The animation playback buttons's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                           isNext:
  *                             type: boolean
  *                             description: The animation playback buttons's isNext.
  *                             example: false
  *                           style:
  *                             type: object
  *                             properties:
  *                               normal:
  *                                 type: object
  *                                 properties:
  *                                   top:
  *                                     type: string
  *                                     description: The animation playback buttons's top.
  *                                     example: "50%"
  *                                   left:
  *                                     type: string
  *                                     description: The animation playback buttons's left.
  *                                     example: "50%"
  *                                   width:
  *                                     type: string
  *                                     description: The animation playback buttons's width.
  *                                     example: 10
  *                                   height:
  *                                     type: string
  *                                     description: The animation playback buttons's height.
  *                                     example: 10
  *                           location:
  *                             type: object
  *                             properties:
  *                               x:
  *                                 type: number
  *                                 description: The animation playback buttons's x axis.
  *                                 example: 1.0215428
  *                               y:
  *                                 type: number
  *                                 description: The animation playback buttons's y axis.
  *                                 example: 5.5482162
  *                     icons:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The animation playback icons's sequence.
  *                             example: 1
  *                           tag:
  *                             type: string
  *                             description: The animation playback icons's tag.
  *                             example: "01"
  *                           uri:
  *                             type: string
  *                             description: The animation playback icons's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                           style:
  *                             type: object
  *                             properties:
  *                               normal:
  *                                 type: object
  *                                 properties:
  *                                   top:
  *                                     type: string
  *                                     description: The animation playback buttons's top.
  *                                     example: "50%"
  *                                   left:
  *                                     type: string
  *                                     description: The animation playback buttons's left.
  *                                     example: "50%"
  *                                   width:
  *                                     type: string
  *                                     description: The animation playback buttons's width.
  *                                     example: 10
  *                                   height:
  *                                     type: string
  *                                     description: The animation playback buttons's height.
  *                                     example: 10
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

      const result = await this.getAnimationPlaybackAction.execute(token);
      if (result == -10) return response.status(ResponseDataCode.OK).json(ResponseSuccess(''));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result[0]));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /animationplayback/create:
  *   post:
  *     summary: Create animation playback.
  *     description: Create animation playback.
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
  *                 allowEmptyValue: false
  *                 description: The animation playback's type.
  *                 example: "SINGLE"
  *               orientation:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The animation playback's orientation.
  *                 example: "LANDSCAPE"
  *               nextPitStop:
  *                 type: object
  *                 allowEmptyValue: false
  *                 properties:
  *                   name:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The animation playback's name.
  *                     example: "01"
  *                   animations:
  *                     type: array
  *                     allowEmptyValue: false
  *                     items:
  *                       type: object
  *                       allowEmptyValue: false
  *                       properties:
  *                         tag:
  *                           type: string
  *                           allowEmptyValue: false
  *                           description: The animation playback animations's tag.
  *                           example: "BASE"
  *                         uri:
  *                           type: string
  *                           allowEmptyValue: false
  *                           description: The animation playback animations's uri.
  *                           example: "https://fs.zulundatumsolutions.net:3001/animations/JSON_SGW_Bugis_Trail_Map.json"
  *               buttons:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   allowEmptyValue: false
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's sequence.
  *                       example: 1
  *                     tag:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's tag.
  *                       example: "01"
  *                     uri:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's uri.
  *                       example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                     isNext:
  *                       type: boolean
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's isNext.
  *                       example: false
  *                     style:
  *                       type: object
  *                       properties:
  *                         normal:
  *                           type: object
  *                           properties:
  *                             top:
  *                               type: string
  *                               description: The animation playback buttons's top.
  *                               example: "50%"
  *                             left:
  *                               type: string
  *                               description: The animation playback buttons's left.
  *                               example: "50%"
  *                             width:
  *                               type: string
  *                               description: The animation playback buttons's width.
  *                               example: 10
  *                             height:
  *                               type: string
  *                               description: The animation playback buttons's height.
  *                               example: 10
  *                     location:
  *                       type: object
  *                       properties:
  *                         x:
  *                           type: number
  *                           description: The animation playback buttons's x axis.
  *                           example: 1.0215428
  *                         y:
  *                           type: number
  *                           description: The animation playback buttons's y axis.
  *                           example: 5.5482162
  *               icons:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   allowEmptyValue: false
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       allowEmptyValue: false
  *                       description: The animation playback icons's sequence.
  *                       example: 1
  *                     tag:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback icons's tag.
  *                       example: "01"
  *                     uri:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback icons's uri.
  *                       example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                     style:
  *                       type: object
  *                       properties:
  *                         normal:
  *                           type: object
  *                           properties:
  *                             top:
  *                               type: string
  *                               description: The animation playback buttons's top.
  *                               example: "50%"
  *                             left:
  *                               type: string
  *                               description: The animation playback buttons's left.
  *                               example: "50%"
  *                             width:
  *                               type: string
  *                               description: The animation playback buttons's width.
  *                               example: 10
  *                             height:
  *                               type: string
  *                               description: The animation playback buttons's height.
  *                               example: 10
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
  *                       description: animation playback's key.
  *                       example: "123456"
  *                     type:
  *                       type: string
  *                       description: The animation playback's type.
  *                       example: "SINGLE"
  *                     orientation:
  *                       type: string
  *                       description: The animation playback's orientation.
  *                       example: "LANDSCAPE"
  *                     nextPitStop:
  *                       type: object
  *                       properties:
  *                         name:
  *                           type: string
  *                           description: The animation playback's name.
  *                           example: "01"
  *                         animations:
  *                           type: array
  *                           items:
  *                             type: object
  *                             properties:
  *                               tag:
  *                                 type: string
  *                                 description: The animation playback animations's tag.
  *                                 example: "BASE"
  *                               uri:
  *                                 type: string
  *                                 description: The animation playback animations's uri.
  *                                 example: "https://fs.zulundatumsolutions.net:3001/animations/JSON_SGW_Bugis_Trail_Map.json"
  *                     buttons:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The animation playback buttons's sequence.
  *                             example: 1
  *                           tag:
  *                             type: string
  *                             description: The animation playback buttons's tag.
  *                             example: "01"
  *                           uri:
  *                             type: string
  *                             description: The animation playback buttons's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                           isNext:
  *                             type: boolean
  *                             description: The animation playback buttons's isNext.
  *                             example: false
  *                           style:
  *                             type: object
  *                             properties:
  *                               normal:
  *                                 type: object
  *                                 properties:
  *                                   top:
  *                                     type: string
  *                                     description: The animation playback buttons's top.
  *                                     example: "50%"
  *                                   left:
  *                                     type: string
  *                                     description: The animation playback buttons's left.
  *                                     example: "50%"
  *                                   width:
  *                                     type: string
  *                                     description: The animation playback buttons's width.
  *                                     example: 10
  *                                   height:
  *                                     type: string
  *                                     description: The animation playback buttons's height.
  *                                     example: 10
  *                     location:
  *                       type: object
  *                       properties:
  *                         x:
  *                           type: number
  *                           description: The animation playback buttons's x axis.
  *                           example: 1.0215428
  *                         y:
  *                           type: number
  *                           description: The animation playback buttons's y axis.
  *                           example: 5.5482162
  *                     icons:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The animation playback icons's sequence.
  *                             example: 1
  *                           tag:
  *                             type: string
  *                             description: The animation playback icons's tag.
  *                             example: "01"
  *                           uri:
  *                             type: string
  *                             description: The animation playback icons's uri.
  *                             example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                           style:
  *                             type: object
  *                             properties:
  *                               normal:
  *                                 type: object
  *                                 properties:
  *                                   top:
  *                                     type: string
  *                                     description: The animation playback buttons's top.
  *                                     example: "50%"
  *                                   left:
  *                                     type: string
  *                                     description: The animation playback buttons's left.
  *                                     example: "50%"
  *                                   width:
  *                                     type: string
  *                                     description: The animation playback buttons's width.
  *                                     example: 10
  *                                   height:
  *                                     type: string
  *                                     description: The animation playback buttons's height.
  *                                     example: 10
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
      
      const result = await this.createAnimationPlaybackAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Orientation is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Buttons is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icons is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop name is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop animations is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop animations tag is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop animations uri is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button sequence less than zero!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button tag is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button uri is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style is empty!'));
      if (result == -104) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal is empty!'));
      if (result == -105) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal top is empty!'));
      if (result == -106) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal left is empty!'));
      if (result == -107) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal width less than zero!'));
      if (result == -108) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal height less than zero!'));
      if (result == -109) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button location is empty!'));
      if (result == -110) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button location x less than zero!'));
      if (result == -111) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button location y less than zero!'));
      if (result == -112) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button sequence has repeat no.!'));
      if (result == -113) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button isNext have repeat True!'));

      if (result == -114) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon sequence less than zero!'));
      if (result == -115) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon tag is empty!'));
      if (result == -116) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon uri is empty!'));
      if (result == -117) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style is empty!'));
      if (result == -118) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal is empty!'));
      if (result == -119) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal top is empty!'));
      if (result == -120) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal left is empty!'));
      if (result == -121) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal width less than zero!'));
      if (result == -122) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal height less than zero!'));
      if (result == -123) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon sequence has repeat no.!'));

      if (result == -12) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to create!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /animationplayback/edit:
  *   post:
  *     summary: Edit animation playback.
  *     description: Edit animation playback.
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
  *                 description: The animation playback's key.
  *                 example: "123456"
  *               type:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The animation playback's type.
  *                 example: "SINGLE"
  *               orientation:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The animation playback's orientation.
  *                 example: "LANDSCAPE"
  *               nextPitStop:
  *                 type: object
  *                 allowEmptyValue: false
  *                 properties:
  *                   name:
  *                     type: string
  *                     allowEmptyValue: false
  *                     description: The animation playback's name.
  *                     example: "01"
  *                   animations:
  *                     type: array
  *                     allowEmptyValue: false
  *                     items:
  *                       type: object
  *                       allowEmptyValue: false
  *                       properties:
  *                         tag:
  *                           type: string
  *                           allowEmptyValue: false
  *                           description: The animation playback animations's tag.
  *                           example: "BASE"
  *                         uri:
  *                           type: string
  *                           allowEmptyValue: false
  *                           description: The animation playback animations's uri.
  *                           example: "https://fs.zulundatumsolutions.net:3001/animations/JSON_SGW_Bugis_Trail_Map.json"
  *               buttons:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   allowEmptyValue: false
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's sequence.
  *                       example: 1
  *                     tag:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's tag.
  *                       example: "01"
  *                     uri:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's uri.
  *                       example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                     isNext:
  *                       type: boolean
  *                       allowEmptyValue: false
  *                       description: The animation playback buttons's isNext.
  *                       example: false
  *                     style:
  *                       type: object
  *                       properties:
  *                         normal:
  *                           type: object
  *                           properties:
  *                             top:
  *                               type: string
  *                               description: The animation playback buttons's top.
  *                               example: "50%"
  *                             left:
  *                               type: string
  *                               description: The animation playback buttons's left.
  *                               example: "50%"
  *                             width:
  *                               type: string
  *                               description: The animation playback buttons's width.
  *                               example: 10
  *                             height:
  *                               type: string
  *                               description: The animation playback buttons's height.
  *                               example: 10
  *                     location:
  *                       type: object
  *                       properties:
  *                         x:
  *                           type: number
  *                           description: The animation playback buttons's x axis.
  *                           example: 1.0215428
  *                         y:
  *                           type: number
  *                           description: The animation playback buttons's y axis.
  *                           example: 5.5482162
  *               icons:
  *                 type: array
  *                 allowEmptyValue: false
  *                 items:
  *                   type: object
  *                   allowEmptyValue: false
  *                   properties:
  *                     sequence:
  *                       type: number
  *                       allowEmptyValue: false
  *                       description: The animation playback icons's sequence.
  *                       example: 1
  *                     tag:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback icons's tag.
  *                       example: "01"
  *                     uri:
  *                       type: string
  *                       allowEmptyValue: false
  *                       description: The animation playback icons's uri.
  *                       example: "https://fs.zulundatumsolutions.net:3001/images/pit_stops/SGW_Map_Button_01.png"
  *                     style:
  *                       type: object
  *                       properties:
  *                         normal:
  *                           type: object
  *                           properties:
  *                             top:
  *                               type: string
  *                               description: The animation playback buttons's top.
  *                               example: "50%"
  *                             left:
  *                               type: string
  *                               description: The animation playback buttons's left.
  *                               example: "50%"
  *                             width:
  *                               type: string
  *                               description: The animation playback buttons's width.
  *                               example: 10
  *                             height:
  *                               type: string
  *                               description: The animation playback buttons's height.
  *                               example: 10
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
  *                       description: animation playback's id.
  *                       example: "AnimationPlayback/123456"
  *                     _key:
  *                       type: string
  *                       description: animation playback's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: animation playback's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: animation playback's old revision.
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

      const result = await this.editAnimationPlaybackAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Type is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Orientation is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Buttons is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icons is empty!'));
      if (result == -6) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop name is empty!'));
      if (result == -7) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop animations is empty!'));
      if (result == -8) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop animations tag is empty!'));
      if (result == -9) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Next Pit Stop animations uri is empty!'));
      if (result == -100) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button sequence less than zero!'));
      if (result == -101) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button tag is empty!'));
      if (result == -102) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button uri is empty!'));
      if (result == -103) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style is empty!'));
      if (result == -104) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal is empty!'));
      if (result == -105) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal top is empty!'));
      if (result == -106) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal left is empty!'));
      if (result == -107) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal width less than zero!'));
      if (result == -108) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button style normal height less than zero!'));
      if (result == -109) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button location is empty!'));
      if (result == -110) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button location x less than zero!'));
      if (result == -111) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button location y less than zero!'));
      if (result == -112) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button sequence has repeat no.!'));
      if (result == -113) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Button isNext have repeat True!'));

      if (result == -114) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon sequence less than zero!'));
      if (result == -115) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon tag is empty!'));
      if (result == -116) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon uri is empty!'));
      if (result == -117) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style is empty!'));
      if (result == -118) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal is empty!'));
      if (result == -119) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal top is empty!'));
      if (result == -120) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal left is empty!'));
      if (result == -121) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal width less than zero!'));
      if (result == -122) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon style normal height less than zero!'));
      if (result == -123) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Icon sequence has repeat no.!'));

      if (result == -124) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'AnimationPlayback key is empty!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /animationplayback/delete:
  *   delete:
  *     summary: Delete animation playback.
  *     description: Delete animation playback.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the animation playback.
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

      const result = await this.deleteAnimationPlaybackAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Not exist animation playback!'));
      if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove AnimationPlayback User-AnimationPlayback data!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}