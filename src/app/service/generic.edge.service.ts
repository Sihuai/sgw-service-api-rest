import { GenericEdge } from '../../domain/models/generic.edge';
import { BaseService } from './base.service';

export interface GenericEdgeService extends BaseService<GenericEdge> {
    findAllBy(filters) : Promise<GenericEdge[]>;
    page(filters, pageIndex: number, pageSize: number) : Promise<any>;
    findOneBy(filters) : Promise<GenericEdge>;
    addOne(model: GenericEdge): Promise<any>;
    removeOne(model: GenericEdge): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}