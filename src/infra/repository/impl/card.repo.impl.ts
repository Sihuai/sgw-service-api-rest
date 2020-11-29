import { provide } from "inversify-binding-decorators";
import { IOC_TYPE } from "../../../config/type";
import { Card } from "../../../domain/models/card";
import { createConnection } from "../../utils/oct-orm";
import { parseFilter } from "../../utils/oct-orm/utils/converter";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { CardRepo } from "../card.repo";

@provide(IOC_TYPE.CardRepoImpl)
export class CardRepoImpl implements CardRepo {
  async selectAll() : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const repo = con.repositoryFor<Card>("Card");
      const result = await repo.findAll();

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async page(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const aql = {
        for: 'i',
        filter: parseFilter(filters),
        return: 'i'
      };
      
      const repo = con.repositoryFor<Card>("Card");
      const result = await repo.pagination(aql);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectAllBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const repo = con.repositoryFor<Card>("Card");
      const result = await repo.findAllBy(filters);

      if(!result) return null;
      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async selectOneBy(filters) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const repo = con.repositoryFor<Card>("Card");
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
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const repo = con.repositoryFor<Card>("Card");
      const result = await repo.findOneBy(filters);

      return result != null ? true : false;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async insert(model) : Promise<any> {
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const repo = con.repositoryFor<Card>("Card");
      const result = await repo.create(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }

  async update(model) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const repo = con.repositoryFor<Card>("Card");
      const result = await repo.update(model);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
	}

  async deleteByKey(key: string) : Promise<any>  {
    const con = await createConnection({...ormSGWConnParam, entities: [Card]});

    try {
      const repo = con.repositoryFor<Card>("Card");
      const result = await repo.deleteByKey(key);

      return result;
    } catch (e) {
      throw e;
    } finally {
      con.db.close();
    }
  }
}