import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { BillBoardService } from '../bill.board.service';
import { CardService } from '../card.service';
import { HomeService } from '../home.service';
import { SectionService } from '../section.service';
import { AbstractBaseService } from './base.service.impl';
import { CategoryServiceImpl } from './category.service.impl';

@provide(IOC_TYPE.HomeServiceImpl)
export class HomeServiceImpl extends AbstractBaseService<any> implements HomeService {
  constructor(
    @inject(IOC_TYPE.BillBoardServiceImpl) public billBoardService: BillBoardService,
    @inject(IOC_TYPE.CategoryServiceImpl) public categoryServiceImpl: CategoryServiceImpl,
    @inject(IOC_TYPE.SectionServiceImpl) private sectionService: SectionService,
    @inject(IOC_TYPE.CardServiceImpl) private cardService: CardService,
  ) {
    super();
  }

  async findAll(filters) : Promise<any> {
    try {
      const billBoards = this.billBoardService.findAll();
      const categories = this.categoryServiceImpl.findAll();
      billBoards[0].contents = categories;
      
      const sections = this.sectionService.findAll();
      const cards = this.cardService.page(filters);
      
      return sections;
    } catch(e) {
      throw e;
    }
  }
}