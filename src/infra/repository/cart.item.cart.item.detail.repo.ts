export interface CartItemCartItemDetailRepo {
    selectAllBy(filters) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    insert(model) : Promise<any>;
    deleteByKey(key: any) : Promise<any>;
}
