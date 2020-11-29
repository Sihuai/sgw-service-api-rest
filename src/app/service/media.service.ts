import { Media } from '../../domain/models/media';
import { BaseService } from './base.service';

export interface MediaService extends BaseService<Media> {
    findAll() : Promise<any[]>;
    findOne(filters) : Promise<any>;
    addOne(model: Media): Promise<any>;
    editOne(model: Media): Promise<any>;
    removeOne(model: Media): Promise<any>;
}