import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { ProductCategory } from "../../../domain/models/product.category";
import { createConnection } from "../../utils/oct-orm";
import { ArrayOr } from "../../utils/oct-orm/types/array.or.type";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { ProductCategoryRepo } from "../product.category.repo";

@provide(IOC_TYPE.ProductCategoryRepoImpl)
export class ProductCategoryRepoImpl implements ProductCategoryRepo {
  async selectAll() : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.findAll(false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        sort: `doc.sequence`,
        return: 'doc'
      };
      
      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.findAllBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectAllByKey(key: string);
  async selectAllByKey(keys: string[]);
  async selectAllByKey(keys: ArrayOr<string>) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const isMulti = Array.isArray(keys);
      keys = (isMulti ? keys : [keys]) as string[];

      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.findByKey(keys, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.findOneBy(filters, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async existsBy(filters) : Promise<boolean> {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.findOneBy(filters, false);

      return result != null ? true : false;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.create(model, false);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.update(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}

  async deleteByKey(key: string) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [ProductCategory]});

    try {
      const repo = con.repositoryFor<ProductCategory>("ProductCategory");
      const result = await repo.deleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}