import { Animation } from '../../domain/models/animation';
import { BaseService } from './base.service';

export interface AnimationService extends BaseService<Animation> {
    findAllBy(filters) : Promise<Animation[]>;
    findAllByKey(key) : Promise<Animation[]>;
    findOneBy(filters) : Promise<Animation>;
    addOne(model: Animation): Promise<any>;
    editOne(model: Animation): Promise<any>;
    removeOne(model: Animation): Promise<any>;
}