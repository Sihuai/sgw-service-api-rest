import { User } from '../../domain/models/user';
import { BaseService } from './base.service';

export interface UserService extends BaseService<User> {
    findAll(filters) : Promise<User[]>;
    findOne(filters) : Promise<User>;
    addOne(model: User): Promise<User>;
    editOne(model: User): Promise<User>;
    removeOne(model: User): Promise<any>;
    resetPWRequest(filters): Promise<User>;
    resetPWExecute(filters, pwhash: string): Promise<any>;
}