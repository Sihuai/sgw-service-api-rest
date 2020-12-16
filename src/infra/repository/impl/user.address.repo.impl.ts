import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { UserAddress } from "../../../domain/models/user.address";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { UserAddressRepo } from "../user.address.repo";

@provide(IOC_TYPE.UserAddressRepoImpl)
export class UserAddressRepoImpl implements UserAddressRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAddress]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<UserAddress>("UserAddress");
      const result = await repo.edgeFindAllBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async page(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAddress]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        limit: {
          offset: 0,
          count: 10
        },
        return: 'doc'
      };
      
      const repo = con.repositoryFor<UserAddress>("UserAddress");
      const result = await repo.paginationBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAddress]});

    try {
      const repo = con.repositoryFor<UserAddress>("UserAddress");
      const result = await repo.edgeFindOneBy(filters, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAddress]});

    try {
      const repo = con.repositoryFor<UserAddress>("UserAddress");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [UserAddress]});

    try {
      const repo = con.repositoryFor<UserAddress>("UserAddress");
      const result = await repo.edgeDeleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}