import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { BillBoardService } from '../bill.board.service';
import { HomeService } from '../home.service';
import { SectionService } from '../section.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.HomeServiceImpl)
export class HomeServiceImpl extends AbstractBaseService<any> implements HomeService {
  constructor(
    @inject(IOC_TYPE.BillBoardServiceImpl) private billBoardService: BillBoardService,
    @inject(IOC_TYPE.SectionServiceImpl) private sectionService: SectionService,
  ) {
    super();
  }

  async findAll() : Promise<any> {
    try {
      const billBoards = await this.billBoardService.findAll();
      const sections = await this.sectionService.findAll();
      
      const home = {
        billboard: billBoards,
        sections: sections
      }

      return home;
    } catch(e) {
      throw e;
    }
  }
}