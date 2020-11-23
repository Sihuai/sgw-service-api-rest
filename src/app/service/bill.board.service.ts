import { BillBoard } from '../../domain/models/bill.board';
import { BaseService } from './base.service';

export interface BillBoardService extends BaseService<BillBoard> {
    find() : Promise<BillBoard>;
}