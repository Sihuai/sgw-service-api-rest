import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { Trail } from "../../../domain/models/trail";
import { createConnection } from "../../utils/oct-orm";
import { ArrayOr } from "../../utils/oct-orm/types/array.or.type";
import { PageResult } from "../../utils/oct-orm/types/pageResult";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { TrailRepo } from "../trail.repo";

@provide(IOC_TYPE.TrailRepoImpl)
export class TrailRepoImpl implements TrailRepo {
  async selectAll() : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const repo = con.repositoryFor<Trail>("Trail");
      const result = await repo.findAll(false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async page(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const aql = {
        for: 'i',
        filter: parseFilter(filters),
        return: 'i'
      };
      
      const repo = con.repositoryFor<Trail>("Trail");
      const result = await repo.paginationBy(aql, false);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async pageByKey(key: string) : Promise<PageResult>;
  async pageByKey(keys: string[]) : Promise<PageResult>;
  async pageByKey(keys: ArrayOr<string>) : Promise<PageResult> {
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const isMulti = Array.isArray(keys);
      keys = (isMulti ? keys : [keys]) as string[];

      const limit = {
        offset: 1,
        count: 10
      };

      const repo = con.repositoryFor<Trail>("Trail");
      const result = await repo.paginationByKey(keys, "", limit, false);

      // if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };

      const repo = con.repositoryFor<Trail>("Trail");
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
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const isMulti = Array.isArray(keys);
      keys = (isMulti ? keys : [keys]) as string[];

      const repo = con.repositoryFor<Trail>("Trail");
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
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const repo = con.repositoryFor<Trail>("Trail");
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
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const repo = con.repositoryFor<Trail>("Trail");
      const result = await repo.findOneBy(filters, false);

      return result != null ? true : false;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const repo = con.repositoryFor<Trail>("Trail");
      const result = await repo.create(model, false);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const repo = con.repositoryFor<Trail>("Trail");
      const result = await repo.update(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}

  async deleteByKey(key: string) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [Trail]});

    try {
      const repo = con.repositoryFor<Trail>("Trail");
      const result = await repo.deleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}