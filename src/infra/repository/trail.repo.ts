import { ArrayOr } from "../utils/oct-orm/types/array.or.type";
import { PageResult } from "../utils/oct-orm/types/pageResult";

export interface TrailRepo {
    selectAll() : Promise<any>;
    page(filter) : Promise<any>;
    pageByKey(key: string) : Promise<PageResult>;
    pageByKey(keys: string[]) : Promise<PageResult>;
    pageByKey(keys: ArrayOr<string>) : Promise<PageResult>;
    selectAllBy(filters) : Promise<any>;
    selectAllByKey(key: string);
    selectAllByKey(keys: string[]);
    selectAllByKey(keys: ArrayOr<string>) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    existsBy(filters) : Promise<boolean>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
    deleteByKey(key: string) : Promise<any>;
}
