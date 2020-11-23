import { BaseService } from './base.service';

export interface HomeService extends BaseService<any> {
    find() : Promise<any>;
    // resetpwrequest(filters): Promise<User>;
    // resetpwexecute(filters): Promise<User>;
}