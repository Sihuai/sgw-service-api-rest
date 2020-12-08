import { TrailTrailDetail } from '../../domain/models/trail.trail.detail';
import { BaseService } from './base.service';

export interface TrailTrailDetailService extends BaseService<TrailTrailDetail> {
    findAllBy(filters) : Promise<TrailTrailDetail[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: TrailTrailDetail): Promise<any>;
    removeOne(model: TrailTrailDetail): Promise<any>;
    removeBy(filters): Promise<any>;
}