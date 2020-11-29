import { Card } from '../../domain/models/card';
import { BaseService } from './base.service';

export interface CardService extends BaseService<Card> {
    findAll() : Promise<any[]>;
    page(filters) : Promise<Card[]>;
    findOne(filters) : Promise<any>;
    addOne(model: Card): Promise<any>;
    editOne(model: Card): Promise<any>;
    removeOne(model: Card): Promise<any>;
}