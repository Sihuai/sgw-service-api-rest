import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { IOC_TYPE } from '../../../config/type';
import { AppErrorUnexpected } from '../../errors/unexpected';
import { BillBoardService } from '../bill.board.service';
import { HomeService } from '../home.service';
import { SectionService } from '../section.service';
import { AbstractBaseService } from './base.service.impl';

@provide(IOC_TYPE.HomeServiceImpl)
export class HomeServiceImpl extends AbstractBaseService<any> implements HomeService {
    constructor(
        @inject(IOC_TYPE.BillBoardServiceImpl) public billBoardService: BillBoardService,
        @inject(IOC_TYPE.SectionServiceImpl) private sectionService: SectionService,
      ) {
        super();
    }
      
    async search() : Promise<any> {
        const billBoard = this.billBoardService.search();
        const sections = this.sectionService.search();

        const result = { billboard: billBoard, sections: sections }
        return result;
    }
}
