import { Section } from '../../domain/models/section';
import { BaseService } from './base.service';

export interface SectionService extends BaseService<Section> {
    findAll() : Promise<any[]>;
    page(sectionKey: string, pageIndex: number, pageSize: number) : Promise<any>;
    findOneBy(filters) : Promise<any>;
    addOne(model: Section): Promise<any>;
    editOne(model: Section): Promise<any>;
    removeOne(model: Section): Promise<any>;
}