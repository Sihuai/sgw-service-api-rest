export interface GenericEdgeRepo {
    selectAllBy(filters) : Promise<any>;
    page(filters, pageIndex: number, pageSize: number) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
}
