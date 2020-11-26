import { provide } from "inversify-binding-decorators";
import { AppErrorUnexpected } from "../../../app/errors/unexpected";
import { IOC_TYPE } from "../../../config/type";
import { Section } from "../../../domain/models/section";
import { createConnection } from "../../utils/oct-orm";
import { ormTGConnParam } from "../../utils/orm.tg.conn.param";
import { SectionRepo } from "../section.repo";

@provide(IOC_TYPE.SectionRepoImpl)
export class SectionRepoImpl implements SectionRepo {
  getAll() {
    createConnection({...ormTGConnParam, entities: [Section]}).then(async con => {
        try {
          const repo = con.repositoryFor<Section>("Section");
        
          // const result = await repo.findAll();
          // if(!result) return null;
          
          // return result;
          return null;
        } catch (e) {
          throw new AppErrorUnexpected(e);
        } finally {
          con.db.close();
        }
    });
  }

  select(filters) {
    createConnection({...ormTGConnParam, entities: [Section]}).then(async con => {
        try {
          const repo = con.repositoryFor<Section>("test");
        
          const result = repo.findBy(filters);
          if(!result) return null;
          
          return result;
        } catch (e) {
          throw new AppErrorUnexpected(e);
        } finally {
          con.db.close();
        }
    });
  }
}