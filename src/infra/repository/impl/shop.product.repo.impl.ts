import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { ShopProduct } from "../../../domain/models/shop.product";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { ShopProductRepo } from "../shop.product.repo";

@provide(IOC_TYPE.ShopProductRepoImpl)
export class ShopProductRepoImpl implements ShopProductRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [ShopProduct]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };
      
      const repo = con.repositoryFor<ShopProduct>("ShopProduct");
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
    const con = await createConnection({...ormSGWConnParam, entities: [ShopProduct]});

    try {
      const repo = con.repositoryFor<ShopProduct>("ShopProduct");
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
    const con = await createConnection({...ormSGWConnParam, entities: [ShopProduct]});

    try {
      const repo = con.repositoryFor<ShopProduct>("ShopProduct");
      const result = await repo.edgeCreate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [ShopProduct]});

    try {
      const repo = con.repositoryFor<ShopProduct>("ShopProduct");
      const result = await repo.edgeUpdate(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}

  async deleteByKey(key: any) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [ShopProduct]});

    try {
      const repo = con.repositoryFor<ShopProduct>("ShopProduct");
      const result = await repo.edgeDeleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}