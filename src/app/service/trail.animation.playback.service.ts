import { TrailAnimationPlayback } from '../../domain/models/trail.animation.playback';
import { BaseService } from './base.service';

export interface TrailAnimationPlaybackService extends BaseService<TrailAnimationPlayback> {
    findAllBy(filters) : Promise<TrailAnimationPlayback[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: TrailAnimationPlayback): Promise<any>;
    removeOne(model: TrailAnimationPlayback): Promise<any>;
}