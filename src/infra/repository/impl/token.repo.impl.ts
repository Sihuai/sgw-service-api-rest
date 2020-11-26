import { provide } from "inversify-binding-decorators";
import { AppErrorUnexpected } from "../../../app/errors/unexpected";
import { IOC_TYPE } from "../../../config/type";
import { Token } from "../../../domain/models/token";
import { createConnection } from "../../utils/oct-orm";
import { ormTGConnParam } from "../../utils/orm.tg.conn.param";
import { TokenRepo } from "../token.repo";

@provide(IOC_TYPE.TokenRepoImpl)
export class TokenRepoImpl implements TokenRepo {
  select(filters) {
    createConnection({...ormTGConnParam, entities: [Token]}).then(async con => {
        try {
          const repo = con.repositoryFor<Token>("test");
        
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

  delete(filters) {
    createConnection({...ormTGConnParam, entities: [Token]}).then(async con => {
        try {
          const repo = con.repositoryFor<Token>("test");
        
          const result = repo.findBy(filters);
          if(!result) return;
          
          // repo.deleteByKey(result.key);
        } catch (e) {
          throw new AppErrorUnexpected(e);
        } finally {
          con.db.close();
        }
    });
  }
}