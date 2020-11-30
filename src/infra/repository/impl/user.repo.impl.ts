import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { BaseModel } from "../../../domain/models/base.model";
import { User } from "../../../domain/models/user";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormTGConnParam } from "../../utils/orm.tg.conn.param";
import { UserRepo } from "../user.repo";

@provide(IOC_TYPE.UserRepoImpl)
export class UserRepoImpl implements UserRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormTGConnParam, entities: [User]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };

      const repo = con.repositoryFor<User>("Users");
      const result = await repo.findAllBy(aql);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormTGConnParam, entities: [User]});

    try {
      const repo = con.repositoryFor<User>("Users");
      const result = await repo.findOneBy(filters);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async existsBy(filters) : Promise<boolean> {
    const con = await createConnection({...ormTGConnParam, entities: [User]});

    try {
      const repo = con.repositoryFor<User>("Users");
      const result = await repo.findOneBy(filters);

      return result != null ? true : false;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormTGConnParam, entities: [User, BaseModel]});

    try {
      const repo = con.repositoryFor("Users");
      const result = await repo.create(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormTGConnParam, entities: [User]});

    try {
      const repo = con.repositoryFor<User>("Users");
      const result = await repo.update(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}

  async deleteByKey(key: string) : Promise<any>  {
    const con = await createConnection({...ormTGConnParam, entities: [User]});

    try {
      const repo = con.repositoryFor<User>("Users");
      const result = await repo.deleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}