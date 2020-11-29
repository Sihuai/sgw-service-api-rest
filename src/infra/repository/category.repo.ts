export interface CategoryRepo {
    selectAll() : Promise<any>;
    selectAllBy(filters) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    existsBy(filters) : Promise<boolean>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
    deleteByKey(key: string) : Promise<any>;
}
