import { Section } from '../../domain/models/section';
import { BaseService } from './base.service';

export interface SectionService extends BaseService<Section> {
    search() : any[];
}