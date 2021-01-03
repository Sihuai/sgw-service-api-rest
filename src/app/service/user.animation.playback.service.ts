import { UserAnimationPlayback } from '../../domain/models/user.animation.playback';
import { BaseService } from './base.service';

export interface UserAnimationPlaybackService extends BaseService<UserAnimationPlayback> {
    findAllBy(filters) : Promise<UserAnimationPlayback[]>;
    findAllByKey(key) : Promise<UserAnimationPlayback[]>;
    findOneBy(filters) : Promise<UserAnimationPlayback>;
    addOne(model: UserAnimationPlayback): Promise<any>;
    editOne(email: string, orderItemKey: string, next: number): Promise<any>;
}