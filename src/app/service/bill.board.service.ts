import { BillBoard } from '../../domain/models/bill.board';
import { BaseService } from './base.service';

export interface BillBoardService extends BaseService<BillBoard> {
    findAll() : Promise<any>;
    findAllBy(filters) : Promise<any>;
    findOneBy(filters) : Promise<BillBoard>;
    addOne(model: BillBoard): Promise<any>;
    editOne(model: BillBoard): Promise<any>;
    removeOne(model: BillBoard): Promise<any>;
}