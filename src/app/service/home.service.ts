import { BaseService } from './base.service';

export interface HomeService extends BaseService<any> {
    findAll(filters) : Promise<any>;
}