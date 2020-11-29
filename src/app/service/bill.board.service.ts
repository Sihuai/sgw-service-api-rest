import { BillBoard } from '../../domain/models/bill.board';
import { BaseService } from './base.service';

export interface BillBoardService extends BaseService<BillBoard> {
    findAll() : Promise<any[]>;
    findOne(filters) : Promise<any>;
    addOne(model: BillBoard): Promise<any>;
    editOne(model: BillBoard): Promise<any>;
    removeOne(model: BillBoard): Promise<any>;
}