import { TrailDetail } from '../../domain/models/trail.detail';
import { BaseService } from './base.service';

export interface TrailDetailService extends BaseService<TrailDetail> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<TrailDetail[]>;
    findAllByKey(key) : Promise<any>;
    findOneBy(filters) : Promise<TrailDetail>;
    addOne(trailKey: string, model: TrailDetail): Promise<any>;
    editOne(model: TrailDetail): Promise<any>;
    removeOne(model: TrailDetail): Promise<any>;
}