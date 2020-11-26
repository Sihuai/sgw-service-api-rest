import { BaseService } from './base.service';

export interface HomeService extends BaseService<any> {
    search() : Promise<any>;
    // resetpwrequest(filters): Promise<User>;
    // resetpwexecute(filters): Promise<User>;
}