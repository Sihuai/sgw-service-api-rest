export interface GenericEdgeRepo {
    selectAllBy(filters) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
}
