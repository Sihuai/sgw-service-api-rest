import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { TrailDetailService } from '../../../app/service/trail.detail.service';
import { IOC_TYPE } from '../../../config/type';
import { ITrailDetailDTO } from '../../../domain/dtos/i.trail.detail.dto';
import { BillBoard } from '../../../domain/models/bill.board';
import { TrailDetail, TrailDetailSection } from '../../../domain/models/trail.detail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ITrailDetailDTO> {
  _key: string;
  title: string;
  personas: BillBoard[];
  sections: TrailDetailSection[];
}

@provide(IOC_TYPE.EditTrailDetailAction, true)
@provide('action', true)
export class EditTrailDetailAction implements IAction {
  payloadExample = `
  {
    "_key": "123456",
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
              "caption": "Add to Cart"
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
    @inject(IOC_TYPE.TrailDetailServiceImpl) public trailDetailService: TrailDetailService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (isEmptyObject(request.title) == true) return -1;      // Title is empty!
    if (isEmptyObject(request.personas) == true) return -2;  // Bill board is empty!
    if (isEmptyObject(request.sections) == true) return -3;   // Sections is empty!
    if (isEmptyObject(request._key) == true) return -4;      // Key is empty!

    const model = new TrailDetail();
    model._key = request._key;
    model.title = request.title;
    model.personas = request.personas;
    model.sections = request.sections;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    
    return await this.trailDetailService.editOne(model);
  }
}