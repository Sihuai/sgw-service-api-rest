import { SectionTrail } from '../../domain/models/section.trail';
import { BaseService } from './base.service';

export interface SectionTrailService extends BaseService<SectionTrail> {
    findAllBy(filters) : Promise<SectionTrail[]>;
    page(filters) : Promise<any>;
    findOne(filters) : Promise<any>;
    addOne(model: SectionTrail): Promise<any>;
    removeOne(model: SectionTrail): Promise<any>;
    removeBy(filters): Promise<any>;
}