import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { SectionService } from '../../../app/service/section.service';
import { IOC_TYPE } from '../../../config/type';
import { Card } from '../../../domain/models/card';
import { ISectionDTO, Section } from '../../../domain/models/section';
import { isEmptyObject } from '../../../infra/utils/data.validator';
import { INullable } from '../../../infra/utils/types';
import { IAction } from '../base.action';

interface IRequest extends INullable<ISectionDTO> {
  sequence: number;
  header: string;
  uri: string;
  color: string;
  cards: Card[];
}

@provide(IOC_TYPE.CreateSectionAction, true)
@provide('action', true)
export class CreateSectionAction implements IAction {
  payloadExample = `
    "sequence": 1,
    "header": 'NEW Trails',
    "uri": 'https://fs.zulundatumsolutions.net:3001/images/SGW_Png_Images_Main_Page_Mobile_App_201123_08@3x.png',
    "color": '#5DB4E4',
    "cards": [
			{
				"title": "BUGIS Trail",
				"media": {
					"uri": "https://fs.zulundatumsolutions.net:3001/images/posters/SGW_Png_Images_Main_Page_Mobile_App_201123_18@3x.png",
					"type": "PHOTO",
					"orientation": "LANDSCAPE",
					"format": "3R"
				},
				"sequence": 0
			}
		],
  `;
  description = '';
  constructor(
    @inject(IOC_TYPE.SectionServiceImpl) public sectionService: SectionService,
  ) {}
  async execute(request: IRequest) : Promise<any> {

    if (request.sequence < 0) return -1; // Sequence is empty!
    if (isEmptyObject(request.header) == true) return -2; // Header is empty!
    if (isEmptyObject(request.uri) == true) return -3; // Image uri is empty!
    if (isEmptyObject(request.color) == true) return -4; // Color is empty!
    if (request.cards.length == 0) return -5; // Cards is empty!

    const model = new Section();
    model.sequence = request.sequence;
    model.header = request.header;
    model.uri = request.uri;
    model.color = request.color;
    model.cards = request.cards;
    
    return await this.sectionService.addOne(model);
  }
}