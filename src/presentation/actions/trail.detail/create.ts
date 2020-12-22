import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailDetailService } from '../../../app/service/trail.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { ITrailDetailDTO } from '../../../domain/dtos/i.trail.detail.dto';
import { BillBoard } from '../../../domain/models/bill.board';
import { TrailDetail, TrailDetailSection } from '../../../domain/models/trail.detail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ITrailDetailDTO> {
  trailkey: string;
  name: string;
  personas: BillBoard[];
  sections: TrailDetailSection[];
}

@provide(IOC_TYPE.CreateTrailDetailAction, true)
@provide('action', true)
export class CreateTrailDetailAction implements IAction {
  payloadExample = `
  {
    "name": "Bugis Trail",
    "billboard": [
      {
        "type": "CAROURSEL",
        "contents": [
          {
            "type": "PHOTO",
            "tag": "TOURIST-INDIVIDUAL",
            "orientation": "LANDSCAPE",
            "format": "3R",
            "uri": "https://fs.zulundatumsolutions.net:3001/images/personas/SGW_Png_Images_Main_Page_Mobile_App_201123_14@3x.png",
            "data": {
              "price": 12.0,
              "currency": "SGD",
              "content": "Tourist Individual participation information here...."
            },
            "sequence": 0
          }
        ]
      }
    ],
    "sections": [
      {
        "type": "PRICE",
        "contents": [
          {
            "price": "T.B.A",
            "includeAddToCart": {
              "icon": true,
              "text": true,
              "button": true,
              "caption": "Add to CartItem"
            }
          }
        ],
        "sequence": 0
      }
    ]
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailDetailServiceImpl) private trailDetailService: TrailDetailService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (isEmptyObject(request.name) == true) return -1; // Name is empty!
    if (isEmptyObject(request.personas) == true) return -2; // Personas is empty!
    if (isEmptyObject(request.sections) == true) return -3; // Sections is empty!
    if (isEmptyObject(request.trailkey) == true) return -4; // Trail Key is empty!

    for (let persona of request.personas) {
      if (isEmptyObject(persona.type) == true) return -5; // Persona's type is empty!
      if (isEmptyObject(persona.contents) == true) return -6; // Persona's contents is empty!

      for (let content of persona.contents) {
        if (content.sequence < 0) return -7; // Persona's contents sequence less than zero!

        if (isEmptyObject(content.type) == true) return -8; // Persona's contents type is empty!
        if (isEmptyObject(content.orientation) == true) return -9; // Persona's contents orientation is empty!
        if (isEmptyObject(content.format) == true) return -100; // Persona's contents format is empty!
        if (isEmptyObject(content.uri) == true) return -101; // Persona's contents URI is empty!
        if (isEmptyObject(content.tag) == true) return -102; // Persona's contents tag is empty!

        if (isEmptyObject(content.data) == true) return -103; // Persona's contents data is empty!
        if (content.data != undefined && isEmptyObject(content.data.content) == true) return -104; // Persona's contents data content is empty!
        if (content.data != undefined && isEmptyObject(content.data.price) == true) return -105; // Persona's contents data price is empty!
        
        if (content.data != undefined && content.data.price != undefined && content.data.price.value < 0) return -106; // Persona's contents data price value less than zero!
        if (content.data != undefined && content.data.price != undefined && isEmptyObject(content.data.price.currency) == true) return -107; // Persona's contents data price currency is empty!
      }
    }

    for (let section of request.sections) {
      if (section.sequence < 0) return -108; // Section's sequence less than zero!
      if (isEmptyObject(section.type) == true) return -109; // Section's type is empty!
      if (isEmptyObject(section.contents) == true) return -110; // Section's contents is empty!
    }

    const model = new TrailDetail();
    model.name = request.name;
    model.personas = request.personas;
    model.sections = request.sections;
    model.userCreated = token.email;
    model.userLastUpdated = token.email;

    return await this.trailDetailService.addOne(request.trailkey, model);
  }
}