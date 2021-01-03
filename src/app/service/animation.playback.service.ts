import { AnimationPlayback } from '../../domain/models/animation.playback';
import { BaseService } from './base.service';

export interface AnimationPlaybackService extends BaseService<AnimationPlayback> {
    findAllBy(filters) : Promise<AnimationPlayback[]>;
    findAllByKey(key) : Promise<AnimationPlayback[]>;
    findOneBy(filters) : Promise<AnimationPlayback>;
    addOne(model: AnimationPlayback): Promise<any>;
    editOne(model: AnimationPlayback): Promise<any>;
    removeOne(model: AnimationPlayback): Promise<any>;
}