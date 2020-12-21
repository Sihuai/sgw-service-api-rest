import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import moment from 'moment';
import { SectionService } from '../../../app/service/section.service';
import { IOC_TYPE } from '../../../config/type';
import { ISectionDTO } from '../../../domain/dtos/i.section.dto';
import { Section } from '../../../domain/models/section';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ISectionDTO> {
  _key: string;
  sequence: number;
  header: string;
  uri: string;
  color: string;
}

@provide(IOC_TYPE.EditSectionAction, true)
@provide('action', true)
export class EditSectionAction implements IAction {
  payloadExample = `
  {
    "_key": "123456",
    "sequence": 1,
    "header": "NEW Trails",
    "uri": "https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Main_Page_Mobile_App_201123_08@3x.png",
    "color": "#5DB4E4"
  }
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionServiceImpl) public sectionService: SectionService,
  ) {}
  async execute(token, request: IRequest) : Promise<any> {

    if (request.sequence < 0) return -1; // Sequence is empty!
    if (isEmptyObject(request.header) == true) return -2; // Header is empty!
    if (isEmptyObject(request.uri) == true) return -3; // Image uri is empty!
    if (isEmptyObject(request.color) == true) return -4; // Color is empty!
    if (isEmptyObject(request._key) == true) return -5;      // Key is empty!

    const model = new Section();
    model._key = request._key;
    model.sequence = request.sequence;
    model.header = request.header;
    model.uri = request.uri;
    model.color = request.color;
    model.datetimeLastEdited = moment().utc().format('YYYY-MM-DD HH:mm:ss');
    model.userLastUpdated = token.email;

    return await this.sectionService.editOne(model);
  }
}