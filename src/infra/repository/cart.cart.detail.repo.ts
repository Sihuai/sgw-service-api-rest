export interface CartCartDetailRepo {
    selectAllBy(filters) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    insert(model) : Promise<any>;
    deleteByKey(key: any) : Promise<any>;
}