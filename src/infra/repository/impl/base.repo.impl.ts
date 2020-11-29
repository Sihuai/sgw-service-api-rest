// import { injectable } from "inversify";
// import { ConnectionOptions, createConnection } from "../../utils/oct-orm";
// import { ormTGConnParam } from "../../utils/orm.tg.conn.param";

// @injectable()
// export class AbstractBaseRepo<T extends object, ss extends Function> {
//   async selectOneBy(options: Partial<ConnectionOptions>, filters) : Promise<any> {
//     createConnection({...ormTGConnParam, entities: [ss]}).then(async con => {
//       try {
//         const repo = con.repositoryFor<T>("Users");
      
//         const result = await repo.findOneBy(filters);
//         if(!result) return null;
        
//         return result;
//       } catch (e) {
//         throw e;
//       } finally {
//         con.db.close();
//       }
//     });
//   }

//   // async exists(model: Model, key: string) : Promise<boolean> {
//   //   const result = await model.findOne(key);
//   //   return result != null ? true : false;
//   // }

//   // async add(model: Model) : Promise<Model> {
//   //   const result = await model.insert();
//   //   return result;
//   // }

//   // async edit(model: Model) : Promise<Model>  {
//   //   const result = await model.save();
//   //   return result;
// 	// }

//   // async remove(model: Model) : Promise<Model>  {
//   //   const result = await model.remove();
//   //   return result;
//   // }
// }