export interface TokenRepo {
  selectAllBy(filters) : Promise<any>;
  selectOneBy(filters) : Promise<any>;
  existsBy(filters) : Promise<boolean>;
  insert(model) : Promise<any>;
  update(model) : Promise<any>;
  deleteByKeys(keys: string[]) : Promise<any>;
}