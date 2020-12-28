export interface UserPaymentAccountRepo {
    selectAllBy(filters) : Promise<any>;
    page(filters) : Promise<any>;
    selectOneBy(filters) : Promise<any>;
    insert(model) : Promise<any>;
    update(model) : Promise<any>;
    deleteByKey(key: any) : Promise<any>;
}
