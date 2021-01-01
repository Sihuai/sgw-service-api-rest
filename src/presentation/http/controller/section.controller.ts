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
import { GetSectionAction } from '../../actions/section/get';
import { CreateSectionAction } from '../../actions/section/create';
import { EditSectionAction } from '../../actions/section/edit';
import { DeleteSectionAction } from '../../actions/section/delete';
import { getUserFromToken } from '../../../infra/utils/security';
import { CreateSectionTrailAction } from '../../actions/section/add.trail';
import { DeleteSectionTrailAction } from '../../actions/section/remove.trail';
import { PagingSectionAction } from '../../actions/section/paging';

@controller('/section')
export class SectionController implements interfaces.Controller {
  constructor(
    @inject(IOC_TYPE.GetSectionAction) private getSectionAction: GetSectionAction,
    @inject(IOC_TYPE.PagingSectionAction) private pagingSectionAction: PagingSectionAction,
    @inject(IOC_TYPE.CreateSectionAction) private createSectionAction: CreateSectionAction,
    @inject(IOC_TYPE.EditSectionAction) private editSectionAction: EditSectionAction,
    @inject(IOC_TYPE.DeleteSectionAction) private deleteSectionAction: DeleteSectionAction,
    @inject(IOC_TYPE.CreateSectionTrailAction) private createSectionTrailAction: CreateSectionTrailAction,
    @inject(IOC_TYPE.DeleteSectionTrailAction) private deleteSectionTrailAction: DeleteSectionTrailAction,
  ) { }

  /**
* @swagger
  * /section/get:
  *   get:
  *     summary: Retrieve section information.
  *     description: Retrieve section information.
  *     security:
  *       - apikey: []
  *     responses:
  *       200:
  *         description: A list of section data.
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
  *                         description: The section's key.
  *                         example: "123456"
  *                       sequence:
  *                         type: number
  *                         description: The section's number.
  *                         example: 1
  *                       header:
  *                         type: string
  *                         description: The section's header.
  *                         example: "Foodie Trails"
  *                       uri:
  *                         type: string
  *                         description: The section's uri.
  *                         example: "https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Mobile_App-09.png"
  *                       color:
  *                         type: string
  *                         description: The section's color.
  *                         example: "#B267A9"
  *                       trails:
  *                         type: array
  *                         items:
  *                           type: object
  *                           properties:
  *                             sequence:
  *                               type: number
  *                               description: The section trail's sequence.
  *                               example: 1
  *                             title:
  *                               type: string
  *                               description: The section trail's title.
  *                               example: "BUGIS Trail - 01"
  *                             media:
  *                               type: object
  *                               properties:
  *                                 type:
  *                                   type: string
  *                                   description: The section trail's string.
  *                                   example: "PHOTO"
  *                                 orientation:
  *                                   type: string
  *                                   description: The section trail's orientation.
  *                                   example: "LANDSCAPE"
  *                                 format:
  *                                   type: string
  *                                   description: The section trail's format.
  *                                   example: "3R"
  *                                 uri:
  *                                   type: string
  *                                   description: The section trail's uri.
  *                                   example: "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png"
  *                       pagination:
  *                         type: object
  *                         properties:
  *                           total:
  *                             type: number
  *                             description: The section pagination's total.
  *                             example: 1
  *                           index:
  *                             type: number
  *                             description: The section pagination's index.
  *                             example: 1
  *                           records:
  *                             type: object
  *                             properties:
  *                               pageSize:
  *                                 type: number
  *                                 description: The section pagination's pageSize.
  *                                 example: 10
  *                               pageIndex:
  *                                 type: number
  *                                 description: The section pagination's pageIndex.
  *                                 example: 0
  *                               total:
  *                                 type: number
  *                                 description: The section pagination's total.
  *                                 example: 1
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

      const result = await this.getSectionAction.execute();
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /section/paging:
  *   get:
  *     summary: Retrieve section information by paging.
  *     description: Retrieve section information by paging.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the section.
  *         schema:
  *           type: string
  *         style: simple
  *         example: "123456"
  *       - in: query
  *         name: index
  *         required: true
  *         allowEmptyValue: false
  *         description: index of the section.
  *         schema:
  *           type: number
  *         style: simple
  *         example: 0
  *     responses:
  *       200:
  *         description: A list of section data.
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
  *                       description: The section's key.
  *                       example: "123456"
  *                     sequence:
  *                       type: number
  *                       description: The section's number.
  *                       example: 1
  *                     header:
  *                       type: string
  *                       description: The section's header.
  *                       example: "Foodie Trails"
  *                     uri:
  *                       type: string
  *                       description: The section's uri.
  *                       example: "https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Mobile_App-09.png"
  *                     color:
  *                       type: string
  *                       description: The section's color.
  *                       example: "#B267A9"
  *                     trails:
  *                       type: array
  *                       items:
  *                         type: object
  *                         properties:
  *                           sequence:
  *                             type: number
  *                             description: The section trail's sequence.
  *                             example: 1
  *                           title:
  *                             type: string
  *                             description: The section trail's title.
  *                             example: "BUGIS Trail - 01"
  *                           media:
  *                             type: object
  *                             properties:
  *                               type:
  *                                 type: string
  *                                 description: The section trail's string.
  *                                 example: "PHOTO"
  *                               orientation:
  *                                 type: string
  *                                 description: The section trail's orientation.
  *                                 example: "LANDSCAPE"
  *                               format:
  *                                 type: string
  *                                 description: The section trail's format.
  *                                 example: "3R"
  *                               uri:
  *                                 type: string
  *                                 description: The section trail's uri.
  *                                 example: "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png"
  *                     pagination:
  *                       type: object
  *                       properties:
  *                         total:
  *                           type: number
  *                           description: The section pagination's total.
  *                           example: 1
  *                         index:
  *                           type: number
  *                           description: The section pagination's index.
  *                           example: 1
  *                         records:
  *                           type: object
  *                           properties:
  *                             pageSize:
  *                               type: number
  *                               description: The section pagination's pageSize.
  *                               example: 10
  *                             pageIndex:
  *                               type: number
  *                               description: The section pagination's pageIndex.
  *                               example: 0
  *                             total:
  *                               type: number
  *                               description: The section pagination's total.
  *                               example: 1
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
 @httpGet('/paging')
 private async paging(
   @requestHeaders('authorization') authHeader: string,
   @queryParam('key') key: string,
   @queryParam('index') index: number,
   @request() request: Request, @response() response: Response, @next() next: Function,
 ) {
   try {
     getUserFromToken(authHeader, request.cookies['r-token']);

     const result = await this.pagingSectionAction.execute(key, index);
     
     response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
   } catch (e) {
     const code = getResponseDataCode(e.name);
     response.status(code).json(ResponseFailure(code, e.stack));
     next(e);
   }
 }

  /**
* @swagger
  * /section/create:
  *   post:
  *     summary: Create section.
  *     description: Create section.
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
  *                 description: The section's number.
  *                 example: 1
  *               header:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section's header.
  *                 example: "Foodie Trails"
  *               uri:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section's uri.
  *                 example: "https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Mobile_App-09.png"
  *               color:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section's color.
  *                 example: "#B267A9"
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
  *                       description: section's key.
  *                       example: "123456"
  *                     sequence:
  *                       type: number
  *                       description: The section's number.
  *                       example: 1
  *                     header:
  *                       type: string
  *                       description: The section's header.
  *                       example: "Foodie Trails"
  *                     uri:
  *                       type: string
  *                       description: The section's uri.
  *                       example: "https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Mobile_App-09.png"
  *                     color:
  *                       type: string
  *                       description: The section's color.
  *                       example: "#B267A9"
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
      
      const result = await this.createSectionAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sequence is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Header is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Image uri is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Color is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sequence existed!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /section/edit:
  *   post:
  *     summary: Edit section.
  *     description: Edit section.
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
  *                 description: The section's number.
  *                 example: 1
  *               header:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section's header.
  *                 example: "Foodie Trails"
  *               uri:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section's uri.
  *                 example: "https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Mobile_App-09.png"
  *               color:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section's color.
  *                 example: "#B267A9"
  *               _key:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section's key.
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
  *                       description: section's id.
  *                       example: "Section/123456"
  *                     _key:
  *                       type: string
  *                       description: section's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: section's revision.
  *                       example: _blDWGNW---
  *                     _oldRev:
  *                       type: string
  *                       description: section's old revision.
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

      const result = await this.editSectionAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Sequence is empty!'));
      if (result == -2) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Header is empty!'));
      if (result == -3) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Image uri is empty!'));
      if (result == -4) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Color is empty!'));
      if (result == -5) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -11) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This section is not exist!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(result));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /section/delete:
  *   delete:
  *     summary: Delete section.
  *     description: Delete section.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the section.
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

      const result = await this.deleteSectionAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This section is not exist!'));
      if (result == -13) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Fail to remove Section Trail data!'));
      
      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }

  /**
* @swagger
  * /section/addtrail:
  *   post:
  *     summary: Add trail to section.
  *     description: Add trail to section.
  *     security:
  *       - apikey: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               sectionkey:
  *                 type: string
  *                 allowEmptyValue: false
  *                 description: The section key.
  *                 example: "123456"
  *               trailkey:
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
  *                       description: section's id.
  *                       example: "SectionTrail/123456"
  *                     _key:
  *                       type: string
  *                       description: section's key.
  *                       example: "123456"
  *                     _rev:
  *                       type: string
  *                       description: section's revision.
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
  @httpPost('/addtrail')
  private async addTrail(
    @requestHeaders('authorization') authHeader: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.createSectionTrailAction.execute(token, request.body);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Section Key is empty!'));
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
  * /section/removetrail:
  *   delete:
  *     summary: Remove trail from section.
  *     description: Remove trail from section.
  *     security:
  *       - apikey: []
  *     parameters:
  *       - in: query
  *         name: key
  *         required: true
  *         allowEmptyValue: false
  *         description: Key of the TrailSection.
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
  @httpDelete('/removetrail')
  private async removeTrail(
    @requestHeaders('authorization') authHeader: string,
    @queryParam('key') key: string,
    @request() request: Request, @response() response: Response, @next() next: Function,
  ) {
    try {
      const token = getUserFromToken(authHeader, request.cookies['r-token']);
      
      const result = await this.deleteSectionTrailAction.execute(token, key);
      if (result == -1) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'Key is empty!'));
      if (result == -10) return response.status(ResponseDataCode.ValidationError).json(ResponseFailure(ResponseDataCode.ValidationError, 'This section is not exist!'));

      response.status(ResponseDataCode.OK).json(ResponseSuccess(''));
    } catch (e) {
      const code = getResponseDataCode(e.name);
      response.status(code).json(ResponseFailure(code, e.stack));
      next(e);
    }
  }
}