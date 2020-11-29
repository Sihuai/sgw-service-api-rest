import { Token } from '../../domain/models/token';
import { User } from '../../domain/models/user';
import { BaseService } from './base.service';

export interface TokenService extends BaseService<Token> {
    findAll(filters) : Promise<Token[]>;
    findOne(filters) : Promise<Token>;
    refresh(filters) : Promise<any>;
    addOne(model: User): Promise<Token>;
    removeOne(model: Token): Promise<any>;
}