import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { UserPaymentAccount } from "../../../domain/models/user.payment.account";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { UserPaymentAccountRepo } from "../user.payment.account.repo";

@provide(IOC_TYPE.UserPaymentAccountRepoImpl)
export class UserPaymentAccountRepoImpl implements UserPaymentAccountRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [UserPaymentAccount]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<UserPaymentAccount>("UserPaymentAccount");
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
    const con = await createConnection({...ormSGWConnParam, entities: [UserPaymentAccount]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        limit: {
          pageIndex: 0,
          pageSize: 10
        },
        return: 'doc'
      };
      
      const repo = con.repositoryFor<UserPaymentAccount>("UserPaymentAccount");
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
    const con = await createConnection({...ormSGWConnParam, entities: [UserPaymentAccount]});

    try {
      const repo = con.repositoryFor<UserPaymentAccount>("UserPaymentAccount");
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
    const con = await createConnection({...ormSGWConnParam, entities: [UserPaymentAccount]});

    try {
      const repo = con.repositoryFor<UserPaymentAccount>("UserPaymentAccount");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [UserPaymentAccount]});

    try {
      const repo = con.repositoryFor<UserPaymentAccount>("UserPaymentAccount");
      const result = await repo.edgeUpdate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
  
  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [UserPaymentAccount]});

    try {
      const repo = con.repositoryFor<UserPaymentAccount>("UserPaymentAccount");
      const result = await repo.edgeDeleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}