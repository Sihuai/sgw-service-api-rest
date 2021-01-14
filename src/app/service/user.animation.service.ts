import { UserAnimation } from '../../domain/models/user.animation';
import { BaseService } from './base.service';

export interface UserAnimationService extends BaseService<UserAnimation> {
    findAllBy(filters) : Promise<UserAnimation[]>;
    findAllByKey(key) : Promise<UserAnimation[]>;
    findOneBy(filters) : Promise<UserAnimation>;
    addOne(model: UserAnimation): Promise<any>;
    editOne(email: string, orderItemKey: string, next: number): Promise<any>;
}