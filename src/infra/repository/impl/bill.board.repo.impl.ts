import { provide } from "inversify-binding-decorators";
import { AppErrorUnexpected } from "../../../app/errors/unexpected";
import { IOC_TYPE } from "../../../config/type";
import { BillBoard } from "../../../domain/models/bill.board";
import { createConnection } from "../../utils/oct-orm";
import { ormSGWConnParam } from "../../utils/orm.sgw.conn.param";
import { BillBoardRepo } from "../bill.board.repo";

@provide(IOC_TYPE.BillBoardRepoImpl)
export class BillBoardRepoImpl implements BillBoardRepo {
  select(filters) {
    createConnection({...ormSGWConnParam, entities: [BillBoard]}).then(async con => {
        try {
          const repo = con.repositoryFor<BillBoard>("test");
        
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