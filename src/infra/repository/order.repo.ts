import { ArrayOr } from "../utils/oct-orm/types/array.or.type";

export interface OrderRepo {
    selectAll() : Promise<any>;
    selectAllBy(filters) : Promise<any>;
    selectAllByKey(key: string);
    selectAllByKey(keys: string[]);
    selectAllByKey(keys: ArrayOr<string>) : Promise<any>;
    page(filters, pageIndex: number, pageSize: number) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    existsBy(filters) : Promise<boolean>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
    deleteByKey(key: string) : Promise<any>;
}
