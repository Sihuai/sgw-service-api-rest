import { Token } from '../../domain/models/token';
import { User } from '../../domain/models/user';
import { BaseService } from './base.service';

export interface TokenService extends BaseService<Token> {
    search(filters) : Promise<Token>;
    create(model: User): Promise<Token>;
    remove(filters): Promise<void>;
}