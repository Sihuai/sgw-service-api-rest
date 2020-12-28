import { ArrayOr } from "../utils/oct-orm/types/array.or.type";

export interface OrderItemRepo {
    selectAll() : Promise<any>;
    selectAllBy(filters) : Promise<any>;
    selectAllByKey(key: string);
    selectAllByKey(keys: string[]);
    selectAllByKey(keys: ArrayOr<string>) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    countBy(filters) : Promise<any>;
    existsBy(filters) : Promise<boolean>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
    deleteByKey(key: string) : Promise<any>;
}