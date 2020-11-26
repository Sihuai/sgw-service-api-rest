import { User } from '../../domain/models/user';
import { BaseService } from './base.service';

export interface UserService extends BaseService<User> {
    search(filters) : Promise<User>;
    // resetpwrequest(filters): Promise<User>;
    // resetpwexecute(filters): Promise<User>;
}