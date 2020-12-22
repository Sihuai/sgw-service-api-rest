import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { TrailService } from '../../../app/service/trail.service';
import { IOC_TYPE } from '../../../config/type';
import { ITrailDTO } from '../../../domain/dtos/i.trail.dto';
import { Media } from '../../../domain/models/media';
import { Trail } from '../../../domain/models/trail';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ITrailDTO> {
  _key: string;
  isActive: boolean;
  sequence: number;
  title: string;
  media: Media;
}

@provide(IOC_TYPE.EditTrailAction, true)
@provide('action', true)
export class EditTrailAction implements IAction {
  payloadExample = `
    "_key": "123456",
    "isActive": True,
    "sequence": 1,
    "title": 'Trail',
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
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.TrailServiceImpl) private trailService: TrailService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (request.sequence < 0) return -1; // Sequence is empty!
    if (isEmptyObject(request.title) == true) return -2; // Title is empty!
    if (isEmptyObject(request.media) == true) return -3; // Media is empty!
    if (isEmptyObject(request.media.type) == true) return -4; // Trail's type is empty!
    if (isEmptyObject(request.media.orientation) == true) return -5; // Trail's orientation is empty!
    if (isEmptyObject(request.media.format) == true) return -6; // Trail's format is empty!
    if (isEmptyObject(request.media.uri) == true) return -7; // Trail's URI is empty!

    const filters = {sequence: request.sequence, isActive: true};
    const result = await this.trailService.findAllBy(filters);
    if (isEmptyObject(result) == true) return -8; // Sequence is not existed!

    if (isEmptyObject(request._key) == true) return -9;      // Key is empty!
    if (result[0]._key != request._key) return -100; // Sequence is used to other trail!

    const model = new Trail();
    model._key = request._key;
    model.isActive = request.isActive;
    model.sequence = request.sequence;
    model.title = request.title;
    model.media = request.media;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;

    return await this.trailService.editOne(model);
  }
}