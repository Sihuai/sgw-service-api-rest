import { CartDetail } from '../../domain/models/cart.detail';
import { BaseService } from './base.service';

export interface CartDetailService extends BaseService<CartDetail> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<CartDetail>;
    findAllByKey(filters) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    countBy(filters) : Promise<any>;
    addOne(model: CartDetail): Promise<any>;
    editOne(model: CartDetail): Promise<any>;
    removeOne(model: CartDetail): Promise<any>;
}