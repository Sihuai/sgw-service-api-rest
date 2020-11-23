import { ObjectLiteral } from "../../common/ObjectLiteral";

export interface BaseService<Model extends ObjectLiteral> {
  find(model: Model, key: string) : Promise<Model>;
  exists(model: Model, key: string) : Promise<boolean>;
  add(model: Model) : Promise<Model>;
  edit(model: Model) : Promise<Model>;
  // remove(model: Model) : Promise<Model>;
}