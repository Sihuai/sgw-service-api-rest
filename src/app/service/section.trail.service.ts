import { SectionTrail } from '../../domain/models/section.trail';
import { BaseService } from './base.service';

export interface SectionTrailService extends BaseService<SectionTrail> {
    findAllBy(filters) : Promise<SectionTrail[]>;
    page(filters, pageIndex: number, pageSize: number) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    addOne(model: SectionTrail): Promise<any>;
    removeOne(model: SectionTrail): Promise<any>;
    removeBy(user: string, filters): Promise<any>;
}