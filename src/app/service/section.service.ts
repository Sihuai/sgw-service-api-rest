import { Section } from '../../domain/models/section';
import { BaseService } from './base.service';

export interface SectionService extends BaseService<Section> {
    findAll() : Promise<any[]>;
    findOne(filters) : Promise<any>;
    addOne(model: Section): Promise<any>;
    editOne(model: Section): Promise<any>;
    removeOne(model: Section): Promise<any>;
}