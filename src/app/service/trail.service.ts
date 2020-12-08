import { Trail } from '../../domain/models/trail';
import { PageResult } from '../../infra/utils/oct-orm/types/pageResult';
import { BaseService } from './base.service';

export interface TrailService extends BaseService<Trail> {
    findAll() : Promise<any[]>;
    page(filters) : Promise<any>;
    pageByKey(key) : Promise<PageResult>;
    findAllBy(filters) : Promise<Trail>;
    findAllByKey(filters) : Promise<any>;
    findOne(filters) : Promise<any>;
    addOne(model: Trail): Promise<any>;
    editOne(model: Trail): Promise<any>;
    removeOne(model: Trail): Promise<any>;
}