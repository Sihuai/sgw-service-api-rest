import { AnimationPlayback } from '../../domain/models/animation.playback';
import { BaseService } from './base.service';

export interface AnimationPlaybackService extends BaseService<AnimationPlayback> {
    findAllBy(filters) : Promise<AnimationPlayback[]>;
    findOneBy(filters) : Promise<any>;
    addOne(model: AnimationPlayback): Promise<any>;
    removeOne(model: AnimationPlayback): Promise<any>;
    removeBy(filters): Promise<any>;
}