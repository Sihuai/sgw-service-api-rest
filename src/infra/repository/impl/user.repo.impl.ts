import { provide } from "inversify-binding-decorators";
import { AppErrorUnexpected } from "../../../app/errors/unexpected";
import { IOC_TYPE } from "../../../config/type";
import { User } from "../../../domain/models/user";
import { createConnection } from "../../utils/oct-orm";
import { ormTGConnParam } from "../../utils/orm.tg.conn.param";
import { UserRepo } from "../user.repo";

@provide(IOC_TYPE.UserRepoImpl)
export class UserRepoImpl implements UserRepo {
  select(filters) {
    createConnection({...ormTGConnParam, entities: [User]}).then(async con => {
        try {
          const repo = con.repositoryFor<User>("Users");
        
          const result = await repo.findBy(filters);
          if(!result) return null;
          
          return result;
        } catch (e) {
          throw new AppErrorUnexpected(e);
        } finally {
          con.db.close();
        }
    });
  }
}