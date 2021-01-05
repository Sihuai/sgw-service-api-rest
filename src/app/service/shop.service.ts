import { Shop } from '../../domain/models/shop';
import { PageResult } from '../../infra/utils/oct-orm/types/pageResult';
import { BaseService } from './base.service';

export interface ShopService extends BaseService<Shop> {
    findAll() : Promise<any[]>;
    page(filters) : Promise<PageResult>;
    pageByKey(key) : Promise<PageResult>;
    findAllBy(filters) : Promise<Shop>;
    findAllByKey(key) : Promise<Shop[]>;
    findOneBy(filters) : Promise<Shop>;
    addOne(model: Shop): Promise<any>;
    editOne(model: Shop): Promise<any>;
    removeOne(model: Shop): Promise<any>;
}