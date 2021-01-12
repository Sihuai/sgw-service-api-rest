import { ArrayOr } from "../utils/oct-orm/types/array.or.type";

export interface AnimationRepo {
    selectAllBy(filters) : Promise<any>;
    selectAllByKey(key: string);
    selectAllByKey(keys: string[]);
    selectAllByKey(keys: ArrayOr<string>) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
    deleteByKey(key: any) : Promise<any>;
}
