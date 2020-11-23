import { Token } from '../../domain/models/token';
import { User } from '../../domain/models/user';
import { BaseService } from './base.service';

export interface TokenService extends BaseService<Token> {
    find(filters) : Promise<Token>;
    add(model: User): Promise<Token>;
    remove(filters): Promise<void>;
}