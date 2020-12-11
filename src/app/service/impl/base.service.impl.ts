import { injectable } from "inversify";

@injectable()
export class AbstractBaseService<Model extends object> {
  // async find(model: Model, key: string) : Promise<Model> {
  //   const result = await model.findOneBy(key);
  //   return result;
  // }

  // async exists(model: Model, key: string) : Promise<boolean> {
  //   const result = await model.findOneBy(key);
  //   return result != null ? true : false;
  // }

  // async add(model: Model) : Promise<Model> {
  //   const result = await model.insert();
  //   return result;
  // }

  // async edit(model: Model) : Promise<Model>  {
  //   const result = await model.save();
  //   return result;
	// }

  // async remove(model: Model) : Promise<Model>  {
  //   const result = await model.remove();
  //   return result;
  // }
}