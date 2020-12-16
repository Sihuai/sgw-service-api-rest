import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { CartCartDetail } from "../../../domain/models/cart.cart.detail";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { CartCartDetailRepo } from "../cart.cart.detail.repo";

@provide(IOC_TYPE.CartCartDetailRepoImpl)
export class CartCartDetailRepoImpl implements CartCartDetailRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [CartCartDetail]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<CartCartDetail>("CartCartDetail");
      const result = await repo.edgeFindAllBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [CartCartDetail]});

    try {
      const repo = con.repositoryFor<CartCartDetail>("CartCartDetail");
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
    const con = await createConnection({...ormSGWConnParam, entities: [CartCartDetail]});

    try {
      const repo = con.repositoryFor<CartCartDetail>("CartCartDetail");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [CartCartDetail]});

    try {
      const repo = con.repositoryFor<CartCartDetail>("CartCartDetail");
      const result = await repo.edgeDeleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}