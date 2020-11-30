import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { Token } from "../../../domain/models/token";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormTGConnParam } from "../../utils/orm.tg.conn.param";
import { TokenRepo } from "../token.repo";

@provide(IOC_TYPE.TokenRepoImpl)
export class TokenRepoImpl implements TokenRepo {
  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormTGConnParam, entities: [Token]});

    try {
      const aql = {
        for: 'doc',
        filter: parseFilter(filters),
        return: 'doc'
      };

      const repo = con.repositoryFor<Token>("Tokens");
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
    const con = await createConnection({...ormTGConnParam, entities: [Token]});

    try {
      const repo = con.repositoryFor<Token>("Tokens");
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
    const con = await createConnection({...ormTGConnParam, entities: [Token]});

    try {
      const repo = con.repositoryFor<Token>("Tokens");
      const result = await repo.findOneBy(filters);

      return result != null ? true : false;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormTGConnParam, entities: [Token]});

    try {
      const repo = con.repositoryFor<Token>("Tokens");
      const result = await repo.create(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormTGConnParam, entities: [Token]});

    try {
      const repo = con.repositoryFor<Token>("Tokens");
      const result = await repo.update(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
  
  async deleteByKey(key: string) : Promise<any>  {
    const con = await createConnection({...ormTGConnParam, entities: [Token]});

    try {
      const repo = con.repositoryFor<Token>("Tokens");
      const result = await repo.deleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async deleteByKeys(keys: string[]) : Promise<any>  {
    const con = await createConnection({...ormTGConnParam, entities: [Token]});

    try {
      const repo = con.repositoryFor<Token>("Tokens");
      const result = await repo.deleteByKey(keys);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}