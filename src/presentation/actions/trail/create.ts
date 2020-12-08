import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { TrailService } from '../../../app/service/trail.service';
import { IOC_TYPE } from '../../../config/type';
import { Media } from '../../../domain/models/media';
import { ITrailDTO, Trail } from '../../../domain/models/trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ITrailDTO> {
  sequence: number;
  title: string;
  media: Media;
}

@provide(IOC_TYPE.CreateTrailAction, true)
@provide('action', true)
export class CreateTrailAction implements IAction {
  payloadExample = `
  {
    "sequence": 1,
    "title": "BUGIS Trail",
    "media": {
      "title": "BUGIS Trail",
      "media": {
        "uri": "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png",
        "type": "PHOTO",
        "orientation": "LANDSCAPE",
        "format": "3R"
      },
      "sequence": 0
    }
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailServiceImpl) public trailService: TrailService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (request.sequence < 0) return -1; // Sequence is empty!
    if (isEmptyObject(request.title) == true) return -2; // Title is empty!
    if (isEmptyObject(request.media) == true) return -3; // Media is empty!

    const model = new Trail();
    model.sequence = request.sequence;
    model.title = request.title;
    model.media = request.media;
    
    return await this.trailService.addOne(model);
  }
}