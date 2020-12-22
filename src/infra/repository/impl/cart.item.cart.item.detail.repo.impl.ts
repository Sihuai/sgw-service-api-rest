import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { CartItemCartItemDetail } from "../../../domain/models/cart.item.cart.item.detail";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { CartItemCartItemDetailRepo } from "../cart.item.cart.item.detail.repo";

@provide(IOC_TYPE.CartItemCartItemDetailRepoImpl)
export class CartItemCartItemDetailRepoImpl implements CartItemCartItemDetailRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [CartItemCartItemDetail]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<CartItemCartItemDetail>("CartItemCartItemDetail");
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
    const con = await createConnection({...ormSGWConnParam, entities: [CartItemCartItemDetail]});

    try {
      const repo = con.repositoryFor<CartItemCartItemDetail>("CartItemCartItemDetail");
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
    const con = await createConnection({...ormSGWConnParam, entities: [CartItemCartItemDetail]});

    try {
      const repo = con.repositoryFor<CartItemCartItemDetail>("CartItemCartItemDetail");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [CartItemCartItemDetail]});

    try {
      const repo = con.repositoryFor<CartItemCartItemDetail>("CartItemCartItemDetail");
      const result = await repo.edgeDeleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}