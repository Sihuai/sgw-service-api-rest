import { OptionType } from '../../domain/models/option.type';
import { BaseService } from './base.service';

export interface OptionTypeService extends BaseService<OptionType> {
    findAll() : Promise<any[]>;
    findAllBy(filters) : Promise<any>;
    addOne(model: OptionType): Promise<any>;
    editOne(model: OptionType): Promise<any>;
    removeOne(model: OptionType): Promise<any>;
}